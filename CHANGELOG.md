# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Commit type → section: `feat` → **Added**, `fix` → **Fixed**, `refactor` → **Changed**.
`docs` / `chore` are folded into the relevant section only when notable.

## [Unreleased]

### Added

- **Monorepo restructure** — the repo is now a workspace of independent cutscene projects under
  `projects/<name>/`, each owning its own `scenes.ts` SSOT + `prompts/` + media (`keyframes/`,
  `outputs/`, `docs/`, `references/`). Shared tooling stays in `src/`. New `src/core/registry.ts`
  (project list) + `src/core/project.ts` (`--project <name>` / `-p` / `HF_PROJECT` resolver +
  loader); `export:prompts`, `shot-list`, `plan:report`, `generate:keyframe` are now project-aware
  (default `quantum-bitcoin-elements`). Package renamed `higgsfield-quantum-bitcoin` →
  `higgsfield-cutscenes`.
- New **`quantum-bitcoin-entanglement`** project — the same 9-scene Bitcoin story & 21:9 format as
  `quantum-bitcoin-elements`, restyled onto a new reference video
  (`projects/quantum-bitcoin-entanglement/references/…mp4`) as its visual base. Its prompts follow
  one rule borrowed from the reference — *nothing in Bitcoin moves, it only references* — so every
  cross-distance reference (block→prev block, input→prev output, proof→condition) is drawn as an
  entanglement filament, networks are drawn as a cosmic web, and scale transitions as a warp
  tunnel. Render tone shifts with the zoom (photoreal astrophotography at the molecule layer →
  scientific diagram at atom/quark), and the background nebula turns deep teal for the quark scenes
  so violet script particles stay legible. Narration, camera, models, and clip lengths are
  unchanged from the Bitcoin project. Design:
  `docs/superpowers/specs/2026-07-17-quantum-bitcoin-entanglement-restyle-design.md`.
- `--dry-run` / `-n` flag on `generate:keyframe` (plus a `generate:keyframe:dry`
  convenience script) that validates the scene + env and previews the exact request —
  model, size, estimated cost, save path, and prompt — without any API call or credit spend.
- Full Higgsfield MCP catalog in `src/mcp/catalog.ts` — every image + video model with
  measured `get_cost` credit costs (cheapest-first), separate from the curated
  `model-map.ts` subset; `pnpm models` now prints it.
- Per-scene `durationSeconds` on `Scene` / `scenes.ts` (Korean voiceover-paced, 12–15s)
  so clips match narration length instead of a flat 15s.
- Confirmed Korean voiceover config in `production.voiceover` (Brooks · ElevenLabs via
  `text2speech_v2`); narration text stays per-scene in `Scene.narration`.
- **`quantum-bitcoin-entanglement` final cut** — `projects/quantum-bitcoin-entanglement/assemble.sh`
  builds the full 152.7s film from the ten per-scene keeper clips: `final-noVO.mp4` (silent) and
  `final-withVO.mp4` (Korean VO), 1470×630 · 24fps · ~4.4 Mbps. Uniform 1.0s cross-dissolve on all
  nine seams, a per-scene freeze-hold ("여운") appended to each scene, and a 1.5s fade to black.
  Everything resolves in a **single encode pass** (`tpad` holds applied inside the `filter_complex`)
  at crf 15 / preset slow — an earlier hold→segment→concat build at crf 18–23 veryfast had cost
  roughly half the bitrate to generational loss. The VO track places one clip per scene at its
  timeline offset; scene 9's narration exceeds the ~30s ElevenLabs TTS cap, so it is split into
  `s9a`/`s9b`.

### Changed

- Corrected the "cheapest video" note: `kling3_0` (7.5cr) is not the floor — `seedance1_5`
  (4.8cr), `cinematic_studio_video` / `kling2_6` (5cr) are cheaper. Recorded budget swaps
  (`veo3_1_lite` 8cr, `seedance_2_0_mini` 12.5cr) in the catalog.
- Recorded the models actually A/B-tested per scene in `scenes.ts` comments (cross-refs the credit log):
  Scene 1 tested three — Seedance std `3d5accd6`, Seedance Mini `26956439`, Kling v3.0 `04b3968f`;
  Scene 2 tested two — Seedance std `31c0cdcb`, Kling v3.0 `eab0a320`. Also corrected Scene 2's `alt`
  video model to `Kling 3.0` (was `Cinema Studio`) so `scenes.ts` / `prompts/scene02.md` match.
- Re-timed the motion-prompt segments for scenes 4/5/6/8 to their trimmed clip lengths;
  flagged Scene 9 (~27s narration > 15s model cap) to render as two clips (9a/9b).
