# Quantum Bitcoin Entanglement — Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle `projects/quantum-bitcoin-entanglement/scenes.ts` onto its reference video's visual language, without changing a word of the Bitcoin narration.

**Architecture:** One data file changes. `production` gains style constants (`grammar`, `toneByLayer`, `nebulaByLayer`) and has two fields reworded; then all 9 `keyframePrompt`s and 8 of 9 `motionPrompt`s are rewritten to inline that grammar. Shared tooling in `src/` is untouched. Verification runs `tsc --noEmit` plus a diff of the two projects' **exported prompt files** — the locked story fields must stay byte-identical between projects.

**Tech Stack:** TypeScript (Node-native type stripping, no tsx), `npm run typecheck`, `npm run export:prompts`.

**Spec:** `docs/superpowers/specs/2026-07-17-quantum-bitcoin-entanglement-restyle-design.md`

## Global Constraints

- **Never modify** `narration`, `camera`, `models`, `durationSeconds`, `id`, `title`, `layer`, or `status` on any scene. The narration is locked by explicit user decision.
- **Never modify** `projects/quantum-bitcoin-elements/` — it must be byte-identical when this plan finishes.
- **Never modify** anything under `src/` — no shared tooling changes.
- Bitcoin orange is exactly `#F7931A`. It is a brand constant.
- `aspectRatio` stays `"21:9"`. The reference video is 9:16; the project is not.
- `layerColor` stays `{ molecule: "Bitcoin gold/amber", atom: "cyan", quark: "violet" }`.
- Every `keyframePrompt` must be **self-contained prose** sent verbatim to the image model. Never write `{{placeholder}}` syntax into a prompt — no resolver runs on the MCP path.
- Molecule scenes (1–3) carry **no text labels**. Atom/quark scenes (4–9) keep their `legible small text labels`.
- Run TypeScript with Node natively (`npm run …`); never install or invoke `tsx`.
- Commit messages use Conventional Commits: `type(scope): subject`.
- Do **not** generate any image, video, or audio. This plan spends zero credits.

---

### Task 1: Rework the `production` constants

**Files:**
- Modify: `projects/quantum-bitcoin-entanglement/scenes.ts:4-32` (the `production` object)

**Interfaces:**
- Consumes: nothing.
- Produces: `production.grammar.{filament,cosmicWeb,warpTunnel,scanArc}`, `production.toneByLayer.{molecule,atom,quark}`, `production.nebulaByLayer.{molecule,atom,quark}`, `production.palette.filament` — all `string`. Tasks 2–4 copy this wording verbatim into prompts.

- [ ] **Step 1: Confirm the baseline is the unmodified copy**

Run:
```bash
diff projects/quantum-bitcoin-elements/scenes.ts projects/quantum-bitcoin-entanglement/scenes.ts && echo "BASELINE OK: identical"
```
Expected: `BASELINE OK: identical` with no diff output. If this prints differences, stop — someone has already edited the file and this plan's assumptions are stale.

- [ ] **Step 2: Replace `styleTags` and `palette.background`, and add the new constants**

In `projects/quantum-bitcoin-entanglement/scenes.ts`, replace the `styleTags`, `palette`, and `layerColor` block (everything from `styleTags:` through the `layerColor` line) with:

