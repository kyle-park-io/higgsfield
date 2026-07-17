# Video assembly — scene transitions & production rules

Date: 2026-07-18
Project: `projects/quantum-bitcoin-entanglement/`
Status: decided (transitions), clips in progress

This covers how the 9 scene clips join into one continuous piece, plus the video-generation
rules confirmed by the scene 4/5 proofs. It complements the restyle design spec
(`2026-07-17-quantum-bitcoin-entanglement-restyle-design.md`).

## Video-generation rules (confirmed by proof clips, ~340 cr spent)

1. **Model: Seedance 2.0 Mini** (2.5 cr/s @ 21:9/720p). std (4.5 cr/s) only buys background glow
   during motion, and its smoother camera actually blurs labels more — the opposite of what this
   explainer needs. Reroll a weak clip in std only if its *motion* fails, never for labels.
2. **`start_image` pins frame 1 — if the motion prompt's first beat describes the keyframe.** It is
   not the image that fails, it's a contradicting prompt that overrides it. Every motion prompt now
   opens "opens exactly on the still frame it starts from" + a description of the keyframe.
3. **Control motion by result-shape, never by number.** "Rotate 30°" and "360 orbit" both made the
   atom swing near edge-on and flatten its rings at ~6s (a visible hitch). "The orbital rings stay
   fully round and wide open at every moment, never collapsing to vertical lines" held it front-on.
   Same lesson as the image stage (naming a count/angle backfires; describing the wanted result works).
4. **Aspect ratio: 21:9, 720p → 1470×630.** Only Seedance/Cinema-Studio-3.0 render 21:9
   (see `src/mcp/model-map.ts`).
5. **Silent clips** (`generate_audio:false`); Korean VO is a separate track, muxed in assembly.
6. **Decline the preset recommendation.** Generation often suggests the "IN THE DARK" preset — pass
   `declined_preset_id` and generate literally.
7. **Clip lengths** are VO + ~2 s (measured Brooks VO): 4=12, 5=13, 6=15, 8=15, the rest 15, scene 9
   splits 9a/9b. Motion prompts end on a "calm final beat" filling the tail so nothing hard-cuts the
   instant the voice stops.

## Transition method per seam

Three methods, chosen by the relationship between the two scenes:

- **Hard cut / zoom-blur** — for the two designed layer-transition crash-zooms, where abruptness is
  the point, and for anchor seams where the next scene already opens on the previous scene's last
  state (a cut reads as continuous).
- **Cross-dissolve** (ffmpeg `xfade`, ~0.6 s overlap) — the safe default. Costs nothing, fully
  adjustable in edit, and keeps every clip independent (no clip loses content to a morph). Proven on
  4→5.
- **end_image chaining** — the premium option for two seams whose compositions genuinely morph into
  each other. Removes the cut entirely (proven on 4→5: the last frame matched scene 5's keyframe).
  Cost: the scene's motion must be rewritten to *end* on the next keyframe, which spends some of that
  scene's own screen time on the morph, and needs a reroll if wrong. Only worth it where the morph is
  natural.

**Why not end_chain everywhere** (the question that opened this): its original disqualifier was
"the transition eats the scene's rotation." Now that no scene rotates (scene 4 is locked front-on),
that cost is gone — but a second cost remains: end_chain makes a scene spend seconds morphing into
the next instead of showing its own content, and it couples two clips so a change forces a reroll.
Cross-dissolve keeps clips independent, free, and reversible. So end_chain is reserved for the two
seams where the morph is worth it, not made the default.

| Seam | Layers | Relationship | Method | Why |
|---|---|---|---|---|
| 1→2 | mol→mol | one block → chain of blocks (Dolly Out reveals) | **cross-dissolve** | same gold-block visual family; dissolve blends block→block |
| 2→3 | mol→mol | tampered chain → one block in the validator web | **hard cut** | scene 3 opens *on* scene 2's red tremble ("the red tremble still running down the tampered chain fades…") — the anchor carries it |
| 3→4 | mol→**atom** | crash-zoom **through** the gold block surface | **hard cut / zoom-blur** | designed layer match-cut; scene 4 opens already through the surface. Abrupt is intended |
| 4→5 | atom→atom | same transaction atom continues | **cross-dissolve** (decided) | Both built and compared. end_chain (`8c1769c0`) morphed smoothly and its last frame matched scene 5's keyframe, BUT its labels re-render during the morph and go wrong: `Transction`, `TTID`, and Bob showed **5.5 BTC** instead of 3.5 — a broken number, fatal for an explainer. Cross-dissolve keeps both keepers whole (scene 4's labels never change, scene 5 opens on its correct keyframe), so both ends stay accurate. **Morphing labels can't be trusted.** |
| 5→6 | atom→atom | one transaction → node in the tx web (Dolly Out) | **cross-dissolve** | pull-back to reveal the web; dissolve is smooth and free |
| 6→7 | atom→**quark** | crash-zoom **through** the atom shell along the surviving filament | **hard cut / zoom-blur** | designed layer match-cut; scene 7 opens on scene 6's surviving filament + red collapse. Abrupt intended |
| 7→8 | quark→quark | lock+proof → execution stack | **cross-dissolve** | different composition, related concept (the proof gets executed); dissolve bridges it |
| 8→9 | quark→quark | stack → whole transaction atom (Super Dolly Out) | **cross-dissolve** (lean) | scene 9 literally "pulls back from the stack", so end_chain is tempting — but the 4→5 test showed morphing labels corrupt (wrong BTC amount). Scene 9 has many labels (six data surfaces), so the same risk applies. Default to cross-dissolve unless an end_chain test proves the labels survive |
| **9a→9b** | quark (internal) | **one shot, split for the 15 s cap** | **shared intermediate frame** | not a scene change — one Super Dolly Out cut in half (~27 s VO). 9a `end_image` = 9b `start_image` = an intermediate pull-back keyframe (needs one 2 cr still), so the split is invisible |

Summary: **cross-dissolve is the default** (1→2, 4→5, 5→6, 7→8). **Hard cut** at the two crash-zoom
layer transitions (3→4, 6→7) and the anchored 2→3. **end_chain** at 8→9 (and optionally 4→5).
**9a→9b** needs a shared middle frame.

## Anchors already built into the keyframes/motion

Several seams need no special transition work because the continuity is already in the art —
generated during the keyframe stage:

- **2→3**: scene 3's keyframe shows the trailing gold chain "with one filament still guttering red
  from the tamper"; its motion opens on that red tremble fading.
- **6→7**: scene 7's keyframe shows "one collapsed strand still fading red" at the edges; its motion
  opens on the surviving filament from the double-spend.
- **8→9**: scene 9's motion opens "camera pulls back from the stack."

These are why hard cuts read as continuous at 2→3 and the crash-zoom seams.

## Open items

- **9a→9b** needs an intermediate keyframe (one still of the Super Dolly Out mid-pull-back) to chain
  cleanly. ~2 cr.
- **Scene 5 keeper** has two flaws to fix on its production reroll: the `Transction` typo (should be
  `Transaction`), and a red SPENT-seal remnant lingering at frame-left around t=8.
- The 4→5 cross-dissolve test file is at
  `outputs/_transition-tests/s4-s5-crossdissolve-0.6s.mp4` for review.
