#!/usr/bin/env bash
#
# Assemble the final cut from the per-scene keeper clips.
#
#   ./projects/quantum-bitcoin-entanglement/assemble.sh
#   → outputs/_assembly/final-noVO.mp4   (silent)
#   → outputs/_assembly/final-withVO.mp4 (Korean VO)
#
# Design notes worth keeping:
#
# * SINGLE ENCODE. The per-scene freeze-holds are applied with tpad *inside* the filter_complex, so
#   hold + cross-dissolve + fade-out all resolve in one pass at crf 15. An earlier multi-pass build
#   (hold → segment → concat, crf 18–23 veryfast) dropped the final from ~4.4 to 2.4 Mbps.
# * HOLDS vs D are different things. HOLD ("여운") is the freeze-frame dwell at the END of a scene;
#   D is the cross-dissolve length. Requests like "1→2, 1.8" mean scene 1's HOLD, not the dissolve.
# * The withVO mux re-encodes audio only (-c:v copy), so the video never takes a second generation.
#
set -euo pipefail

PROJ="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$PROJ/outputs"
ASM="$OUT/_assembly"
mkdir -p "$ASM"

# Scenes in order. 4 and 8 use the ORIGINAL clips: their baked-in labels have minor typos, but the
# user preferred those over the black patch plates the label pass needed. Everything else that has
# labels uses the burned `-labeled` variant (src/core/scripts/burn-labels.ts).
SRC=(
  "$OUT/scene01/keeper.mp4"
  "$OUT/scene02/keeper.mp4"
  "$OUT/scene03/keeper.mp4"
  "$OUT/scene04/keeper.mp4"
  "$OUT/scene05/keeper-labeled.mp4"
  "$OUT/scene06/keeper-labeled.mp4"
  "$OUT/scene07/keeper-labeled.mp4"
  "$OUT/scene08/keeper.mp4"
  "$OUT/scene09/keeper-9a-labeled.mp4"
  "$OUT/scene09/keeper-9b-labeled.mp4"
)

# Freeze-hold (dwell) appended to each scene, seconds. s9a runs straight into s9b with no dwell;
# s9b's 3.0 is the closing tail the fade-out lives on.
HOLDS=(1.8 2.4 1.5 1.3 1.1 1.3 2.4 1.5 0 3.0)

# VO, one clip per scene slot. Scene 9's narration exceeded the ~30s ElevenLabs TTS cap and was
# silently truncated, so it is split into s9a + s9b. Keep any regenerated clip well under 30s.
VO=(s1 s2 s3 s4 s5 s6 s7 s8 s9a s9b)

D=1.0        # cross-dissolve, uniform on all 9 seams
FADE=1.5     # fade to black / silence at the end
LEAD=0.2     # VO starts this long after its scene does
S9B_LEAD=1.6 # …except s9b, which waits so the s9a line can land first

N=${#SRC[@]}
for f in "${SRC[@]}"; do [ -f "$f" ] || { echo "missing source: $f" >&2; exit 1; }; done

# --- timeline ------------------------------------------------------------------------------------
# d[i]   = source duration + hold
# pos[i] = where scene i starts on the output timeline = pos[i-1] + d[i-1] - D
# The xfade joining scene i is offset at exactly pos[i], and scene i's VO is delayed to pos[i]+LEAD.
declare -a DUR POS
for ((i = 0; i < N; i++)); do
  raw=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "${SRC[$i]}")
  DUR[$i]=$(echo "$raw + ${HOLDS[$i]}" | bc -l)
done

POS[0]=0
for ((i = 1; i < N; i++)); do
  POS[$i]=$(echo "${POS[$((i - 1))]} + ${DUR[$((i - 1))]} - $D" | bc -l)
done
TOTAL=$(echo "${POS[$((N - 1))]} + ${DUR[$((N - 1))]}" | bc -l)
FADE_ST=$(echo "$TOTAL - $FADE" | bc -l)

printf 'scene %2d  hold %-4s  dur %8.3f  starts %8.3f\n' \
  $(for ((i = 0; i < N; i++)); do echo "$((i + 1)) ${HOLDS[$i]} ${DUR[$i]} ${POS[$i]}"; done)
printf 'total %.3fs\n\n' "$TOTAL"

# --- video: holds + dissolves + fade-out, one pass ------------------------------------------------
inputs=()
for f in "${SRC[@]}"; do inputs+=(-i "$f"); done

fc=""
for ((i = 0; i < N; i++)); do
  if [ "${HOLDS[$i]}" = "0" ]; then
    fc+="[$i:v]setpts=PTS-STARTPTS[p$i];"
  else
    fc+="[$i:v]tpad=stop_mode=clone:stop_duration=${HOLDS[$i]},setpts=PTS-STARTPTS[p$i];"
  fi
done

fc+="[p0][p1]xfade=transition=fade:duration=$D:offset=${POS[1]}[x1];"
for ((i = 2; i < N; i++)); do
  last=$((i - 1))
  fc+="[x$last][p$i]xfade=transition=fade:duration=$D:offset=${POS[$i]}[x$i];"
done
fc+="[x$((N - 1))]fade=t=out:st=$FADE_ST:d=$FADE[v]"

echo "encoding final-noVO.mp4 …"
ffmpeg -loglevel error -stats "${inputs[@]}" \
  -filter_complex "$fc" -map "[v]" \
  -c:v libx264 -preset slow -crf 15 -pix_fmt yuv420p \
  "$ASM/final-noVO.mp4" -y

# --- audio: place each VO at its scene offset, mix, fade, mux -------------------------------------
vo_inputs=()
afc=""
k=0
for ((i = 0; i < N; i++)); do
  mp3="$ASM/vo/${VO[$i]}.mp3"
  [ -f "$mp3" ] || { echo "  (no VO for scene $((i + 1)), skipping)"; continue; }
  lead=$LEAD
  [ "${VO[$i]}" = "s9b" ] && lead=$S9B_LEAD
  ms=$(printf '%.0f' "$(echo "(${POS[$i]} + $lead) * 1000" | bc -l)")
  vo_inputs+=(-i "$mp3")
  afc+="[$((k + 1)):a]adelay=${ms}|${ms}[a$k];"
  k=$((k + 1))
done

mixin=""
for ((j = 0; j < k; j++)); do mixin+="[a$j]"; done
# duration=longest is required — without it amix can cut the mix short of the video.
afc+="${mixin}amix=inputs=$k:duration=longest:normalize=0,afade=t=out:st=$FADE_ST:d=$FADE[a]"

echo "muxing final-withVO.mp4 …"
ffmpeg -loglevel error -stats -i "$ASM/final-noVO.mp4" "${vo_inputs[@]}" \
  -filter_complex "$afc" -map 0:v -map "[a]" \
  -c:v copy -c:a aac -b:a 192k \
  "$ASM/final-withVO.mp4" -y

echo
for f in "$ASM/final-noVO.mp4" "$ASM/final-withVO.mp4"; do
  echo "$(basename "$f")  $(ffprobe -v error -show_entries format=duration,bit_rate -of csv=p=0 "$f")"
done