```ts
  styleTags:
    "one continuous deep-space field (never a physical room, laboratory, planet surface, or real-world location — no benches, monitors, furniture, landscapes, or people), dense starfield with a defocused deep-field nebula behind the subject and a dark near-field for contrast, bioluminescent particles, translucent 3D structures, volumetric glow, high detail, cinematic",
  /**
   * Visual grammar borrowed from the reference video (references/ref-quantum-entanglement-9x16-51s.mp4).
   *
   * Core rule: nothing in Bitcoin moves — it only references. Draw every cross-distance
   * reference as an entanglement filament.
   *
   * These strings are the canonical wording. Each keyframePrompt inlines them rather than
   * interpolating, because a prompt is sent verbatim to the image model and the MCP path has
   * no resolver in the loop — a placeholder would ship unexpanded. Edit here first, then
   * propagate by hand. See the design spec's "Known trade-off" section.
   */
  grammar: {
    filament:
      "two separated glowing bodies joined by one thin, intensely bright white-cyan energy filament; nothing travels along the filament — both ends respond together",
    cosmicWeb:
      "a vast web of faint violet dark-matter-like filaments studded with glowing nodes, receding into deep space",
    warpTunnel:
      "radial hyperspace light streaks in cyan, violet and white converging toward a dark vanishing point, motion-blurred",
    scanArc:
      "a translucent sphere of sweeping energy arcs wrapped around the subject, reading it without touching it",
  },
  /** Render tone shifts as the zoom descends: a photograph of space becomes a scientific diagram. */
  toneByLayer: {
    molecule: "photoreal deep-field astrophotography, turbulent stellar plasma surfaces, no text labels",
    atom: "scientific visualization, ornate atomic diagram, legible small text labels",
    quark: "scientific visualization, extreme macro, legible small text labels",
  },
  /** Fixed palette reused on every keyframe. "Gold" is anchored to Bitcoin orange #F7931A (brand color). */
  palette: {
    background: "dense starfield with a defocused deep-field nebula; dark near-field for contrast",
    transactionAtom: "cool cyan-white glowing particles",
    block: "Bitcoin-orange gold (#F7931A) amber translucent shell",
    coinbase: "extra-bright Bitcoin-orange gold (#F7931A), distinct geometry",
    valid: "green-white (TRUE particles)",
    invalid: "red",
    scriptQuark: "violet/magenta energy",
    filament: "thin, intensely bright white-cyan — the visual sign of a reference",
  },
  /**
   * Background nebula hue per layer — keeps the subject legible. layerColor.quark is violet and
   * the reference nebula is violet, so quark scenes would put a violet subject on a violet
   * background; their nebula turns deep teal instead.
   */
  nebulaByLayer: {
    molecule: "rich magenta and violet deep-field nebula, high star density",
    atom: "muted violet-to-teal nebula, low density, heavily defocused",
    quark: "deep teal and blue nebula, sparse — so violet script particles pop",
  },
  /** Dominant color per scale layer — shifts as the zoom descends (molecule gold anchors Bitcoin). */
  layerColor: { molecule: "Bitcoin gold/amber", atom: "cyan", quark: "violet" },
```

- [ ] **Step 3: Verify it compiles and the shared tooling still runs**

Run:
```bash
npm run typecheck && npm run export:prompts -- --project quantum-bitcoin-entanglement | tail -1
```
Expected: typecheck prints no errors; export prints `9 scene prompt files written to projects/quantum-bitcoin-entanglement/prompts/`.

This is the real check on the "no shared tooling changes" claim: `export-prompts.ts` reads `layerColor`, `keyframeModel`, `aspectRatio`, `fps`, and `styleTags` off a `production` whose type is now a union of two differently-shaped objects. If adding fields to one project broke that union, typecheck fails here.

- [ ] **Step 4: Verify the default project did not move**

Run:
```bash
git diff --quiet -- projects/quantum-bitcoin-elements/ && echo "OK: elements untouched"
```
Expected: `OK: elements untouched`

- [ ] **Step 5: Commit**

```bash
git add projects/quantum-bitcoin-entanglement/scenes.ts projects/quantum-bitcoin-entanglement/prompts/
git commit -m "feat(entanglement): add reference visual grammar to production constants"
```

---

### Task 2: Restyle the molecule scenes (1–3)

**Files:**
- Modify: `projects/quantum-bitcoin-entanglement/scenes.ts` — scenes with `id: 1`, `id: 2`, `id: 3`

**Interfaces:**
- Consumes: `production.grammar.{filament,cosmicWeb,scanArc}`, `production.toneByLayer.molecule`, `production.nebulaByLayer.molecule` from Task 1 — inlined as prose.
- Produces: nothing consumed by later tasks.

These three scenes are photoreal and carry **no labels**. Scene 2 introduces the filament; scene 3 introduces the cosmic web.

- [ ] **Step 1: Replace scene 1's `keyframePrompt`**

