# MCP generation path (agent-driven) — active path

Generation runs through the **Higgsfield MCP** (`https://mcp.higgsfield.ai/mcp`, OAuth). This path
is **driven by the agent (Claude) in-session — there is no CLI script.** Claude reads a scene's
prompt from [`../core/scenes.ts`](../core/scenes.ts) and calls the MCP `generate_*` tools with the
model id from [`model-map.ts`](./model-map.ts).

## Auth & credits
- Connect once: `/mcp` → **higgsfield** → **Authenticate** (OAuth). The project `.mcp.json` server is
  pre-approved via `.claude/settings.local.json` (`enabledMcpjsonServers`).
- Uses your **Higgsfield account/subscription credits** — separate from the API path. Free ≈ 10
  credits/day, watermarked outputs. Check with the `balance` tool.

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

See [`model-map.ts`](./model-map.ts) for the scene-model → MCP-model-id mapping.