- Anchored the palette "gold" to Bitcoin orange (#F7931A); set the keyframe default to
  `nano_banana_pro` at 21:9; replaced `DoP` scene assignments with `Cinema Studio`.
- Refreshed the exported `prompts/*.md` (stale) — `export-prompts.ts` now shows per-scene
  `durationSeconds` and the keyframe model.
- Recorded that MCP `generate_image` aliases `nano_banana_pro` → `nano_banana_2`, and set the
  keyframe model to `nano_banana_2` (scenes.ts, model-map.ts, catalog.ts). Updated `models.ts`
  keyframe entry (Soul 2.0 → Nano Banana 2, Plus+) and refreshed plan credits from live data
  (Starter 270, Plus ~1,200); marked `DoP` deprecated.
- Corrected the nano_banana routing note: the response `model` is Higgsfield's backend engine
  name (ran as `nano_banana_flash`), not a simple alias of the requested id.
- Scene 2 keyframe prompt: added a no-Ethereum / no-other-logo negative (a stray Ethereum icon
  had appeared).
- Reworked Scene 2 & 3 keyframes so blocks read as clear **molecules** of bonded transaction-atoms
  (dropped the honeycomb/hexagon look); Scene 3 nodes are now validator servers, not cameras.
- Environment consistency pass: `styleTags` now enforce one continuous cosmic void (no physical
  rooms/labs). Reworked Scene 5 (removed the mechanical arm → clean cyan UTXO atoms with a
  reference-link, matching "no coin physically moves") and Scene 8 (removed the physical lab →
  violet energy stack-tube floating in the void, with correct OP_ opcode labels).
- Scene 3 nodes → floating holographic ring-scanner validators in the void (not server towers).
  Scene 4 now bridges the molecule→atom crash-zoom: a richly detailed multi-shell cyan transaction
  atom framed by faint gold parent block-molecule spheres, so the 3→4 transition reads as a
  continuous zoom-through.

- `burn-labels.ts` now encodes at crf 15 / preset slow instead of the ffmpeg default. The labeled
  clip is an intermediate that feeds the assembly, so its loss compounds; one scene had degraded to
  0.685 Mbps before this.
- Reworked the `quantum-bitcoin-entanglement` keyframe + motion prompts for scenes 1, 2, 3, 5 and 6
  after review, and re-recorded their keeper keyframe UUIDs in `keyframe-jobs.md`. Scene 2 forces a
  horizontal sawtooth with segmented per-gap filaments (earlier versions read as one straight rod,
  then as a vertical stack); scenes 5 and 6 are now generated text-free with a locked camera so the
  labels can be burned in post accurately, scene 5 with a strict spend-then-create ordering.

_Shipped with known, accepted defects. Scene 7's opcode ring has garbled baked text — it predates
the text-free approach and would need a reroll to fix, which was considered and declined. Scenes 4
and 8 keep their original baked labels, minor typos included, because the patch plates needed to
cover them looked worse. The VO is placed per scene rather than word-synced, and the mix is mono._

## [0.1.0] - 2026-07-15

Keyframes-complete milestone: the working environment, model research, and all 9
scene keyframes are done. Video generation is not yet started (blocked on credits).

### Added

- Higgsfield MCP working environment at project scope (`.mcp.json`), pre-approved
  via `.claude/settings.local.json`.
- `src/{core,mcp,api}` structure with per-path docs — MCP (active, agent-driven) vs
  API (alternative, scriptable) generation paths kept separate.
- 9-scene "Quantum Bitcoin Elements" single source of truth (`src/core/scenes.ts`):
  prompts, motion, camera, models, and narration for the continuous molecule→atom→quark zoom.
- Authoritative MCP model reference (`src/mcp/model-map.ts`): real model ids, native
  aspect ratios, measured credit costs, and video durations — printable with `pnpm models`.
- Per-model minimum subscription-plan reference (`src/core/models.ts`), printable with
  `pnpm plan:report`.
- API-path scripts: `check:auth` (verify Higgsfield API credentials) and
  `generate:keyframe` (Soul keyframe via the REST API).
- `.env.example` template using `HF_API_KEY` + `HF_API_SECRET`.
- All 9 scene keyframes generated with `soul_cinematic` (21:9), saved under
  `keyframes/sceneNN/` as versioned files; `scenes.ts` status set to `keyframe`.

### Changed

- Use each model's native aspect ratio instead of forcing 2.35:1 with cropping.
- Split the monolithic `src` into `core` / `mcp` / `api` with dedicated READMEs.
- `.env` uses two variables — `HF_API_KEY` (key id) and `HF_API_SECRET` (key secret) —
  matching Higgsfield's credential pair.
- Documented that MCP video camera moves are prompt-driven (no camera-preset param) and
  recorded measured model costs and durations in `model-map.ts`.

### Fixed

- Scene 1 keyframe now renders Bitcoin (₿ token), not an Ethereum-like gem.
- Keyframes are saved as versioned per-scene files and never overwritten.

[Unreleased]: https://github.com/kyle-park-io/higgsfield/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/kyle-park-io/higgsfield/releases/tag/v0.1.0