```ts
    keyframePrompt:
      "Photoreal deep-field astrophotography of an immense starfield with a rich magenta and violet nebula receding into deep space; scattered across the field, dozens of glowing spherical plasma orbs of varying sizes, each with a turbulent, roiling stellar surface of cyan-white energy and fine radiating light filaments; a faint constellation-line network of thin white lines and nodes overlays the background; among the cyan orbs, one single larger orb burns in warm Bitcoin-orange gold (hex #F7931A) — a golden Bitcoin token marked with the ₿ symbol, representing the coinbase transaction; high star density, dark near-field for contrast, volumetric glow, cinematic, ultra detailed; no text, no numbers, no UI panels, no labels, no planet surface, no landscape, no people, no Ethereum, no diamond or octahedron gem, no other cryptocurrency logos",
```

- [ ] **Step 2: Replace scene 1's `motionPrompt`**

```ts
    motionPrompt:
      "0–5s: scattered cyan plasma orbs drift across the deep-field nebula, their stellar surfaces roiling. 5–11s: orbs are pulled inward and aggregate into one large translucent amber block-body; the gold coinbase orb enters first and settles at the core. 11–15s: block completes with a soft pulsing glow. Particle-aggregation VFX, volumetric light.",
```

- [ ] **Step 3: Replace scene 2's `keyframePrompt`**

```ts
    keyframePrompt:
      "Photoreal deep-field astrophotography: several completed Bitcoin-gold block-bodies (warm orange-gold, hex #F7931A), each a cluster of small glowing transaction orbs with turbulent stellar plasma surfaces bonded together, linked head-to-tail into a chain receding into a rich magenta and violet nebula; between each block and the one before it runs one thin, intensely bright white-cyan energy filament emitted from a glowing crystalline block-header core — nothing travels along the filament, both ends pulse together; ₿ symbols on the blocks; high star density, dark near-field, volumetric glow, cinematic, ultra detailed; no text labels, no planet surface, no landscape, no people; the ₿ Bitcoin symbol only — no Ethereum, no other cryptocurrency logos, no diamond or octahedron gem, no flat honeycomb hexagon lattice",
```

- [ ] **Step 4: Replace scene 2's `motionPrompt`**

```ts
    motionPrompt:
      "0–5s: the block-header core ignites and shoots one thin bright white-cyan filament back to the previous block; nothing travels along it — both blocks pulse together. 5–11s: camera pulls back revealing a long chain of blocks linked by filaments, receding into the nebula. 11–15s: one middle block is tampered — every filament after it flashes red and trembles at once. Volumetric light, energy VFX.",
```

- [ ] **Step 5: Replace scene 3's `keyframePrompt`**

```ts
    keyframePrompt:
      "Photoreal deep-field astrophotography: a vast web of faint violet dark-matter-like filaments studded with glowing nodes fills the deep space background, receding into the distance — this web is the validator network, not a physical structure; at center floats a glowing Bitcoin-gold block-body (warm orange-gold, hex #F7931A), a cluster of bonded transaction orbs with turbulent stellar plasma surfaces, a ₿ symbol on it; several of the web's nodes brighten and each casts a translucent sphere of sweeping green energy arcs wrapped around the block, reading it without touching it; a valid block glows green across all nodes at once, an invalid one flashes red; rich magenta and violet nebula, high star density, dark near-field, cinematic, ultra detailed; no physical room or lab, no server racks, no monitors, no computers, no cameras, no planet surface, no landscape, no people, no text labels, no Ethereum, no other cryptocurrency logos",
```

- [ ] **Step 6: Replace scene 3's `motionPrompt`**

```ts
    motionPrompt:
      "0–6s: the cosmic web's nodes brighten one by one, each wrapping the gold block in a sphere of sweeping green scan arcs — header, transaction bundle, referenced previous outputs, script results. 6–12s: a valid block glows green across all nodes simultaneously. 12–15s: an invalid block is bounced out in red by every node at once.",
```

- [ ] **Step 7: Verify the grammar landed and no label leaked in**

