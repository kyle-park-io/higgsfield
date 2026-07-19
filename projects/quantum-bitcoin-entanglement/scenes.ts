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
    // "photoreal" alone loses to saturation words — anchor with camera language (telescope, long
    // exposure, film grain) and say "not vivid" out loud. Proven on scene 1 v1 (failed) vs v2 (keeper).
    molecule:
      "astrophotography photographed through a telescope on a long exposure, mostly black field, turbulent stellar plasma surfaces granulated like a real star's convecting photosphere, subtle color, deep blacks, film grain, no text labels",
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
    // "rich"/"high star density" blew out the frame and flattened the subject into wallpaper —
    // the reference's own nebula is mostly black with faint dust. Keep it far back and defocused.
    molecule:
      "faint dusty magenta-violet nebula drifting far behind everything, heavily out of focus, subtle — not vivid, not saturated; sparse stars over large areas of empty black",
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
      "Astrophotography, photographed through a telescope on a long exposure: a mostly black deep-space field, with a faint dusty magenta-violet nebula drifting far behind everything, heavily out of focus and subtle — not vivid, not saturated. A sparse scattering of small glowing plasma orbs drifts in volumetric fog across the dark near-field, unevenly placed with large areas of empty black between them; each orb has a turbulent, roiling stellar surface, cyan-white and granulated like a real star's convecting photosphere, with fine radiating light filaments. Nearer to camera and noticeably larger than the rest, one orb burns in warm Bitcoin-orange gold (hex #F7931A) — a golden Bitcoin star marked with the ₿ symbol, its surface violently convecting, gold filaments radiating into the dark; it is the brightest thing in frame and reads immediately as the subject, but it sits off-center among the others, not yet gathered with them. A faint constellation-line network of thin white lines and nodes is barely visible far behind. Dark, restrained, subtle color, deep blacks, film grain, cinematic, ultra detailed; no text, no numbers, no UI panels, no labels, no planet surface, no landscape, no people, no Ethereum, no diamond or octahedron gem, no other cryptocurrency logos",
    motionPrompt:
      "0–2s: opens exactly on the still frame it starts from — a mostly black deep-field starfield with a faint dusty magenta-violet nebula far behind, scattered cyan plasma orbs drifting apart in volumetric fog, one larger warm Bitcoin-gold orb marked ₿ burning off-centre, everything still scattered and separate. 2–9s: the scattered orbs drift inward and clump together into one block-molecule — a cluster of many small, individually visible glowing transaction orbs bonded together like a raspberry of separate spheres, distinct and countable, their surfaces turbulent and granulated like a real star's convecting photosphere, never fusing into one smooth ball; the larger warm-gold ₿ orb moves in first and settles deep at the cluster's centre as a bright faceted crystalline block-header core, the ₿ glowing from within it. 9–13s: the cluster finishes gathering, all its bonded orbs settled and glowing steadily around the gold crystalline core — an organic star-cluster block, the same kind that will later chain together. 13–15s: the completed orb-cluster holds with a soft slow pulse, a calm final beat. Photoreal deep-field astrophotography, turbulent granulated stellar surfaces, film grain, deep blacks; the ₿ symbol only, no other text, no numbers, no labels, no planet, no landscape, no people; no flat coin or medallion, no glowing wireframe box or cage around the cluster. Slow gentle dolly push-in.",
    camera: ["Dolly In"],
    models: { primary: "Seedance 2.0", alt: "Seedance 2.0 Mini" },
    narration:
      "비트코인의 장부는 트랜잭션 하나가 아니라 여러 트랜잭션을 담은 블록에서 시작된다. 블록의 첫 번째 트랜잭션은 새로운 비트코인과 수수료를 수집하는 코인베이스 트랜잭션이다.",
    status: "video",
  },
  {
    id: 2,
    title: "블록이 사슬이 된다",
    layer: "molecule",
    durationSeconds: 15, // narration ~13s
    keyframePrompt:
      "Astrophotography, photographed through a telescope on a long exposure: a mostly black deep-space field, with a faint dusty magenta-violet nebula drifting far behind everything, heavily out of focus and subtle — not vivid, not saturated; sparse stars over large areas of empty black. Several completed Bitcoin-gold block-molecules (warm orange-gold, hex #F7931A) form a chain that runs ACROSS the full width of the wide 21:9 frame, left to right, and recedes into depth as it travels rightward: the nearest cluster is very large and close, sitting low in the LEFT foreground; the chain then marches off to the RIGHT, each successive cluster markedly smaller than the one before it — roughly three-quarters the size of its predecessor — dimmer and hazier too, so the farthest clusters are small faint specks near the right side dissolving into the black, a clear diminishing-perspective chain receding toward a vanishing point on the right, spanning the wide horizontal frame edge to edge, never a vertical stack and never a flat row of same-size blocks. As it travels rightward the chain also zigzags hard up and down — the first low, the next jumps high, the next drops low again, the next up high again, a strong sawtooth where no three are anywhere near a straight line — but the overall run of the chain is horizontal, sweeping left to right across the frame. Each is separated from its neighbours by a wide gap of empty black. Because the blocks sit at such different heights and such different distances, no single straight line could ever pass through them. Each block-molecule is a cluster of many small, individually visible glowing transaction orbs bonded together like a raspberry of separate spheres — the individual orbs are distinct and countable, never fused into one smooth mass — their surfaces turbulent and granulated like a real star's convecting photosphere; every cluster is a different irregular organic shape, some packed tight and round, others looser and more open. Deep inside each cluster, clearly visible through the surrounding orbs, sits one bright faceted crystalline block-header core, and the ₿ symbol glows from within that core, lit from the inside so it reads through the orbs. Between each block and the one before it is one short, separate, straight white-cyan filament that only spans that one gap — each filament tilts at a steep angle following the sawtooth (up to a high block, then down to a low one), and the filaments plainly do NOT line up into one continuous line: each is its own short segment with a clear kink in direction at every block, like the zigzag stitching between beads, never a single rod threading straight through the whole chain; nothing travels along the filament — both ends respond together. Dark, restrained, subtle color, deep blacks, film grain, volumetric glow, cinematic, ultra detailed; no text labels, no planet surface, no landscape, no people; the ₿ Bitcoin symbol only — no Ethereum, no other cryptocurrency logos, no diamond or octahedron gem, no flat honeycomb hexagon lattice",
    motionPrompt:
      "0–2s: opens exactly on the still frame it starts from — a large warm Bitcoin-gold block-molecule (a cluster of glowing orbs with a crystalline ₿ header core) close in the lower-LEFT foreground, and a chain of the same blocks zigzagging up and down as it recedes to the RIGHT, each smaller and fainter, joined across the gaps by short separate white-cyan filaments that kink at every block, all against a mostly black field. 2–8s: the camera dollies distinctly and steadily BACK, clearly opening up the frame — the big foreground block pulls fully into view and the whole chain is revealed sweeping off to the right into the dark; each header core glows in turn and each filament pulses gently — nothing travels along the filaments, both ends respond together. 8–12s: one middle block of the chain is tampered — a red flush wells up inside that one block, and then ONLY the filaments and blocks DOWNSTREAM of it (toward the receding right end) flash red and tremble one after another in sequence, while every block BEFORE it stays calm and gold; it reads as that later section going invalid, never a full-frame red wash. 12–15s: the red tremble keeps running down the later blocks and settles there, holding a steady glowing red, the earlier chain still calm gold, as a slow gentle push eases toward the tampered stretch — a charged but calm final beat. Photoreal deep-field astrophotography, granulated stellar surfaces, film grain, deep blacks; the ₿ symbol only, no other text, no numbers, no labels, no planet, no landscape, no people. Volumetric light.",
    camera: ["Dolly Out"],
    models: { primary: "Seedance 2.0", alt: "Seedance 2.0 Mini" },
    narration:
      "블록은 독립적으로 떠 있지 않는다. 각 블록은 이전 블록을 가리키며 순서 있는 기록을 만든다. 과거의 한 블록을 바꾸려면, 그 이후의 연결도 함께 다시 만들어야 한다.",
    status: "video",
  },
  {
    id: 3,
    title: "노드는 모든 결합을 다시 본다",
    layer: "molecule",
    durationSeconds: 15, // narration ~12s
    keyframePrompt:
      "Astrophotography, photographed through a telescope on a long exposure: a mostly black deep-space field. A vast web of faint violet dark-matter-like filaments studded with glowing nodes recedes through the background — this web is the validator network, not a physical structure; its filaments are rim-lit in cool white and its nodes burn white-cyan, so the web separates cleanly from a faint dusty magenta-violet nebula drifting far behind it, heavily out of focus and subtle — not vivid, not saturated. At center, the brightest thing in frame, floats a glowing Bitcoin-gold block-body (warm orange-gold, hex #F7931A), a cluster of bonded transaction orbs whose surfaces are turbulent and granulated like a real star's convecting photosphere, a ₿ symbol on it; trailing off to one side and out of focus, the faint chain of earlier gold blocks it is linked into, one of its filaments still guttering red from the tamper. Several of the web's nodes brighten and each casts a translucent sphere of sweeping green energy arcs wrapped around the block, reading it without touching it; a valid block glows green across all nodes at once, an invalid one flashes red. Dark, restrained, subtle color, deep blacks, film grain, cinematic, ultra detailed; no physical room or lab, no server racks, no monitors, no computers, no cameras, no planet surface, no landscape, no people, no text labels, no Ethereum, no other cryptocurrency logos",
    motionPrompt:
      "0–2s: opens exactly on the still frame it starts from — a vast violet cosmic web of dark-matter-like filaments and glowing white-cyan nodes, one gold Bitcoin block-molecule (a cluster of bonded glowing orbs with the ₿ within) at center, the faint tampered chain still trailing off to one side with a filament guttering red. The camera is locked and static the entire time — the framing never changes and nothing enters or leaves the frame. 2–6s: the red tremble on the trailing chain fades out of focus as the web's nodes brighten one by one, each casting a translucent sphere of sweeping green scan arcs that reach across the dark toward the central gold block, independently reading it — header, transaction bundle, referenced previous outputs, script results; the nodes and their green light do the moving, while the block itself stays put at center. 6–11s: more and more nodes light green and their arcs converge on the block until it glows green across the entire web at once — every node independently arriving at the same result, validated by consensus. 11–15s: the whole web holds a steady even green, the valid gold block resting calm and centered while faint green ripples settle outward through the filaments — a calm final beat. Photoreal deep space, granulated stellar surfaces, film grain; the ₿ symbol only, no other text, no numbers, no labels, no servers, no monitors, no planet, no landscape, no people.",
    camera: ["Static"],
    models: { primary: "Seedance 2.0", alt: "Seedance 2.0 Mini" },
    narration:
      "비트코인에는 하나의 중앙 검사자가 없다. 각 풀노드는 블록과 트랜잭션을 스스로 검증한다. 같은 규칙을 실행한 노드들이 같은 유효한 기록을 선택한다.",
    status: "video",
  },
  {
    id: 4,
    title: "트랜잭션의 구조 (해부) — 분자→원자 전환",
    layer: "atom",
    durationSeconds: 12, // VO 9.8s (Brooks) + ~2s breathing room
    keyframePrompt:
      'Scientific visualization, a mostly dark and restrained frame: only in a thin band along the extreme outer edges do radial hyperspace light streaks in cyan, violet and white still smear inward, motion-blurred, dying out well before they reach the middle — we have just crash-zoomed through the gold block surface and the tunnel is already behind us. The centre of the frame is calm dark space with deep blacks, and filling it is a single richly detailed glowing cyan transaction atom — large, close and dominant, its outermost shell reaching almost to the top and bottom edges of the frame, so that we have plainly arrived at it rather than glimpsed it from far off — drawn as a precise ornate atomic diagram: a bright textured cyan nucleus labeled "version / locktime", surrounded by multiple concentric orbital shells with many orbiting electrons, glowing energy filaments and a luminous particle field; a left orbital band labeled "inputs (prev txid, vout, sequence, scriptSig/witness)" and a right orbital band labeled "outputs (amount, scriptPubKey)"; all three labels are set in clean, comfortably readable type — a little larger than a caption and clearly legible at a glance, but modest enough to sit beside the atom without competing with it; framing the atom at the frame edges, faint blurred fragments of the parent block-molecule we have just come through — clusters of many small warm orange-gold (#F7931A) plasma orbs bonded together, heavily out of focus and dim; behind everything a muted violet-to-teal nebula, low density, heavily defocused; dense starfield, dark near-field, volumetric glow, cinematic, ultra detailed, legible text labels; no physical room or lab, no planet surface, no landscape, no people, no coins, no flat gold discs, no medallions, no ₿ symbols at the edges',
    motionPrompt:
      "0–2s: the shot opens exactly on the still frame it starts from and barely moves — the cyan transaction atom already large, resolved and holding at the centre of calm dark space with its labels already legible, only a thin band of warp streaks left smearing at the extreme outer edges, the parent block's gold orb clusters blurred at the corners; the warp is over and behind us, and those last edge streaks simply slow and fade. 2–8s: the edge streaks thin away entirely; the atom holds centre as its detail sharpens; it stays facing the camera the whole time, essentially still, with only the faintest drift of parallax — the concentric orbital rings stay fully round and wide open at every single moment, never squashing into ellipses, never collapsing toward vertical lines, never edge-on; the atom keeps the same front-on circular silhouette it has in the opening frame from start to finish. What moves is the detail, not the atom: electrons travel along the rings, particles shimmer, the nucleus pulses. The labels (nucleus version/locktime, left band inputs, right band outputs) stay flat, upright and readable throughout. 8–12s: the atom holds dead front-on and comes to rest, its rings still perfectly round, everything legible and calm.",
    camera: ["Crash Zoom In", "360 Orbit"],
    // Only this project's own test so far: Seedance Mini b33a7b16 (21:9, 12s, 30cr) — the motion arc
    // works and the labels survive, but start_image did NOT pin frame 1; see credit-log.md.
    models: { primary: "Seedance 2.0", alt: "Seedance 2.0 Mini" },
    narration:
      "트랜잭션은 단순한 송금 메시지가 아니다. 이전 출력을 가리키는 입력과, 앞으로 사용될 새로운 출력을 만드는 구조체다.",
    status: "keyframe",
  },
  {
    id: 5,
    title: "UTXO가 소비되고 생성된다",
    layer: "atom",
    durationSeconds: 13, // VO 10.5s + ~2s room
    keyframePrompt:
      "Scientific visualization, ornate atomic diagram rendered entirely as glowing cyan particles and atoms (no machinery, no robots), and with absolutely NO text, NO labels, NO letters and NO numbers anywhere in the frame — pure imagery only. Composition is balanced across the wide frame: on the LEFT, its centre about one-sixth in from the left edge, one single large bright cyan output atom — a UTXO still burning bright and fully unspent, no seal on it, the largest sphere in the whole frame; at the HORIZONTAL CENTRE of the frame, the same cyan transaction atom we have just left, its concentric shells still settling — it carries a single solitary input, one lone bright bead sitting by itself on the left rim of the atom, alone on that side with clear empty space above and below it; the big left UTXO and the centre transaction atom are joined across dark space by one thin, intensely bright white-cyan energy filament running from the UTXO to that one input bead — the input's reference to the previous output; nothing travels along the filament, no coin, no particle — both ends respond together. The transaction atom is only just beginning to bud its two new outputs, and both are still extremely faint, barely nucleating wisps that have not yet formed into spheres: from the atom's right side the faintest hint of a cyan stream reaching toward the RIGHT, about three-quarters of the way across the frame and kept clear of the right edge with margin around it, where one output will later condense; and from the atom's lower left the faintest hint of a second, narrower stream curving down and back toward the LEFT, into the lower-centre beneath the gap between the UTXO and the atom on Alice's side, where a smaller change output will later condense — the outputs are nascent wisps only, so there is plainly empty room for them to grow. Behind everything a muted violet-to-teal nebula, low density, heavily defocused; dense starfield, dark near-field, cinematic, ultra detailed; no text, no labels, no numbers, no robotic arm, no mechanical device, no syringe, no drill, no physical room or lab, no planet surface, no landscape, no people",
    motionPrompt:
      "The camera is locked and static so the composition never shifts (labels are added in post and need every element to hold a fixed position) — but the elements INSIDE the frame clearly animate through a spend-THEN-create sequence in strict order; do not freeze the scene, and render NO text or labels of any kind. 0–2s: opens exactly on the still frame it starts from — UTXO A the large bright cyan orb at far left, the cyan transaction atom at the centre with its single input bead, one thin white-cyan filament already spanning the gap from UTXO A to that input bead; the two outputs do NOT exist yet, only the faintest wisps budding from the atom. 2–6s FIRST the spend: a red SPENT seal stamps squarely onto the face of UTXO A and holds there, marking it consumed (no stray red anywhere else); UTXO A's value visibly drains OUT of it along the filament toward the atom as UTXO A itself begins to dim. 6–10s THEN the create: only now, fed by that incoming value, the transaction atom gives birth to its two new outputs — on the RIGHT a broad stream condenses into a solid bright cyan output sphere about three-quarters across the frame (Bob, the larger one), and from the atom's lower left a narrower stream curves down and back toward the LEFT into the lower-centre on Alice's side and condenses into a smaller cyan output sphere (the change, plainly smaller), the two new spheres brightening up to full in strict 3.5-to-1.5 proportion. 10–13s: the spend fully completes — UTXO A finishes darkening all the way down to a dead, burnt-out husk at far left with its value gone and the red SPENT seal fading out with it, while the two new outputs hold bright and settled, the change sphere clearly linked back toward Alice's side; a calm final beat. Nothing ever travels along any filament as a moving dot — both ends respond together. Scientific visualization, glowing cyan atoms on a muted violet-to-teal nebula, deep space, volumetric glow, film grain; every element holds its fixed on-screen position; no text, no numbers, no labels, no planet, no landscape, no people.",
    camera: ["Static"],
    models: { primary: "Seedance 2.0", alt: "Seedance 2.0 Mini" },
    narration:
      "비트코인에서 잔액이 주소 사이를 옮겨 다니지 않는다. 이전의 미사용 출력을 소비하고, 새로운 조건을 가진 출력을 만든다.",
    // Burned on in post, not generated (clip is text-free). Positions re-measured against the
    // text-free keeper 861fd132 (held-husk edit): UTXO A husk far-left ~0.17, atom centre ~0.50,
    // Bob ~0.83, Change lower-left ~0.27.
    labels: [
      { text: "UTXO A / Alice (5.0 BTC)", x: 0.06, y: 0.24 },
      { text: "Transaction Atom (TXID)", x: 0.4, y: 0.19 },
      { text: "UTXO B / Bob (3.5 BTC)", x: 0.72, y: 0.24 },
      { text: "Change UTXO / Alice (1.5 BTC)", x: 0.13, y: 0.86 },
    ],
    status: "video",
  },
  {
    id: 6,
    title: "입력과 출력의 그래프",
    layer: "atom",
    durationSeconds: 15, // VO 12.75s + ~2s room
    keyframePrompt:
      "Scientific visualization, a clean and readable directed graph of glowing cyan transaction-atom nodes on a faint violet dark-matter web, with absolutely NO text, NO labels, NO letters and NO numbers anywhere — pure imagery only. It reads left to right in time and is deliberately SPARSE and legible, only a handful of clearly separated nodes with plenty of dark space between them, NOT an overwhelming dense fractal. On the far LEFT sits one origin node; from it two thin, intensely bright white-cyan filaments branch rightward, each ending in a small arrowhead at a node in the centre-left — every filament runs from the output side of an earlier node to the input side of a later node, so the arrowheads all point rightward in the direction of time; nothing travels along the filaments, both ends respond together. The graph continues rightward to one single node at the CENTRE that stands out as the unmistakable focal point, drawn much larger and brighter than every other node with the sparse web falling away darker around it: this is one contested output. From that one contested output TWO filaments leave at once toward two clearly different rival transaction nodes on the right — both reaching for that same single output, but only one may have it: the UPPER filament is an intact bright white-cyan line and its arrowhead lands cleanly and firmly on the upper-right node, which glows bright and fully connected — the winner; the LOWER filament has gone RED along its whole length, the only red anywhere in the frame, and it plainly FAILS — its line frays and breaks apart into cool dying embers before it can reach the lower-right node, no arrowhead ever forming, so that lower-right node is left dim, detached and cut off from the graph — the rejected loser. Two separate transactions reaching for one output, only one connected. Behind everything a muted violet-to-teal nebula, low density, heavily defocused; dense starfield, dark near-field, volumetric glow, cinematic, ultra detailed; no text, no labels, no numbers, no physical room or lab, no planet surface, no landscape, no people",
    motionPrompt:
      "The camera is locked and completely static the whole time — the graph layout never shifts, so post-production labels can sit on fixed node positions; render NO text or labels of any kind. 0–2s: opens exactly on the still frame it starts from — a clean, sparse, readable directed graph of glowing cyan nodes on a faint violet web, arrowheads pointing rightward in time, one node at the centre clearly the largest and brightest (the contested output), with two rival nodes off to its upper-right and lower-right. 2–7s: the directed links draw themselves in along the graph, each arrowhead pointing from an earlier node's output to a later node's input; nothing travels along them, both ends respond together. 7–11s is the double-spend: from the one bright contested output, TWO links reach out at once toward the two rival transactions — the UPPER one lands cleanly as an intact bright white-cyan filament, its arrowhead locking firmly onto the upper-right node, which brightens fully connected (the winner); the LOWER one turns RED along its whole length (the only red in the frame), then frays and breaks apart into dying embers before it can reach the lower-right node, no arrowhead forming, and that lower-right node is left dim, detached and cut off from the graph (the rejected loser). 11–15s: the graph holds perfectly still — the winning white link glowing and connected, the losing red link dark and broken with its node cut off — a calm final beat. Scientific visualization, glowing cyan nodes on a violet web, deep space, volumetric glow; the camera never moves; no text, no numbers, no labels, no planet, no landscape, no people.",
    camera: ["Static"],
    models: { primary: "Seedance 2.0", alt: "Seedance 2.0 Mini" },
    narration:
      "트랜잭션의 연결은 단순한 계좌 이력보다 소비 가능한 출력들의 방향성 그래프에 가깝다. 하나의 출력은 유효한 체인에서 단 한 번만 소비될 수 있다.",
    // Burned on in post (clip is text-free). Positions measured against the locked keeper 8fd22554:
    // origin far-left ~0.10, TX1 (its output is contested) centre ~0.50, TX2 winner upper-right ~0.88,
    // TX3 loser lower-right ~0.89. TX0→TX1, then TX2 & TX3 both try to spend TX1's one output — the
    // double-spend: TX2 connects, TX3 stays detached.
    labels: [
      { text: "TX0", x: 0.05, y: 0.3 },
      { text: "TX1", x: 0.475, y: 0.28 },
      { text: "TX2 (winner)", x: 0.76, y: 0.13 },
      { text: "TX3 (rejected)", x: 0.74, y: 0.87 },
    ],
    status: "video",
  },
  {
    id: 7,
    title: "잠금과 해제 (조건) — 원자→쿼크 전환",
    layer: "quark",
    durationSeconds: 15, // narration ~14s
    keyframePrompt:
      'Scientific visualization, extreme macro inside a transaction output: radial hyperspace light streaks in cyan, violet and white converge inward at the frame edges, motion-blurred — we have just crash-zoomed along the surviving filament of the transaction graph and through the atom shell, and that graph\'s faint web still hangs out of focus at the frame edges, its filaments rim-lit in cool white at this depth so they separate from both the violet at center and the teal nebula behind, never competing with the lock, one collapsed strand still fading red — resolving at center on the condition itself: violet/magenta binding force gathered into the unmistakable silhouette of a closed padlock — a solid rounded body with a shackle arching over it, instantly readable as a lock at a glance — but built entirely from glowing energy: its body a dense knot of twisted field lines spiraling inward to a bright violet core, its shackle a taut arc of plasma, its whole outline drawn in light, a lock made of force rather than of metal; labeled "scriptPubKey"; no keyhole, no key, no chain, no metal, no rivets, no mechanical hardware; far off to one side across dark space, inside the next transaction\'s input, a signature particle labeled "Signature" and a public-key particle labeled "Public Key" rest side by side as the two halves of one "scriptSig" — the proof; between that proof and the lock it satisfies runs one thin, intensely bright white-cyan energy filament; nothing travels along the filament, no particle crosses it — both ends respond together; floating opcode text "OP_DUP OP_HASH160 <PubKeyHash> OP_EQUALVERIFY OP_CHECKSIG" orbits the lock, every character upright and reading normally; behind everything a sparse deep teal and blue nebula so the violet reads clearly; dense starfield, dark near-field, shallow depth of field, cinematic, ultra detailed, legible small text labels; no physical room or lab, no planet surface, no landscape, no people',
    motionPrompt:
      "0–2s: opens exactly on the still frame it starts from — a glowing violet padlock built of energy field-lines at centre (the scriptPubKey lock), a single static ring of opcode text around it, the Sig and PubKey proof particles resting to the right, a thin white-cyan filament already spanning from the proof to the lock, warp-tunnel streaks fading at the extreme edges, one red collapsed strand still dying at the edge. The camera has already arrived and now holds essentially still so nothing shifts. 2–8s: the warp streaks fade away; the lock's twisted field-lines tighten and its violet core brightens; the filament between proof and lock pulses — nothing travels along it, both ends respond together. 8–13s: the proof particles settle firmly, the opcode ring holds steady and sharp around the lock (not spinning), everything locking into place. 13–15s: the whole composition holds still, the violet lock glowing, a calm final beat. Extreme macro, shallow depth of field, deep teal-and-blue nebula, volumetric glow; keep it stable, no camera push, no orbit; no stray text beyond the lock's own opcode ring, no planet, no people.",
    camera: ["Crash Zoom In", "Eyes In"],
    models: { primary: "Seedance 2.0", alt: "Seedance 2.0 Mini" },
    narration:
      "출력은 단순히 소유자의 이름을 기록하지 않는다. 앞으로 이 출력을 소비할 때 갖춰야 할 조건을 기록한다. 소비자는 다음 트랜잭션의 입력에서 그 조건을 만족하는 증명을 제시한다.",
    status: "keyframe",
  },
  {
    id: 8,
    title: "스택에서 검증하기 (충돌 실험)",
    layer: "quark",
    durationSeconds: 15, // VO 12.24s (trimmed to "데이터가 쌓이고 연산자가 실행된다") + 2.8s room
    keyframePrompt:
      'Scientific visualization, extreme macro: a tall vertical transparent stack-tube shaped from glowing violet energy (NOT lab glassware) floating in deep space — no laboratory, no benches, no monitors, no furniture; resting at the bottom of the tube, exactly two violet-magenta subatomic quark-like particles, well apart from each other with clear dark space between them — the lower one labeled "Signature", the one above it labeled "Public Key"; every label in this frame is set in modest, sharp, understated type — small and quiet, never large or shouty — and the labels alternate sides as they climb, one to the left of the tube, the next to the right, the next left again, each sitting close beside the step it names on its own side, so the wide empty space on both sides of the tube is used and the eye reads them in a zigzag rather than as one long list stacked down a single edge; the five script steps run up the tube in this order from bottom to top, each labeled with exactly one of these spellings — these exact five strings and no other opcode names — and each drawn as a visibly different operation so the shape itself shows what the step does: "OP_DUP", where one particle splits into two identical twins side by side; "OP_HASH160", where one of those twins passes through a bright compression ring and comes out transformed into a dense angular fragment of a different shape; "<PubKeyHash>", a second identical angular fragment dropping in from the side to meet it; "OP_EQUALVERIFY", where those two angular fragments slot together like matching halves and flash green at the seam; "OP_CHECKSIG", where the surviving signature particle and public-key particle swing into alignment facing each other and a bright green verification pulse passes between them, confirming the match rather than merging them; a single green "TRUE" particle glowing at the top; behind everything a sparse deep teal and blue nebula so the violet stack reads clearly; dense starfield, dark near-field, volumetric glow, cinematic, ultra detailed, legible small text labels; no planet surface, no landscape, no people',
    motionPrompt:
      "The camera is locked and static; the vertical stack-tube and every element in it hold their exact positions the whole time (labels are added in post and need stable positions). 0–2s: opens exactly on the still frame it starts from — the tall violet stack-tube with its distinct operation shapes stacked bottom to top (two proof particles at the bottom, then the twin-split, the compression ring, the angular fragment, the two fragments meeting, the merge) and a dim green particle waiting at the very top. 2–11s: a bright pulse of light travels slowly UP the stack, lighting each operation in turn as it reaches it — the twins split apart, the ring compresses, the two angular fragments slot together and flash green at the seam, and so on up the tube, one step at a time in sequence. 11–13s: the pulse reaches the top and the green TRUE particle ignites bright and steady. 13–15s: everything holds still, the green TRUE glowing at the top of the settled stack, a calm final beat. Scientific visualization, glowing violet energy, sparse deep teal-and-blue nebula behind; no text, no numbers, no labels of any kind, no planet, no people.",
    camera: ["Static"],
    models: { primary: "Seedance 2.0", alt: "Seedance 2.0 Mini" },
    narration:
      "스크립트는 선언문이 아니라 실행 순서다. 데이터가 쌓이고 연산자가 실행된다. 최종 결과가 참이어야 이전 출력을 소비할 수 있다.",
    status: "keyframe",
  },
  {
    id: 9,
    title: "돈의 조건과 임의 데이터 (경계)",
    layer: "quark",
    durationSeconds: 15, // narration ~27s > 15s model cap → split into 9a/9b at generation (see guide §8)
    // Keep the plain list. v2 tried "each labeled once and no label repeated anywhere in frame" and
    // the negation backfired: it duplicated OP_RETURN and witness AND dropped scriptSig and coinbase
    // input. v1's plain list renders all six (scriptPubKey doubles — accepted). See credit-log.md.
    keyframePrompt:
      'Scientific visualization: camera pulled back to reveal one whole glowing cyan transaction atom filling the centre of the frame — a bright luminous nucleus wrapped in concentric orbital shells with orbiting electrons, the same ornate atom language as the earlier scenes, an organic thing made of light rather than an exploded diagram of flat floating cards or panels; six curved luminous data surfaces lie on its own shells like glowing facets; from each facet a thin straight leader line runs outward into the clear dark space around the atom and ends at its own label, and every label is set flat and horizontal and upright like printed type on a technical plate, level with the bottom of the frame, large enough to read at a glance — the six labels, one per facet, spread evenly around the atom so none crowds another: "scriptPubKey", "OP_RETURN", "scriptSig", "witness", "Taproot script path", "coinbase input"; data particles drift toward each glowing facet; a single vast translucent measuring grid descends through the whole frame and wraps over the atom, its top edge carrying one horizontal label reading "BIP110"; far behind in the deep background, the vast web of faint violet dark-matter-like filaments studded with glowing nodes is visible again — the validator network this atom belongs to; a sparse deep teal and blue nebula; dense starfield, dark near-field, volumetric glow, cinematic, ultra detailed, legible small text labels; no physical room or lab, no planet surface, no landscape, no people',
    motionPrompt:
      "0–6s: camera pulls back from the stack to reveal the whole transaction atom and its many data surfaces (scriptPubKey, OP_RETURN, scriptSig, witness, Taproot path, coinbase input). 6–11s: data particles approach each surface — some become spend conditions, some sit inert, some hide inside witness/script paths. 11–15s: a translucent BIP110 measuring grid descends, checking size and format (not meaning) of each surface; far behind, the cosmic web of validator nodes comes into view.",
    camera: ["Super Dolly Out"],
    models: { primary: "Seedance 2.0", alt: "Seedance 2.0 Mini" },
    narration:
      "가장 작은 층으로 내려오면 논쟁의 본질이 나타난다. 같은 바이트라도 어떤 것은 소유권을 증명하고, 어떤 것은 지불 조건을 만들며, 어떤 것은 임의의 정보를 운반한다. 따라서 BIP110의 질문은 단순히 'OP_RETURN을 허용할 것인가'가 아니다. 트랜잭션의 여러 데이터 표면에 대해 합의 규칙이 어디까지 크기와 형식을 제한할 것인가의 문제다.",
    status: "keyframe",
  },
];
