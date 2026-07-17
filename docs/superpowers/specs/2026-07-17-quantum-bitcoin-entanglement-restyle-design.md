# Design — Restyling `quantum-bitcoin-entanglement` onto the entanglement reference

Date: 2026-07-17
Project: `projects/quantum-bitcoin-entanglement/`
Status: approved (design), not yet implemented

## Problem

`projects/quantum-bitcoin-entanglement/scenes.ts` began as a byte-identical copy of
`projects/quantum-bitcoin-elements/scenes.ts`. Identical prompts produce identical keyframes, so
until the prompts are restyled the project has no reason to exist. Its one distinguishing input is
the reference video at `references/ref-quantum-entanglement-9x16-51s.mp4`.

## The reference

720x1280 (9:16), 30fps, 51.0s, h264+aac. A vertical captioned social-explainer cut from stock
footage. Sampled at 2/8/14/20/26/32/38/44/49s, its visual inventory is:

| Motif | Description |
|---|---|
| Deep-field nebula | Dense starfield, rich magenta/violet nebula. The connective tissue. |
| Paired orbs + filament | Two plasma orbs with turbulent stellar surfaces, joined by one thin bright filament. The signature. |
| Constellation network | Faint white node-and-line overlay behind the orbs. |
| Energy sphere | A body wrapped in sweeping light arcs. |
| Warp tunnel | Radial cyan/violet/white streaks converging on a dark vanishing point. |
| Cosmic web | Violet dark-matter-like filaments studded with glowing orange nodes. |
| Photoreal cutaways | Earth from orbit; a beach at sunset with people. |

Two properties of the reference conflict with this project and are **deliberately not adopted**:

1. **It is a montage.** It cuts between unrelated stock shots. This project's identity is one
   continuous zoom through one world (molecule → atom → quark). The zoom is kept.
2. **It uses real-world footage.** `production.styleTags` forbids physical locations. The Earth and
   beach shots are dropped, and the negative prompt is widened to keep them from leaking back in.

The reference is also 9:16; this project stays **21:9**, as previously decided.

## Decisions taken

| Question | Decision |
|---|---|
| What to borrow | Motifs mapped onto Bitcoin concepts; continuous-zoom structure kept. |
| Narration | **Locked.** No change to `narration`, scene order, `durationSeconds`, `camera`, or `models`. |
| Background | Nebula as defocused depth behind the subject; near-field stays dark. |
| Render tone | Split by layer — photoreal astrophotography for molecule, scientific diagram for atom/quark. |

## Central idea

> **Nothing in Bitcoin moves. It only references.**
> Wherever one thing references another across distance, draw the entanglement filament.

This is why the reference fits a Bitcoin explainer at all. Its signature image — two separated
bodies, nothing travelling between them, yet correlated — is exactly the mental model Bitcoin
beginners lack. Scene 5's narration already says
"비트코인에서 잔액 덩어리가 주소 사이를 이동하는 것은 아니다" and its motion prompt already says
"no coin physically travels". The motif attaches without touching a word of narration.

## Visual grammar

| Reference motif | Rule | Scenes |
|---|---|---|
| Paired orbs + filament | A **reference** is drawn as a filament | 2 (block → prev block), 5 (input → prev output), 7 (proof → condition) |
| Cosmic web | A **network or graph** is drawn as a web | 3 (P2P nodes), 6 (tx graph), 9 (background bookend) |
| Warp tunnel | A **scale transition** is drawn as a tunnel | 4 (molecule → atom), 7 (atom → quark) |
| Deep-field nebula + constellation lines | Background depth | 1–9 |
| Energy arc sphere | Verification scan | 3 |
| Photoreal Earth / beach | **Dropped** | — |

## Tone line

Tone shifts with the zoom: a photograph of space becomes a scientific diagram.

- **Molecule (1–3)** — photoreal deep-field astrophotography, turbulent stellar plasma, no labels.
- **Atom (4–6), Quark (7–9)** — scientific visualization, ornate diagram, legible small labels.

The boundary is free, not forced: scenes 1–3 already carry no label requirement (scene 1's prompt
says `no text`), while every label-bearing scene (4, 7, 8, 9) is already in a deep layer. Scene 4 is
the hinge and shows the transition in-frame — warp streaks at the edges resolving into a labelled
diagram at centre.

## `production` changes

Changed:

- `styleTags` — "one continuous dark cosmic void" → "one continuous deep-space field". Negative list
  widened from rooms/labs to also forbid planet surfaces, landscapes, and people. "scientific
  visualization" is **dropped** from the list — tone is no longer project-wide, so it moves into
  `toneByLayer`, which applies it to atom/quark only and gives molecule photoreal astrophotography.