Run:
```bash
npm run typecheck
npm run export:prompts -- --project quantum-bitcoin-entanglement > /dev/null
grep -l "white-cyan energy filament" projects/quantum-bitcoin-entanglement/prompts/scene02.md
grep -l "dark-matter-like filaments" projects/quantum-bitcoin-entanglement/prompts/scene03.md
grep -c "no text labels\|no text," projects/quantum-bitcoin-entanglement/prompts/scene0{1,2,3}.md
```
Expected: typecheck silent; the two `grep -l` each print their filename; the final `grep -c` prints `1` for each of scenes 01, 02, 03 (each molecule scene keeps a no-labels negative).

- [ ] **Step 8: Verify the locked story fields did not move**

Run:
```bash
for n in 01 02 03; do
  diff <(sed -n '/## Narration/,/^---/p' projects/quantum-bitcoin-elements/prompts/scene$n.md) \
       <(sed -n '/## Narration/,/^---/p' projects/quantum-bitcoin-entanglement/prompts/scene$n.md) \
    > /dev/null || echo "FAIL scene$n: narration diverged"
  diff <(grep -E '^- \*\*(Layer|Camera|Video model|Format|Status):' projects/quantum-bitcoin-elements/prompts/scene$n.md) \
       <(grep -E '^- \*\*(Layer|Camera|Video model|Format|Status):' projects/quantum-bitcoin-entanglement/prompts/scene$n.md) \
    > /dev/null || echo "FAIL scene$n: locked field diverged"
done; echo "locked-field check done"
```
Expected: only `locked-field check done`. Any `FAIL` line means a global constraint was violated — revert that scene and redo it.

- [ ] **Step 9: Commit**

```bash
git add projects/quantum-bitcoin-entanglement/scenes.ts projects/quantum-bitcoin-entanglement/prompts/
git commit -m "feat(entanglement): restyle molecule scenes onto deep-field astrophotography"
```

---

### Task 3: Restyle the atom scenes (4–6)

**Files:**
- Modify: `projects/quantum-bitcoin-entanglement/scenes.ts` — scenes with `id: 4`, `id: 5`, `id: 6`

**Interfaces:**
- Consumes: `production.grammar.{warpTunnel,filament,cosmicWeb}`, `production.toneByLayer.atom`, `production.nebulaByLayer.atom` from Task 1 — inlined as prose.
- Produces: nothing consumed by later tasks.

Tone flips to diagram here. Scene 4 is the hinge and shows the flip in-frame. Scene 5 is the thematic peak. All three keep `legible small text labels`.

- [ ] **Step 1: Replace scene 4's `keyframePrompt`**

```ts
    keyframePrompt:
      'Scientific visualization: at the frame edges, radial hyperspace light streaks in cyan, violet and white converge inward, motion-blurred — we have just crash-zoomed through the gold block surface — and resolve at center into a single richly detailed glowing cyan transaction atom drawn as a precise ornate atomic diagram: a bright textured cyan nucleus labeled "version / locktime", surrounded by multiple concentric orbital shells with many orbiting electrons, glowing energy filaments and a luminous particle field; a left orbital band labeled "inputs (prev txid, vout, sequence, scriptSig/witness)" and a right orbital band labeled "outputs (amount, scriptPubKey)"; framing the atom, faint out-of-focus translucent Bitcoin-gold bonded orbs of the parent block-body (warm orange-gold #F7931A) at the edges; behind everything a muted violet-to-teal nebula, low density, heavily defocused; dense starfield, dark near-field, volumetric glow, cinematic, ultra detailed, legible small text labels; no physical room or lab, no planet surface, no landscape, no people',
```

- [ ] **Step 2: Replace scene 4's `motionPrompt`**

```ts
    motionPrompt:
      "0–4s: warp-tunnel streaks rush past as we crash zoom from the block surface into a single transaction atom; the streaks slow and resolve into a precise atomic diagram. 4–9s: the atom rotates and its shells separate into labeled orbits — nucleus (version, locktime), left electrons (inputs), right electrons (outputs). 9–12s: gentle orbital rotation as labels settle.",
```

- [ ] **Step 3: Replace scene 5's `keyframePrompt`**

