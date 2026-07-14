import type { Scene } from "./types.ts";

/** Project-wide constants fixed across all 9 scenes (from the production guide). */
export const production = {
  aspectRatio: "16:9", // Soul keyframe native ratio; video uses each model's own native ratio — no cropping
  fps: 24,
  clipSeconds: 15,
  keyframeModel: "Soul 2.0",
  styleTags:
    "dark cosmic void, bioluminescent particles, translucent 3D structures, volumetric glow, scientific visualization, high detail, cinematic",
  /** Fixed palette (Soul HEX / Moodboard) reused on every keyframe. */
  palette: {
    background: "deep black to dark navy void, volumetric fog",
    transactionAtom: "cool cyan-white glowing particles",
    block: "amber/gold translucent shell",
    coinbase: "extra-bright gold, distinct geometry",
    valid: "green-white (TRUE particles)",
    invalid: "red",
    scriptQuark: "violet/magenta energy",
  },
  /** Dominant color per scale layer — shifts as the zoom descends. */
  layerColor: { molecule: "amber", atom: "cyan", quark: "violet" },
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
    keyframePrompt:
      "Abstract dark cosmic void filled with dozens of small glowing spherical plasma orbs of varying sizes drifting in volumetric fog, cool cyan-white bioluminescence with faint radiating light filaments; among the cyan orbs, one single larger warm-gold orb stands out — a glowing golden Bitcoin token marked with the ₿ symbol, representing the coinbase transaction; scientific particle-simulation aesthetic, cinematic, ultra detailed; no text, no numbers, no UI panels, no Ethereum, no diamond or octahedron gem, no other cryptocurrency logos",
    motionPrompt:
      "0–5s: scattered cyan transaction particles drift in dark void. 5–11s: particles are pulled inward and aggregate into one large translucent amber molecular block; the gold coinbase particle enters first and settles at the core. 11–15s: block completes with a soft pulsing glow. Particle-aggregation VFX, volumetric light.",
    camera: ["Dolly In"],
    models: { primary: "Seedance 2.0", alt: "Kling 3.0" },
    narration:
      "비트코인의 장부는 거래 하나가 아니라 여러 트랜잭션을 담은 블록에서 시작된다. 블록의 첫 번째 트랜잭션은 새로운 비트코인과 수수료를 수집하는 코인베이스 트랜잭션이다.",
    status: "keyframe",
  },
  {
    id: 2,
    title: "블록이 사슬이 된다",
    layer: "molecule",
    keyframePrompt:
      "A completed amber molecular block with a glowing crystalline block-header nucleus at its center, a beam of light extending from the nucleus toward a previous block, a chain of linked blocks receding into dark space",
    motionPrompt:
      "0–5s: the block-header nucleus ignites and emits a light beam linking to the previous block. 5–11s: camera pulls back revealing a long molecular chain of linked blocks. 11–15s: one middle block is tampered — all subsequent bonds flash red and tremble. Volumetric light, energy VFX.",
    camera: ["Dolly Out", "Crash Zoom In"],
    models: { primary: "Seedance 2.0", alt: "DoP" },
    narration:
      "블록은 독립적으로 떠 있지 않는다. 각 블록은 이전 블록을 가리키며 순서 있는 기록을 만든다. 과거의 한 블록을 바꾸려면, 그 이후의 연결도 함께 다시 만들어야 한다.",
    status: "todo",
  },
  {
    id: 3,
    title: "노드는 모든 결합을 다시 본다",
    layer: "molecule",
    keyframePrompt:
      "A glowing amber block molecule passing before multiple identical node-scanner devices arranged around it in a dark lab-like void, each scanner projecting a thin scanning grid onto the block",
    motionPrompt:
      "0–6s: the block molecule passes between multiple node scanners; each scanner sequentially highlights header, transaction bundle, referenced previous outputs, script results. 6–12s: a valid block glows green across all nodes simultaneously. 12–15s: an invalid block is bounced out in red by every node at once.",
    camera: ["Static"],
    models: { primary: "Seedance 2.0", alt: "DoP" },
    narration:
      "비트코인에는 하나의 중앙 검사자가 없다. 각 풀노드는 블록과 트랜잭션을 스스로 검증한다. 같은 규칙을 실행한 노드들이 같은 유효한 기록을 선택한다.",
    status: "todo",
  },
  {
    id: 4,
    title: "트랜잭션의 구조 (해부) — 분자→원자 전환",
    layer: "atom",
    keyframePrompt:
      'Extreme close-up inside a block molecule; a single glowing transaction atom at center, its structure separated into orbital shells — central nucleus labeled "version / locktime", left orbit "inputs (prev txid, vout, sequence, scriptSig/witness)", right orbit "outputs (amount, scriptPubKey)"; clean atomic diagram, cyan glow',
    motionPrompt:
      "0–5s: crash zoom from the block surface into a single transaction atom. 5–11s: the atom rotates and its shells separate into labeled orbits — nucleus (version, locktime), left electrons (inputs), right electrons (outputs). 11–15s: gentle orbital rotation as labels settle.",
    camera: ["Crash Zoom In", "360 Orbit"],
    models: { primary: "DoP", alt: "Seedance 2.0" },
    narration:
      "트랜잭션은 단순한 송금 메시지가 아니다. 이전 출력을 가리키는 입력과, 앞으로 사용될 새로운 출력을 만드는 구조체다.",
    status: "todo",
  },
  {
    id: 5,
    title: "UTXO가 소비되고 생성된다",
    layer: "atom",
    keyframePrompt:
      'A bright glowing output atom labeled "UTXO A / Alice"; a reaching input arm from a new transaction pointing at it; a red "SPENT" seal forming on UTXO A; a newly crystallizing "UTXO B / Bob"; a smaller "change" UTXO returning toward Alice; dark void',
    motionPrompt:
      "0–5s: UTXO-A (Alice) glows brightly. 5–11s: a new transaction's input reaches out and references UTXO-A; a red SPENT mark seals it; a new UTXO-B (Bob) crystallizes; a smaller change UTXO returns to Alice. 11–15s: no coin physically travels — the old output dims while new outputs glow. Slow push-in.",
    camera: ["Dolly In"],
    models: { primary: "Seedance 2.0", alt: "Kling 3.0" },
    narration:
      "비트코인에서 잔액 덩어리가 주소 사이를 이동하는 것은 아니다. 이전의 미사용 출력을 소비하고, 새로운 조건을 가진 출력을 만든다.",
    status: "todo",
  },
  {
    id: 6,
    title: "입력과 출력의 그래프",
    layer: "atom",
    keyframePrompt:
      "Several transaction atoms connected like a chemical reaction diagram; glowing arrows from one tx's outputs into the next tx's inputs, forming a branching directed graph (not a straight line); cyan bonds, dark void",
    motionPrompt:
      "0–6s: transaction atoms connect via glowing bonds — TX0 output[1] flows into TX1 input[0], branching into output[0] and output[1]. 6–11s: the graph branches outward like molecular bonds. 11–15s: two inputs try to grab the same already-spent output; only one survives, the other collapses in red.",
    camera: ["Dolly Out", "Arc Left"],
    models: { primary: "Seedance 2.0", alt: "Kling 3.0" },
    narration:
      "트랜잭션의 연결은 단순한 계좌 이력보다 소비 가능한 출력들의 방향성 그래프에 가깝다. 하나의 출력은 유효한 체인에서 단 한 번만 소비될 수 있다.",
    status: "todo",
  },
  {
    id: 7,
    title: "잠금과 해제 (조건) — 원자→쿼크 전환",
    layer: "quark",
    keyframePrompt:
      'Extreme macro view inside a transaction output revealing a glowing violet/magenta "scriptPubKey" binding-force lock; incoming signature particle and public-key particle from the next tx\'s input approaching an experiment chamber; floating opcode text "OP_DUP OP_HASH160 <PubKeyHash> OP_EQUALVERIFY OP_CHECKSIG"; shallow depth of field',
    motionPrompt:
      "0–5s: macro crash zoom into an output, revealing scriptPubKey as a glowing violet lock condition. 5–11s: from the next transaction's input, a signature particle and a public-key particle enter and dock into the experiment chamber. 11–15s: opcodes materialize and orbit around them. Shallow depth of field.",
    camera: ["Crash Zoom In", "Eyes In"],
    models: { primary: "Cinema Studio", alt: "Seedance 2.0" },
    narration:
      "출력은 단순히 소유자의 이름을 기록하지 않는다. 앞으로 이 출력을 소비하기 위해 만족해야 할 조건을 기록한다. 소비자는 다음 트랜잭션의 입력에서 그 조건을 만족하는 증명을 제시한다.",
    status: "todo",
  },
  {
    id: 8,
    title: "스택에서 검증하기 (충돌 실험)",
    layer: "quark",
    keyframePrompt:
      'A vertical transparent stack test-tube in a dark lab; particles labeled "Sig" and "PubKey" stacked inside; opcode operations shown as colliding particles; violet-magenta energy; a single green "TRUE" particle glowing at the top',
    motionPrompt:
      "0–3s: a \"Sig\" particle drops into a vertical transparent stack; \"PubKey\" stacks above. 3–9s: OP_DUP duplicates the pubkey, OP_HASH160 hashes the copy, it is compared to the stored PubKeyHash, OP_EQUALVERIFY checks the match, OP_CHECKSIG verifies the signature — each shown as a sequential particle collision. 9–13s: a single green TRUE particle remains. 13–15s: a failure branch shows a red FALSE collapse.",
    camera: ["Static"],
    models: { primary: "Seedance 2.0", alt: "Veo 3.1" },
    narration:
      "스크립트는 선언문이 아니라 실행 순서다. 데이터가 스택에 쌓이고, 연산자가 하나씩 실행된다. 최종 결과가 참이어야 이전 출력을 소비할 수 있다.",
    status: "todo",
  },
  {
    id: 9,
    title: "돈의 조건과 임의 데이터 (경계)",
    layer: "quark",
    keyframePrompt:
      'Camera pulled back to show a whole transaction atom with multiple data surfaces glowing — "scriptPubKey", "OP_RETURN", "scriptSig", "witness", "Taproot script path", "coinbase input"; data particles approaching each surface; a translucent measuring grid labeled "BIP110" descending over all surfaces',
    motionPrompt:
      "0–6s: camera pulls back from the stack to reveal the whole transaction atom and its many data surfaces (scriptPubKey, OP_RETURN, scriptSig, witness, Taproot path, coinbase input). 6–11s: data particles approach each surface — some become spend conditions, some sit inert, some hide inside witness/script paths. 11–15s: a translucent BIP110 measuring grid descends, checking size and format (not meaning) of each surface.",
    camera: ["Super Dolly Out"],
    models: { primary: "Seedance 2.0", alt: "Kling 3.0" },
    narration:
      "가장 작은 층으로 내려오면 논쟁의 본질이 나타난다. 같은 바이트라도 어떤 것은 소유권을 증명하고, 어떤 것은 지불 조건을 만들며, 어떤 것은 임의의 정보를 운반한다. 따라서 BIP110의 질문은 단순히 'OP_RETURN을 허용할 것인가'가 아니다. 트랜잭션의 여러 데이터 표면에 대해 합의 규칙이 어디까지 크기와 형식을 제한할 것인가의 문제다.",
    status: "todo",
  },
];
