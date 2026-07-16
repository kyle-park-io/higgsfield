import type { Scene } from "./types.ts";

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
    "one continuous dark cosmic void (never a physical room or laboratory — no benches, monitors, or furniture), bioluminescent particles, translucent 3D structures, volumetric glow, scientific visualization, high detail, cinematic",
  /** Fixed palette reused on every keyframe. "Gold" is anchored to Bitcoin orange #F7931A (brand color). */
  palette: {
    background: "deep black to dark navy void, volumetric fog",
    transactionAtom: "cool cyan-white glowing particles",
    block: "Bitcoin-orange gold (#F7931A) amber translucent shell",
    coinbase: "extra-bright Bitcoin-orange gold (#F7931A), distinct geometry",
    valid: "green-white (TRUE particles)",
    invalid: "red",
    scriptQuark: "violet/magenta energy",
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
      "Abstract dark cosmic void filled with dozens of small glowing spherical plasma orbs of varying sizes drifting in volumetric fog, cool cyan-white bioluminescence with faint radiating light filaments; among the cyan orbs, one single larger orb glowing in warm Bitcoin-orange gold (hex #F7931A) stands out — a golden Bitcoin token marked with the ₿ symbol, representing the coinbase transaction; scientific particle-simulation aesthetic, cinematic, ultra detailed; no text, no numbers, no UI panels, no Ethereum, no diamond or octahedron gem, no other cryptocurrency logos",
    motionPrompt:
      "0–5s: scattered cyan transaction particles drift in dark void. 5–11s: particles are pulled inward and aggregate into one large translucent amber molecular block; the gold coinbase particle enters first and settles at the core. 11–15s: block completes with a soft pulsing glow. Particle-aggregation VFX, volumetric light.",
    camera: ["Dolly In"],
    models: { primary: "Seedance 2.0", alt: "Kling 3.0" }, // tested 3: Seedance std 3d5accd6, Seedance Mini 26956439, Kling v3.0 04b3968f
    narration:
      "비트코인의 장부는 거래 하나가 아니라 여러 트랜잭션을 담은 블록에서 시작된다. 블록의 첫 번째 트랜잭션은 새로운 비트코인과 수수료를 수집하는 코인베이스 트랜잭션이다.",
    status: "keyframe",
  },
  {
    id: 2,
    title: "블록이 사슬이 된다",
    layer: "molecule",
    durationSeconds: 15, // narration ~13s
    keyframePrompt:
      "Several completed Bitcoin-gold block-molecules (warm orange-gold, hex #F7931A), each a cluster of small glowing transaction atom-spheres bonded together by visible energy bonds, linked head-to-tail into a chain; a glowing crystalline block-header core inside each, a beam of light from one block's header pointing back to the previous block; the molecular chain recedes into dark cosmic space, ₿ symbols; the ₿ Bitcoin symbol only — no Ethereum, no other cryptocurrency logos, no diamond or octahedron gem, no flat honeycomb hexagon lattice",
    motionPrompt:
      "0–5s: the block-header nucleus ignites and emits a light beam linking to the previous block. 5–11s: camera pulls back revealing a long molecular chain of linked blocks. 11–15s: one middle block is tampered — all subsequent bonds flash red and tremble. Volumetric light, energy VFX.",
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
      "A glowing Bitcoin-gold block rendered as a clear molecule (warm orange-gold, hex #F7931A) — a cluster of many small translucent transaction atom-spheres bonded together by energy bonds, a ₿ symbol on it — floating in a dark cosmic void; several identical glowing holographic validator nodes (floating luminous verification units / ring-scanners, NOT physical servers, computers, monitors, or cameras) surround it, each independently running the same ruleset and casting a thin green verification scan-grid onto the molecule; a valid block glows green across all nodes, an invalid one flashes red; starfield background; no physical room or lab, no server racks, no monitors, no cameras, no Ethereum, no other cryptocurrency logos",
    motionPrompt:
      "0–6s: the block molecule passes between multiple node scanners; each scanner sequentially highlights header, transaction bundle, referenced previous outputs, script results. 6–12s: a valid block glows green across all nodes simultaneously. 12–15s: an invalid block is bounced out in red by every node at once.",
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
      'A single richly detailed glowing cyan transaction atom at center — a bright textured cyan nucleus labeled "version / locktime", surrounded by multiple concentric orbital shells with many orbiting electrons, glowing energy filaments and a luminous particle field; a left orbital band labeled "inputs (prev txid, vout, sequence, scriptSig/witness)" and a right orbital band labeled "outputs (amount, scriptPubKey)"; framing the atom, faint out-of-focus translucent Bitcoin-gold bonded atom-spheres of the parent block-molecule (warm orange-gold #F7931A) at the edges, as if we just crash-zoomed through the gold block surface into one of its transaction atoms; ornate atomic diagram, dark cosmic void with volumetric glow, cinematic, ultra detailed, legible small text labels',
    motionPrompt:
      "0–4s: crash zoom from the block surface into a single transaction atom. 4–9s: the atom rotates and its shells separate into labeled orbits — nucleus (version, locktime), left electrons (inputs), right electrons (outputs). 9–12s: gentle orbital rotation as labels settle.",
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
      'An atomic-diagram scene rendered entirely as glowing cyan particles and atoms (no machinery, no robots): a bright cyan output atom labeled "UTXO A / Alice (5.0 BTC)" stamped with a red "SPENT" seal; a new transaction shown as a glowing cyan atom whose input is a luminous energy reference-link (a glowing tendril, not a mechanical arm) pointing at UTXO A; a newly forming cyan output atom "UTXO B / Bob (3.5 BTC)"; a smaller cyan "Change UTXO / Alice (1.5 BTC)" atom curving back toward Alice; the spent atom dims while the new atoms brighten — no coin physically travels; dark void; no robotic arm, no mechanical device, no syringe, no drill',
    motionPrompt:
      "0–4s: UTXO-A (Alice) glows brightly. 4–9s: a new transaction's input reaches out and references UTXO-A; a red SPENT mark seals it; a new UTXO-B (Bob) crystallizes; a smaller change UTXO returns to Alice. 9–12s: no coin physically travels — the old output dims while new outputs glow. Slow push-in.",
    camera: ["Dolly In"],
    models: { primary: "Seedance 2.0", alt: "Kling 3.0" },
    narration:
      "비트코인에서 잔액 덩어리가 주소 사이를 이동하는 것은 아니다. 이전의 미사용 출력을 소비하고, 새로운 조건을 가진 출력을 만든다.",
    status: "keyframe",
  },
  {
    id: 6,
    title: "입력과 출력의 그래프",
    layer: "atom",
    durationSeconds: 13, // narration ~11s
    keyframePrompt:
      "Several transaction atoms connected like a chemical reaction diagram; glowing arrows from one tx's outputs into the next tx's inputs, forming a branching directed graph (not a straight line); cyan bonds, dark void",
    motionPrompt:
      "0–5s: transaction atoms connect via glowing bonds — TX0 output[1] flows into TX1 input[0], branching into output[0] and output[1]. 5–9s: the graph branches outward like molecular bonds. 9–13s: two inputs try to grab the same already-spent output; only one survives, the other collapses in red.",
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
      'Extreme macro view inside a transaction output revealing a glowing violet/magenta "scriptPubKey" binding-force lock; incoming signature particle and public-key particle from the next tx\'s input approaching an experiment chamber; floating opcode text "OP_DUP OP_HASH160 <PubKeyHash> OP_EQUALVERIFY OP_CHECKSIG"; shallow depth of field',
    motionPrompt:
      "0–5s: macro crash zoom into an output, revealing scriptPubKey as a glowing violet lock condition. 5–11s: from the next transaction's input, a signature particle and a public-key particle enter and dock into the experiment chamber. 11–15s: opcodes materialize and orbit around them. Shallow depth of field.",
    camera: ["Crash Zoom In", "Eyes In"],
    models: { primary: "Cinema Studio", alt: "Seedance 2.0" },
    narration:
      "출력은 단순히 소유자의 이름을 기록하지 않는다. 앞으로 이 출력을 소비하기 위해 만족해야 할 조건을 기록한다. 소비자는 다음 트랜잭션의 입력에서 그 조건을 만족하는 증명을 제시한다.",
    status: "keyframe",
  },
  {
    id: 8,
    title: "스택에서 검증하기 (충돌 실험)",
    layer: "quark",
    durationSeconds: 13, // narration ~11s
    keyframePrompt:
      'A tall vertical transparent stack-tube shaped from glowing violet energy (NOT lab glassware) floating in the same dark cosmic void as the other scenes — no laboratory, no benches, no monitors, no furniture; violet-magenta subatomic quark-like particles labeled "Sig" and "PubKey" stacked inside; opcode operations shown as colliding particles; a single green "TRUE" particle glowing at the top; starfield background',
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
      'Camera pulled back to show a whole transaction atom with multiple data surfaces glowing — "scriptPubKey", "OP_RETURN", "scriptSig", "witness", "Taproot script path", "coinbase input"; data particles approaching each surface; a translucent measuring grid labeled "BIP110" descending over all surfaces',
    motionPrompt:
      "0–6s: camera pulls back from the stack to reveal the whole transaction atom and its many data surfaces (scriptPubKey, OP_RETURN, scriptSig, witness, Taproot path, coinbase input). 6–11s: data particles approach each surface — some become spend conditions, some sit inert, some hide inside witness/script paths. 11–15s: a translucent BIP110 measuring grid descends, checking size and format (not meaning) of each surface.",
    camera: ["Super Dolly Out"],
    models: { primary: "Seedance 2.0", alt: "Kling 3.0" },
    narration:
      "가장 작은 층으로 내려오면 논쟁의 본질이 나타난다. 같은 바이트라도 어떤 것은 소유권을 증명하고, 어떤 것은 지불 조건을 만들며, 어떤 것은 임의의 정보를 운반한다. 따라서 BIP110의 질문은 단순히 'OP_RETURN을 허용할 것인가'가 아니다. 트랜잭션의 여러 데이터 표면에 대해 합의 규칙이 어디까지 크기와 형식을 제한할 것인가의 문제다.",
    status: "keyframe",
  },
];