```ts
    keyframePrompt:
      'Scientific visualization, ornate atomic diagram rendered entirely as glowing cyan particles and atoms (no machinery, no robots): on the left a bright cyan output atom labeled "UTXO A / Alice (5.0 BTC)", dimming, stamped with a red "SPENT" seal; on the right a new transaction atom, brightening; the two are separated across dark space and joined by one thin, intensely bright white-cyan energy filament — the input\'s reference to the previous output; nothing travels along the filament, no coin, no particle — the left atom dims exactly as the right brightens, both ends responding together; a newly forming cyan output atom "UTXO B / Bob (3.5 BTC)" and a smaller cyan "Change UTXO / Alice (1.5 BTC)" atom curving back toward Alice; behind everything a muted violet-to-teal nebula, low density, heavily defocused; dense starfield, dark near-field, cinematic, ultra detailed, legible small text labels; no robotic arm, no mechanical device, no syringe, no drill, no physical room or lab, no planet surface, no landscape, no people',
```

- [ ] **Step 4: Replace scene 5's `motionPrompt`**

```ts
    motionPrompt:
      "0–4s: UTXO-A (Alice) glows brightly alone. 4–9s: a filament snaps into place between UTXO-A and the new transaction — the input's reference; a red SPENT seal closes over UTXO-A; a new UTXO-B (Bob) crystallizes; a smaller change UTXO curves back to Alice. 9–12s: nothing travels along the filament — UTXO-A dims exactly as the new outputs brighten, both ends responding together. Slow push-in.",
```

- [ ] **Step 5: Replace scene 6's `keyframePrompt`**

```ts
    keyframePrompt:
      "Scientific visualization: several glowing cyan transaction atoms arranged as a directed web — faint violet dark-matter-like filaments studded with the atoms as glowing nodes, branching outward into deep space (not a straight line); each filament carries a clear direction of flow, thin bright white-cyan energy running from one transaction's output node into the next transaction's input node; at one node two separate filaments reach for the same already-spent output — one survives and glows, the other collapses in red; behind everything a muted violet-to-teal nebula, low density, heavily defocused; dense starfield, dark near-field, volumetric glow, cinematic, ultra detailed, legible small text labels; no physical room or lab, no planet surface, no landscape, no people",
```

- [ ] **Step 6: Replace scene 6's `motionPrompt`**

```ts
    motionPrompt:
      "0–5s: transaction atoms light up as nodes on a violet web — TX0 output[1]'s filament runs into TX1 input[0], branching into output[0] and output[1]. 5–9s: the web branches outward into deep space like a cosmic filament structure. 9–13s: two filaments reach for the same already-spent output; only one survives, the other collapses in red.",
```

- [ ] **Step 7: Verify the grammar landed and the labels survived**

Run:
```bash
npm run typecheck
npm run export:prompts -- --project quantum-bitcoin-entanglement > /dev/null
grep -l "radial hyperspace light streaks" projects/quantum-bitcoin-entanglement/prompts/scene04.md
grep -l "white-cyan energy filament" projects/quantum-bitcoin-entanglement/prompts/scene05.md
grep -l "dark-matter-like filaments" projects/quantum-bitcoin-entanglement/prompts/scene06.md
grep -c "legible small text labels" projects/quantum-bitcoin-entanglement/prompts/scene0{4,5,6}.md
```
Expected: typecheck silent; each `grep -l` prints its filename; the final `grep -c` prints `1` for each of scenes 04, 05, 06.

- [ ] **Step 8: Verify the locked story fields did not move**

Run:
```bash
for n in 04 05 06; do
  diff <(sed -n '/## Narration/,/^---/p' projects/quantum-bitcoin-elements/prompts/scene$n.md) \
       <(sed -n '/## Narration/,/^---/p' projects/quantum-bitcoin-entanglement/prompts/scene$n.md) \
    > /dev/null || echo "FAIL scene$n: narration diverged"
  diff <(grep -E '^- \*\*(Layer|Camera|Video model|Format|Status):' projects/quantum-bitcoin-elements/prompts/scene$n.md) \
       <(grep -E '^- \*\*(Layer|Camera|Video model|Format|Status):' projects/quantum-bitcoin-entanglement/prompts/scene$n.md) \
    > /dev/null || echo "FAIL scene$n: locked field diverged"
done; echo "locked-field check done"
```
Expected: only `locked-field check done`.

