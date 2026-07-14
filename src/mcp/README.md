# MCP generation path (agent-driven) — active path

Generation runs through the **Higgsfield MCP** (`https://mcp.higgsfield.ai/mcp`, OAuth). This path
is **driven by the agent (Claude) in-session — there is no CLI generation script** (a read-only
`pnpm models` report over the catalog does exist). Claude reads a scene's
prompt from [`../core/scenes.ts`](../core/scenes.ts) and calls the MCP `generate_*` tools with the
model id from [`model-map.ts`](./model-map.ts).

## Auth & credits
- Connect once: `/mcp` → **higgsfield** → **Authenticate** (OAuth). The project `.mcp.json` server is
  pre-approved via `.claude/settings.local.json` (`enabledMcpjsonServers`).
- Uses your **Higgsfield account/subscription credits** — separate from the API path. Free ≈ 10
  credits/day, watermarked outputs. Check with the `balance` tool.
- **Free = max 1 concurrent job** — batches must run serially (submit → poll → next). Each free-queue
  image takes ~60–90s.

## Generation flow (what Claude does)
1. Read the scene's prompt from `core/scenes.ts`.
2. `models_explore(action:"get", model_id)` for aspect ratios/params (or use `model-map.ts`).
3. `generate_image` / `generate_video` — preflight with `get_cost: true` first.
4. Poll `job_status(jobId, sync:true)` until `completed`.
5. Download the result to `keyframes/sceneNN/<timestamp>.png` (or `outputs/`) — **never overwrite**.

## Aspect ratio
No 2.35:1 preset anywhere — use each model's **native** ratio (see `model-map.ts`). Widest available
is **21:9** (Soul Cinema, Nano Banana Pro, Seedance 2.0, Cinema Studio); Soul 2.0 / Kling / Veo cap
at 16:9.

## Useful MCP tools
- **Generate:** `generate_image`, `generate_video`, `generate_audio`, `generate_3d`
- **Inspect:** `models_explore`, `job_status`, `balance`, `show_plans_and_credits`, `show_generations`
- **Edit:** `upscale_image` / `upscale_video`, `outpaint_image`, `reframe`, `remove_background`, `motion_control`
- **Media:** `media_upload`, `media_import_url`
- **Workflows:** `get_workflow_instructions` (catalog includes an `explainer_video` workflow — directly relevant to this project)

## Models & costs (snapshot 2026-07-15)

Full data + native aspect ratios live in [`model-map.ts`](./model-map.ts); print it with `pnpm models`.
Costs are MCP `get_cost` snapshots (re-check before a real run). Aspect ratio does **not** affect cost.

**Keyframes (image):**

| model | cost | note |
|---|---|---|
| `nano_banana_pro` ⭐ | 1k/2k = 2cr · 4k = 4cr | best detail + text/diagrams, 21:9 — project default |
| `soul_cinematic` | ~0.12cr (1.5k/2k) | filmic mood, 21:9; sparse on dense particle fields |
| `soul_2` | ~0.12cr | UGC/portrait, 16:9 max; weak on abstract/text |

**Video (per clip):**

| model | cost | duration | note |
|---|---|---|---|
| `kling3_0` | 7.5cr (5s, silent) | 3–15s | cheapest video |
| `veo3_1` | 22cr (8s, basic) | 4/6/8s (max 8) | top-tier; under the scenes' 15s |
| `seedance_2_0` | 22.5cr (720p/5s) → 45cr (1080p) | 4–15s | our primary; 21:9 |
| `cinematic_studio_3_0` | 25cr (720p/5s) | 4–15s | Cinema Studio; also the `DoP` substitute |

**Camera moves are prompt-driven** — video models take `prompt + start_image` only (no camera-preset
param), and `presets_show` returns viral/character templates, not the app's Camera Controls. So weave a
scene's `camera` (CameraPreset) into the motion-prompt text. Use Seedance / Kling / Cinema for 15s
clips (Veo caps at 8s).

> 9 scenes × video is expensive relative to Free (~10 credits). Video needs a credit top-up /
> upgrade / trial. Keyframes are cheap (≤ 2cr each).
