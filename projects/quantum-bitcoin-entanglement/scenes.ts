import type { Scene } from "../../src/core/types.ts";

/** Project-wide constants fixed across all 9 scenes (from the production guide). */
export const production = {
  aspectRatio: "21:9", // keyframe native ratio (nano_banana_pro / Soul); video uses each model's own native ratio — no cropping
  fps: 24,
  clipSeconds: 15, // legacy default/max; per-scene target is Scene.durationSeconds (Korean-VO paced)
  keyframeModel: "nano_banana_2", // request id for keyframes (ran as backend engine nano_banana_flash — echoed model ≠ requested id); soul_cinematic = mood/cheap alt — see src/mcp/model-map.ts
  /** Korean voiceover — narration text lives in each Scene.narration; generate via generate_audio. */
  voiceover: {
    model: "text2speech_v2",
    engine: "elevenlabs", // natural Korean; minimax is the close runner-up
    voice: "Brooks",
    voiceId: "c2acff45-84b2-4974-892d-89fa2d4e5598",
    gender: "male",
    language: "ko",
  },
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
      "radial hyperspace light streaks in cyan, violet and white converging inward, motion-blurred",
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
} as const;

/**
 * The 9 scenes, in order, as one continuous zoom-in
 * (blockchain -> block -> transaction -> input/output -> script -> opcode/byte).
 * Transition scenes (4, 7) use Crash Zoom In as a match-cut into the next layer.
 */