- [ ] **Step 9: Commit**

```bash
git add projects/quantum-bitcoin-entanglement/scenes.ts projects/quantum-bitcoin-entanglement/prompts/
git commit -m "feat(entanglement): restyle atom scenes around the reference filament"
```

---

### Task 4: Restyle the quark scenes (7–9)

**Files:**
- Modify: `projects/quantum-bitcoin-entanglement/scenes.ts` — scenes with `id: 7`, `id: 8`, `id: 9`

**Interfaces:**
- Consumes: `production.grammar.{warpTunnel,filament,cosmicWeb}`, `production.toneByLayer.quark`, `production.nebulaByLayer.quark` from Task 1 — inlined as prose.
- Produces: nothing.

The nebula turns **deep teal** for all three so the violet script particles stay legible. Scene 8's `motionPrompt` is deliberately left alone — only its background changes. Scene 9 closes the loop by bringing the cosmic web back.

- [ ] **Step 1: Replace scene 7's `keyframePrompt`**

```ts
    keyframePrompt:
      'Scientific visualization, extreme macro inside a transaction output: radial hyperspace light streaks in cyan, violet and white converge inward at the frame edges, motion-blurred — we have just crash-zoomed through the atom shell — resolving at center on a glowing violet/magenta "scriptPubKey" binding-force lock; approaching it from the next transaction\'s input, a signature particle and a public-key particle travel as an entangled pair, joined to each other by one thin, intensely bright white-cyan filament, docking into the lock together; floating opcode text "OP_DUP OP_HASH160 <PubKeyHash> OP_EQUALVERIFY OP_CHECKSIG" orbits the lock; behind everything a sparse deep teal and blue nebula so the violet reads clearly; dense starfield, dark near-field, shallow depth of field, cinematic, ultra detailed, legible small text labels; no physical room or lab, no planet surface, no landscape, no people',
```

- [ ] **Step 2: Replace scene 7's `motionPrompt`**

```ts
    motionPrompt:
      "0–5s: macro warp-tunnel crash zoom into an output, streaks resolving on a glowing violet scriptPubKey lock condition. 5–11s: from the next transaction's input, a signature particle and a public-key particle arrive as an entangled pair joined by a filament, docking into the lock together. 11–15s: opcodes materialize and orbit around them. Shallow depth of field.",
```

- [ ] **Step 3: Replace scene 8's `keyframePrompt`**

Scene 8's `motionPrompt` is **not** edited — leave it exactly as it is.

```ts
    keyframePrompt:
      'Scientific visualization, extreme macro: a tall vertical transparent stack-tube shaped from glowing violet energy (NOT lab glassware) floating in deep space — no laboratory, no benches, no monitors, no furniture; violet-magenta subatomic quark-like particles labeled "Sig" and "PubKey" stacked inside; opcode operations shown as colliding particles; a single green "TRUE" particle glowing at the top; behind everything a sparse deep teal and blue nebula so the violet stack reads clearly; dense starfield, dark near-field, volumetric glow, cinematic, ultra detailed, legible small text labels; no planet surface, no landscape, no people',
```

- [ ] **Step 4: Replace scene 9's `keyframePrompt`**

```ts
    keyframePrompt:
      'Scientific visualization: camera pulled back to show a whole cyan transaction atom with multiple data surfaces glowing — "scriptPubKey", "OP_RETURN", "scriptSig", "witness", "Taproot script path", "coinbase input"; data particles approaching each surface; a translucent measuring grid labeled "BIP110" descending over all surfaces; far behind in the deep background, the vast web of faint violet dark-matter-like filaments studded with glowing nodes is visible again — the validator network this atom belongs to; a sparse deep teal and blue nebula; dense starfield, dark near-field, volumetric glow, cinematic, ultra detailed, legible small text labels; no physical room or lab, no planet surface, no landscape, no people',
```