- `palette.background` — "deep black to dark navy void, volumetric fog" → "dense starfield with a
  defocused deep-field nebula; dark near-field for contrast".

Added:

- `palette.filament` — "thin, intensely bright white-cyan — the visual sign of a reference".
- `nebulaByLayer` — molecule: rich magenta/violet, high star density; atom: muted violet-to-teal,
  low density, heavily defocused; quark: **deep teal and blue, sparse**.
- `toneByLayer` — the tone line above, as prompt-ready phrases.
- `grammar` — canonical wording for `filament`, `cosmicWeb`, `warpTunnel`, `scanArc`.

Unchanged: `aspectRatio` (21:9), `fps`, `clipSeconds`, `keyframeModel`, `voiceover`, `layerColor`,
and every other palette entry. Bitcoin orange `#F7931A` is a brand constant.

**Why `nebulaByLayer` exists.** `layerColor.quark` is violet and the reference nebula is violet, so
the quark scenes (7–9) would put a violet subject on a violet background. Turning the nebula deep
teal for those scenes is what keeps the script particles legible.

## Known trade-off: `grammar` is documentation, not a template

`keyframePrompt` is sent verbatim to the image model, so it must be self-contained. A template with
`{{filament}}` placeholders would need a resolver, and the active MCP path is agent-driven — the
prompt is read out of `scenes.ts` and passed to `generate_image` by hand, with no script in the loop
to expand it. A placeholder would eventually ship unresolved.

So the grammar wording is **inlined into each prompt**, and `production.grammar` is the canonical
copy source a human edits from. This accepts drift risk across ~8 inline uses. Revisit only if the
prompts actually diverge; the fix then is prompt composition in shared tooling, applied to both
projects.

No shared tooling changes. `export-prompts.ts` reads only `layerColor`, `keyframeModel`,
`aspectRatio`, `fps`, and `styleTags` — all present in both projects — so the new fields are
invisible to it and `tsc --noEmit` stays green with the two projects' `production` shapes differing.

## Per-scene changes

Every scene keeps its `id`, `title`, `layer`, `durationSeconds`, `camera`, `models`, `narration`,
and `status`. Only `keyframePrompt` and `motionPrompt` change, and scene 8's motion prompt does not.

| Scene | Layer | Change |
|---|---|---|
| 1 | molecule | Orbs gain turbulent stellar plasma surfaces; magenta/violet deep field; constellation-line network. Gold ₿ coinbase orb kept. `no text` kept. |
| 2 | molecule | The prev-block pointer **becomes the filament**. Already "a beam of light … pointing back to the previous block" — a promotion, not a rewrite. |
| 3 | molecule | Validator nodes **become the cosmic web**. Scan becomes the energy-arc sphere. No-servers negative kept. |
| 4 | atom | **Hinge.** Warp streaks at frame edges resolve into the labelled cyan atom. Tone transition visible in-frame. All labels kept. |
| 5 | atom | **Thematic peak.** UTXO A (dimming, SPENT) and the new tx joined by the filament; nothing travels. |
| 6 | atom | Tx graph becomes a **directed cosmic web**. Double-spend: two filaments reach one node, one collapses red. |
| 7 | quark | Macro warp into the output; the **filament** joins the arriving proof (sig + pubkey, in the next tx's input) to the scriptPubKey lock it satisfies — proof → condition, per the grammar table. Background turns deep teal. |
| 8 | quark | Background only — deep teal so the violet stack reads. Motion prompt unchanged. |
| 9 | quark | Pull-back reveals the **cosmic web again** in the far background — bookends scenes 3 and 6. |

Scene 8 changes least; scenes 5 and 6 change most.

## Success criteria

1. `npm run typecheck` exits 0.
2. `npm run export:prompts -- --project quantum-bitcoin-entanglement` rewrites all 9 prompt files.
3. The default project (`quantum-bitcoin-elements`) is byte-identical afterwards — no cross-project
   leakage.
4. `diff` between the two projects' `scenes.ts` shows changes confined to `production` style fields,
   `keyframePrompt`, and `motionPrompt` — never `narration`, `camera`, `models`, or
   `durationSeconds`.
5. Each of scenes 2, 5, 7 contains the filament wording; 3, 6, 9 the cosmic-web wording; 4, 7 the
   warp-tunnel wording.

## Out of scope

- **Burned-in captions.** The reference's white captions are a 9:16 social device. This project is
  21:9 with Korean VO. Image models garble text, and captions belong in post. Note that captions
  (subtitles) are distinct from the diagram **labels** in scenes 4/7/8/9, which stay.
- **Keyframe generation.** Prompt authoring only. Generation spends credits and needs explicit
  per-spend confirmation on model / resolution / settings.
- **Video and VO generation** for this project.
- `quantum-bitcoin-elements`, which is untouched.