export const scenes: Scene[] = [
  {
    id: 1,
    title: "흩어진 거래들이 모인다",
    layer: "molecule",
    durationSeconds: 15, // narration ~13s
    keyframePrompt:
      "Photoreal deep-field astrophotography of an immense starfield with a rich magenta and violet nebula receding into deep space; scattered across the field, dozens of glowing spherical plasma orbs of varying sizes, each with a turbulent, roiling stellar surface of cyan-white energy and fine radiating light filaments; a faint constellation-line network of thin white lines and nodes overlays the background; among the cyan orbs, one single larger orb burns in warm Bitcoin-orange gold (hex #F7931A) — a golden Bitcoin token marked with the ₿ symbol, representing the coinbase transaction; high star density, dark near-field for contrast, volumetric glow, cinematic, ultra detailed; no text, no numbers, no UI panels, no labels, no planet surface, no landscape, no people, no Ethereum, no diamond or octahedron gem, no other cryptocurrency logos",
    motionPrompt:
      "0–5s: scattered cyan plasma orbs drift across the deep-field nebula, their stellar surfaces roiling. 5–11s: orbs are pulled inward and aggregate into one large translucent amber block-body; the gold coinbase orb enters first and settles at the core. 11–15s: block completes with a soft pulsing glow. Particle-aggregation VFX, volumetric light.",
    camera: ["Dolly In"],
    models: { primary: "Seedance 2.0", alt: "Kling 3.0" }, // tested 3: Seedance std 3d5accd6, Seedance Mini 26956439, Kling v3.0 04b3968f
    narration:
      "비트코인의 장부는 트랜잭션 하나가 아니라 여러 트랜잭션을 담은 블록에서 시작된다. 블록의 첫 번째 트랜잭션은 새로운 비트코인과 수수료를 수집하는 코인베이스 트랜잭션이다.",
    status: "keyframe",
  },
  {
    id: 2,
    title: "블록이 사슬이 된다",
    layer: "molecule",
    durationSeconds: 15, // narration ~13s
    keyframePrompt:
      "Photoreal deep-field astrophotography: several completed Bitcoin-gold block-bodies (warm orange-gold, hex #F7931A), each a cluster of small glowing transaction orbs with turbulent stellar plasma surfaces bonded together, linked head-to-tail into a chain receding into a rich magenta and violet nebula; between each block and the one before it runs one thin, intensely bright white-cyan energy filament emitted from a glowing crystalline block-header core — nothing travels along the filament — both ends respond together; ₿ symbols on the blocks; high star density, dark near-field, volumetric glow, cinematic, ultra detailed; no text labels, no planet surface, no landscape, no people; the ₿ Bitcoin symbol only — no Ethereum, no other cryptocurrency logos, no diamond or octahedron gem, no flat honeycomb hexagon lattice",
    motionPrompt:
      "0–5s: the block-header core ignites and shoots one thin bright white-cyan filament back to the previous block; nothing travels along it — both ends respond together. 5–11s: camera pulls back revealing a long chain of blocks linked by filaments, receding into the nebula. 11–15s: one middle block is tampered — every filament after it flashes red and trembles at once. Volumetric light, energy VFX.",
    camera: ["Dolly Out", "Crash Zoom In"],
    models: { primary: "Seedance 2.0", alt: "Kling 3.0" }, // both tested: Seedance std 31c0cdcb, Kling v3.0 eab0a320
    narration:
      "블록은 독립적으로 떠 있지 않는다. 각 블록은 이전 블록을 가리키며 순서 있는 기록을 만든다. 과거의 한 블록을 바꾸려면, 그 이후의 연결도 함께 다시 만들어야 한다.",
    status: "keyframe",
  },
  {
    id: 3,
    title: "노드는 모든 결합을 다시 본다",
    layer: "molecule",
    durationSeconds: 15, // narration ~12s
    keyframePrompt:
      "Photoreal deep-field astrophotography: a vast web of faint violet dark-matter-like filaments studded with glowing nodes fills the deep space background, receding into the distance — this web is the validator network, not a physical structure; its filaments are rim-lit in cool white and its nodes burn white-cyan, so the web separates cleanly from the nebula far behind it; at center floats a glowing Bitcoin-gold block-body (warm orange-gold, hex #F7931A), a cluster of bonded transaction orbs with turbulent stellar plasma surfaces, a ₿ symbol on it; trailing off to one side and out of focus, the faint chain of earlier gold blocks it is linked into, one of its filaments still guttering red from the tamper; several of the web's nodes brighten and each casts a translucent sphere of sweeping green energy arcs wrapped around the block, reading it without touching it; a valid block glows green across all nodes at once, an invalid one flashes red; rich magenta and violet nebula darkened and heavily defocused far behind the web, high star density, dark near-field, cinematic, ultra detailed; no physical room or lab, no server racks, no monitors, no computers, no cameras, no planet surface, no landscape, no people, no text labels, no Ethereum, no other cryptocurrency logos",
    motionPrompt:
      "0–6s: the red tremble still running down the tampered chain fades out of focus as the cosmic web's nodes brighten one by one, each wrapping the gold block in a sphere of sweeping green scan arcs — header, transaction bundle, referenced previous outputs, script results. 6–12s: a valid block glows green across all nodes simultaneously. 12–15s: an invalid block is bounced out in red by every node at once, while the valid gold block holds at center, still glowing green across the whole web.",
    camera: ["Static"],
    models: { primary: "Seedance 2.0", alt: "Cinema Studio" },
    narration:
      "비트코인에는 하나의 중앙 검사자가 없다. 각 풀노드는 블록과 트랜잭션을 스스로 검증한다. 같은 규칙을 실행한 노드들이 같은 유효한 기록을 선택한다.",
    status: "keyframe",
  },
  {
    id: 4,
    title: "트랜잭션의 구조 (해부) — 분자→원자 전환",
    layer: "atom",
    durationSeconds: 12, // narration ~9s
    keyframePrompt:
      'Scientific visualization: at the frame edges, radial hyperspace light streaks in cyan, violet and white converge inward, motion-blurred — we have just crash-zoomed through the gold block surface — and resolve at center into a single richly detailed glowing cyan transaction atom drawn as a precise ornate atomic diagram: a bright textured cyan nucleus labeled "version / locktime", surrounded by multiple concentric orbital shells with many orbiting electrons, glowing energy filaments and a luminous particle field; a left orbital band labeled "inputs (prev txid, vout, sequence, scriptSig/witness)" and a right orbital band labeled "outputs (amount, scriptPubKey)"; framing the atom, faint out-of-focus translucent Bitcoin-gold bonded orbs of the parent block-body (warm orange-gold #F7931A) at the edges; behind everything a muted violet-to-teal nebula, low density, heavily defocused; dense starfield, dark near-field, volumetric glow, cinematic, ultra detailed, legible small text labels; no physical room or lab, no planet surface, no landscape, no people',
    motionPrompt:
      "0–2s: we are already through the gold block surface and mid-warp — warp-tunnel streaks stream past the frame edges and begin to slow; the block we came through is behind us now, left as faint out-of-focus gold orbs at the edges, and with it the green validator glow and the red-rejected block smear away into the streaks; at center the cyan transaction atom is already resolved and holding still. 2–8s: the streaks thin and fall away past the frame edges; the atom holds center as its detail sharpens — it turns slowly and its concentric shells separate into distinct labeled orbits: nucleus (version, locktime), left band (inputs), right band (outputs). 8–12s: gentle orbital rotation as the atom settles and the labels come to rest.",
    camera: ["Crash Zoom In", "360 Orbit"],
    models: { primary: "Cinema Studio", alt: "Seedance 2.0" },
    narration:
      "트랜잭션은 단순한 송금 메시지가 아니다. 이전 출력을 가리키는 입력과, 앞으로 사용될 새로운 출력을 만드는 구조체다.",
    status: "keyframe",
  },
  {
    id: 5,
    title: "UTXO가 소비되고 생성된다",
    layer: "atom",
    durationSeconds: 12, // narration ~10s
    keyframePrompt:
      'Scientific visualization, ornate atomic diagram rendered entirely as glowing cyan particles and atoms (no machinery, no robots): on the right the same labeled cyan transaction atom we have just left, still slowly turning with its concentric shells settling and its left orbital band of inputs facing across the frame; on the left a cyan output atom labeled "UTXO A / Alice (5.0 BTC)", still burning bright and unspent with no seal on it yet; the two are separated across dark space and joined by one thin, intensely bright white-cyan energy filament that has just snapped into place — the input\'s reference to the previous output; nothing travels along the filament, no coin, no particle — both ends respond together; below the transaction atom, two faint uncrystallized cyan nucleation points labeled "UTXO B / Bob (3.5 BTC)" and "Change UTXO / Alice (1.5 BTC)", not yet formed; behind everything a muted violet-to-teal nebula, low density, heavily defocused; dense starfield, dark near-field, cinematic, ultra detailed, legible small text labels; no robotic arm, no mechanical device, no syringe, no drill, no physical room or lab, no planet surface, no landscape, no people',
    motionPrompt:
      "0–2s: the labeled transaction atom from the previous shot is still turning at right, its shells settling and its input band facing left; across the dark space UTXO-A (Alice) burns bright and unspent, and the filament between them has just snapped into place — the input's reference to the previous output. 2–8s: a red SPENT seal closes over UTXO-A; a new UTXO-B (Bob) crystallizes; a smaller change UTXO curves back to Alice. 8–12s: nothing travels along the filament — UTXO-A dims exactly as the new outputs brighten, both ends respond together. Slow push-in.",
    camera: ["Dolly In"],
    models: { primary: "Seedance 2.0", alt: "Kling 3.0" },
    narration:
      "비트코인에서 잔액이 주소 사이를 옮겨 다니지 않는다. 이전의 미사용 출력을 소비하고, 새로운 조건을 가진 출력을 만든다.",
    status: "keyframe",
  },
  {
    id: 6,
    title: "입력과 출력의 그래프",
    layer: "atom",
    durationSeconds: 13, // narration ~11s
    keyframePrompt:
      "Scientific visualization: several glowing cyan transaction atoms arranged as a directed web — faint violet dark-matter-like filaments studded with the atoms as glowing nodes, branching outward into deep space (not a straight line); each filament points from one transaction's output node to the next transaction's input node — one thin, intensely bright white-cyan line whose direction is marked by a small arrowhead at the input end; nothing travels along the filament — both ends respond together; small text labels read \"TX0\", \"output[0]\", \"output[1]\", \"TX1\", \"input[0]\"; at one node two separate filaments point at the same already-spent output — one survives and glows, the other collapses in red; behind everything a muted violet-to-teal nebula, low density, heavily defocused; dense starfield, dark near-field, volumetric glow, cinematic, ultra detailed, legible small text labels; no physical room or lab, no planet surface, no landscape, no people",
    motionPrompt:
      "0–5s: transaction atoms light up as nodes on a violet web — a filament points from TX0 output[1] to TX1 input[0], which branches into output[0] and output[1]; nothing travels along the filament — both ends respond together. 5–9s: the web branches outward into deep space like a cosmic filament structure. 9–13s: two filaments point at the same already-spent output; only one survives, the other collapses in red.",
    camera: ["Dolly Out", "Arc Left"],
    models: { primary: "Seedance 2.0", alt: "Kling 3.0" },
    narration:
      "트랜잭션의 연결은 단순한 계좌 이력보다 소비 가능한 출력들의 방향성 그래프에 가깝다. 하나의 출력은 유효한 체인에서 단 한 번만 소비될 수 있다.",
    status: "keyframe",
  },
  {
    id: 7,
    title: "잠금과 해제 (조건) — 원자→쿼크 전환",
    layer: "quark",
    durationSeconds: 15, // narration ~14s
    keyframePrompt:
      'Scientific visualization, extreme macro inside a transaction output: radial hyperspace light streaks in cyan, violet and white converge inward at the frame edges, motion-blurred — we have just crash-zoomed along the surviving filament of the transaction graph and through the atom shell, and that graph\'s faint web still hangs out of focus at the frame edges, its filaments rim-lit in cool white at this depth so they separate from both the violet at center and the teal nebula behind, never competing with the lock, one collapsed strand still fading red — resolving at center on a glowing violet/magenta "scriptPubKey" binding-force lock — the condition; far off to one side across dark space, inside the next transaction\'s input, a signature particle labeled "Sig" and a public-key particle labeled "PubKey" rest side by side as the two halves of one "scriptSig" — the proof; between that proof and the lock it satisfies runs one thin, intensely bright white-cyan energy filament; nothing travels along the filament, no particle crosses it — both ends respond together; floating opcode text "OP_DUP OP_HASH160 <PubKeyHash> OP_EQUALVERIFY OP_CHECKSIG" orbits the lock; behind everything a sparse deep teal and blue nebula so the violet reads clearly; dense starfield, dark near-field, shallow depth of field, cinematic, ultra detailed, legible small text labels; no physical room or lab, no planet surface, no landscape, no people',
    motionPrompt:
      "0–3s: the filament that survived the double-spend still glows while the collapsed one fades red at the edges; the camera crash zooms along it through the atom shell into the output it points at — macro warp-tunnel streaks resolving on a glowing violet scriptPubKey lock condition. 3–10s: the lock settles at center and its detail resolves; across the dark space, inside the next transaction's input, the Sig and PubKey particles of the scriptSig settle side by side as the proof, and one thin bright white-cyan filament snaps into place between that proof and the lock it satisfies; nothing travels along it — both ends respond together. 10–15s: opcodes materialize and orbit around the lock. Shallow depth of field.",
    camera: ["Crash Zoom In", "Eyes In"],
    models: { primary: "Cinema Studio", alt: "Seedance 2.0" },
    narration:
      "출력은 단순히 소유자의 이름을 기록하지 않는다. 앞으로 이 출력을 소비할 때 갖춰야 할 조건을 기록한다. 소비자는 다음 트랜잭션의 입력에서 그 조건을 만족하는 증명을 제시한다.",
    status: "keyframe",
  },
  {
    id: 8,
    title: "스택에서 검증하기 (충돌 실험)",
    layer: "quark",
    durationSeconds: 13, // narration ~11s
    keyframePrompt:
      'Scientific visualization, extreme macro: a tall vertical transparent stack-tube shaped from glowing violet energy (NOT lab glassware) floating in deep space — no laboratory, no benches, no monitors, no furniture; violet-magenta subatomic quark-like particles labeled "Sig" and "PubKey" stacked inside; opcode operations shown as colliding particles; a single green "TRUE" particle glowing at the top; behind everything a sparse deep teal and blue nebula so the violet stack reads clearly; dense starfield, dark near-field, volumetric glow, cinematic, ultra detailed, legible small text labels; no planet surface, no landscape, no people',
    motionPrompt:
      "0–3s: a \"Sig\" particle drops into a vertical transparent stack; \"PubKey\" stacks above. 3–8s: OP_DUP duplicates the pubkey, OP_HASH160 hashes the copy, it is compared to the stored PubKeyHash, OP_EQUALVERIFY checks the match, OP_CHECKSIG verifies the signature — each shown as a sequential particle collision. 8–11s: a single green TRUE particle remains. 11–13s: a failure branch shows a red FALSE collapse.",
    camera: ["Static"],
    models: { primary: "Seedance 2.0", alt: "Veo 3.1" },
    narration:
      "스크립트는 선언문이 아니라 실행 순서다. 데이터가 스택에 쌓이고, 연산자가 하나씩 실행된다. 최종 결과가 참이어야 이전 출력을 소비할 수 있다.",
    status: "keyframe",
  },
  {
    id: 9,
    title: "돈의 조건과 임의 데이터 (경계)",
    layer: "quark",
    durationSeconds: 15, // narration ~27s > 15s model cap → split into 9a/9b at generation (see guide §8)
    keyframePrompt:
      'Scientific visualization: camera pulled back to show a whole cyan transaction atom with multiple data surfaces glowing — "scriptPubKey", "OP_RETURN", "scriptSig", "witness", "Taproot script path", "coinbase input"; data particles approaching each surface; a translucent measuring grid labeled "BIP110" descending over all surfaces; far behind in the deep background, the vast web of faint violet dark-matter-like filaments studded with glowing nodes is visible again — the validator network this atom belongs to; a sparse deep teal and blue nebula; dense starfield, dark near-field, volumetric glow, cinematic, ultra detailed, legible small text labels; no physical room or lab, no planet surface, no landscape, no people',
    motionPrompt:
      "0–6s: camera pulls back from the stack to reveal the whole transaction atom and its many data surfaces (scriptPubKey, OP_RETURN, scriptSig, witness, Taproot path, coinbase input). 6–11s: data particles approach each surface — some become spend conditions, some sit inert, some hide inside witness/script paths. 11–15s: a translucent BIP110 measuring grid descends, checking size and format (not meaning) of each surface; far behind, the cosmic web of validator nodes comes into view.",
    camera: ["Super Dolly Out"],
    models: { primary: "Seedance 2.0", alt: "Kling 3.0" },
    narration:
      "가장 작은 층으로 내려오면 논쟁의 본질이 나타난다. 같은 바이트라도 어떤 것은 소유권을 증명하고, 어떤 것은 지불 조건을 만들며, 어떤 것은 임의의 정보를 운반한다. 따라서 BIP110의 질문은 단순히 'OP_RETURN을 허용할 것인가'가 아니다. 트랜잭션의 여러 데이터 표면에 대해 합의 규칙이 어디까지 크기와 형식을 제한할 것인가의 문제다.",
    status: "keyframe",
  },
];