- [ ] **Step 5: Replace scene 9's `motionPrompt`**

```ts
    motionPrompt:
      "0–6s: camera pulls back from the stack to reveal the whole transaction atom and its many data surfaces (scriptPubKey, OP_RETURN, scriptSig, witness, Taproot path, coinbase input). 6–11s: data particles approach each surface — some become spend conditions, some sit inert, some hide inside witness/script paths. 11–15s: a translucent BIP110 measuring grid descends, checking size and format (not meaning) of each surface; far behind, the cosmic web of validator nodes comes into view.",
```

- [ ] **Step 6: Verify the teal background reached all three and scene 8's motion is intact**

Run:
```bash
npm run typecheck
npm run export:prompts -- --project quantum-bitcoin-entanglement > /dev/null
grep -c "deep teal and blue nebula" projects/quantum-bitcoin-entanglement/prompts/scene0{7,8,9}.md
diff <(sed -n '/## Motion/,/## Narration/p' projects/quantum-bitcoin-elements/prompts/scene08.md) \
     <(sed -n '/## Motion/,/## Narration/p' projects/quantum-bitcoin-entanglement/prompts/scene08.md) \
  && echo "OK: scene 8 motion prompt unchanged"
```
Expected: typecheck silent; `grep -c` prints `1` for each of scenes 07, 08, 09; the diff prints `OK: scene 8 motion prompt unchanged`.

- [ ] **Step 7: Verify the locked story fields did not move**

Run:
```bash
for n in 07 08 09; do
  diff <(sed -n '/## Narration/,/^---/p' projects/quantum-bitcoin-elements/prompts/scene$n.md) \
       <(sed -n '/## Narration/,/^---/p' projects/quantum-bitcoin-entanglement/prompts/scene$n.md) \
    > /dev/null || echo "FAIL scene$n: narration diverged"
  diff <(grep -E '^- \*\*(Layer|Camera|Video model|Format|Status):' projects/quantum-bitcoin-elements/prompts/scene$n.md) \
       <(grep -E '^- \*\*(Layer|Camera|Video model|Format|Status):' projects/quantum-bitcoin-entanglement/prompts/scene$n.md) \
    > /dev/null || echo "FAIL scene$n: locked field diverged"
done; echo "locked-field check done"
```
Expected: only `locked-field check done`.

- [ ] **Step 8: Commit**

```bash
git add projects/quantum-bitcoin-entanglement/scenes.ts projects/quantum-bitcoin-entanglement/prompts/
git commit -m "feat(entanglement): restyle quark scenes onto a deep-teal nebula"
```

---

### Task 5: Verify the spec's success criteria and record the work

**Files:**
- Modify: `CHANGELOG.md` (the `[Unreleased]` → `Added` section)

**Interfaces:**
- Consumes: the finished `scenes.ts` from Tasks 1–4.
- Produces: nothing.

- [ ] **Step 1: Run the spec's success criteria end to end**

Run:
```bash
npm run typecheck && echo "1. OK typecheck"

npm run export:prompts -- --project quantum-bitcoin-entanglement | tail -1

git diff --quiet -- projects/quantum-bitcoin-elements/ \
  && echo "3. OK elements byte-identical"

for n in 01 02 03 04 05 06 07 08 09; do
  diff <(sed -n '/## Narration/,/^---/p' projects/quantum-bitcoin-elements/prompts/scene$n.md) \
       <(sed -n '/## Narration/,/^---/p' projects/quantum-bitcoin-entanglement/prompts/scene$n.md) \
    > /dev/null || echo "4. FAIL scene$n narration"
  diff <(grep -E '^- \*\*(Layer|Camera|Video model|Format|Status):' projects/quantum-bitcoin-elements/prompts/scene$n.md) \
       <(grep -E '^- \*\*(Layer|Camera|Video model|Format|Status):' projects/quantum-bitcoin-entanglement/prompts/scene$n.md) \
    > /dev/null || echo "4. FAIL scene$n locked field"
done; echo "4. OK locked fields"

for n in 02 05 07; do grep -q "white-cyan" projects/quantum-bitcoin-entanglement/prompts/scene$n.md || echo "5. FAIL scene$n missing filament"; done
for n in 03 06 09; do grep -q "dark-matter-like filaments" projects/quantum-bitcoin-entanglement/prompts/scene$n.md || echo "5. FAIL scene$n missing cosmic web"; done
for n in 04 07; do grep -q "radial hyperspace light streaks" projects/quantum-bitcoin-entanglement/prompts/scene$n.md || echo "5. FAIL scene$n missing warp tunnel"; done
echo "5. OK grammar placement"
```
Expected: `1. OK typecheck`, the export's `9 scene prompt files written…` line, `3. OK elements byte-identical`, `4. OK locked fields`, `5. OK grammar placement`, and **no `FAIL` lines**.

- [ ] **Step 2: Confirm no real-world imagery leaked in from the reference**

Run:
```bash
grep -il "beach\|palm\|ocean\|sunset\|from orbit\|horizon" projects/quantum-bitcoin-entanglement/prompts/*.md
```
Expected: no output.

These words describe the reference's dropped stock footage (the beach at sunset, Earth from orbit) and must never appear in a prompt. The pattern deliberately excludes `planet surface`, `landscape`, and `people`: those *do* appear in every prompt, but only inside negative clauses (`no planet surface, no landscape, no people`), so matching them would fail on correct output.

If a filename prints, open it — the dropped footage leaked into a prompt, violating a global constraint.

- [ ] **Step 3: Record the work in the changelog**

In `CHANGELOG.md`, under `## [Unreleased]` → `### Added`, replace the existing `quantum-bitcoin-entanglement` bullet with:

```markdown
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
```

- [ ] **Step 4: Commit**

```bash
git add CHANGELOG.md
git commit -m "docs(changelog): record the entanglement restyle"
```

- [ ] **Step 5: Report status and stop**

Print the final scene table and stop. Do **not** generate keyframes — that spends credits and needs explicit confirmation of model, resolution, and settings first.

Run:
```bash
npm run shot-list -- --project quantum-bitcoin-entanglement
git log --oneline -5
```
Expected: the 9-scene table with `Project: quantum-bitcoin-entanglement`, and the 5 commits from Tasks 1–5.

---

## Self-Review

**Spec coverage:**

| Spec requirement | Task |
|---|---|
| `styleTags` reworded, negatives widened | 1 |
| `palette.background` reworded, `palette.filament` added | 1 |
| `nebulaByLayer`, `toneByLayer`, `grammar` added | 1 |
| `layerColor` / `aspectRatio` / brand orange unchanged | Global Constraints; verified 5 |
| Grammar inlined, never templated | Global Constraints; comment in 1 |
| No shared tooling changes | Global Constraints; verified 1.3 |
| Filament → scenes 2, 5, 7 | 2, 3, 4; verified 5 |
| Cosmic web → scenes 3, 6, 9 | 2, 3, 4; verified 5 |
| Warp tunnel → scenes 4, 7 | 3, 4; verified 5 |
| Tone split molecule vs atom/quark | 2 (photoreal), 3–4 (diagram) |
| Photoreal cutaways dropped | verified 5.2 |
| Narration locked | Global Constraints; verified every task |
| Success criteria 1–5 | 5.1 |
| Captions out of scope | not implemented, by design |
| No credit spend | Global Constraints; 5.5 |

No gaps.

**Placeholder scan:** No TBD/TODO. Every prompt is written out in full; no step says "similar to Task N".

**Type consistency:** `grammar`, `toneByLayer`, `nebulaByLayer`, `palette.filament` are defined in Task 1 and referenced by those exact names in Tasks 2–4. `production` is `unknown` in `src/core/registry.ts`'s `satisfies` clause and `export-prompts.ts` never reads the new fields, so the two projects' differing `production` shapes cannot break the union — asserted by the typecheck in Task 1 Step 3.

**Known risk:** the `grep` verifications match on distinctive phrases (`white-cyan`, `dark-matter-like filaments`, `radial hyperspace light streaks`). If a prompt is reworded during execution, update the matching grep in the same step rather than loosening it.
