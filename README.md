# Higgsfield — Quantum Bitcoin Elements

Working environment for producing the 9-scene "Quantum Bitcoin Elements" explainer
(one continuous zoom: blockchain → block → transaction → input/output → script → opcode·byte)
with **Higgsfield**, driven by Claude through the **Higgsfield MCP** server.

## Prerequisites

- Node ≥ 20, pnpm
- A Higgsfield account (for MCP OAuth login)

## Setup

```bash
pnpm install
```

### Higgsfield MCP (already registered, project scope)

The MCP server is registered in [`.mcp.json`](./.mcp.json) at **project scope**, so it
travels with this repo. Endpoint: `https://mcp.higgsfield.ai/mcp` (OAuth — no API key).

> Note: `higgsfield.ai/mcp` is only the marketing page; the actual MCP server lives at
> the `mcp.` subdomain above.

**One-time authentication (you must do this yourself — it opens a browser):**

1. In Claude Code, run `/mcp`
2. Select **higgsfield → Authenticate**
3. Log in with your Higgsfield account (scopes: `openid email offline_access`)

After that, Claude can call Higgsfield tools (image/video generation, Soul, upscaling, etc.)
directly from this session.

## Scripts

| Command | What it does |
|---|---|
| `pnpm typecheck` | Type-check the project (`tsc --noEmit`) |
| `pnpm export:prompts` | Regenerate `prompts/sceneNN.md` from the scenes SSOT |
| `pnpm shot-list` | Print the per-scene status table |
| `pnpm plan:report` | Plan tiers + the minimum Higgsfield plan each model/scene needs |

## Layout

```
.mcp.json          Higgsfield MCP (project scope)
docs/              production guide + original scenario (local only — git-ignored)
src/
  core/            shared, path-agnostic
    types.ts       Scene / camera / model types
    scenes.ts      the 9 scenes as typed data (SSOT) + palette/format
    models.ts      plan tiers + per-model minimum-plan reference
    scripts/       export-prompts.ts, shot-list.ts, plan-report.ts
  mcp/             MCP path (active) — model-map.ts + README.md  (agent-driven, no CLI)
  api/             API path (alt)   — scripts/{check-auth,generate-keyframe}.ts + README.md
prompts/           generated per-scene prompt files (tracked)
keyframes/         stills, per scene: keyframes/sceneNN/  (git-ignored — large binaries)
outputs/           rendered video clips (git-ignored — large binaries)
```

## Two generation paths

Two independent ways to drive Higgsfield — see each folder's README:

- **[MCP](./src/mcp/README.md) — active, agent-driven.** Claude calls the MCP `generate_*` tools
  in-session (no CLI). Uses your Higgsfield **subscription/account credits**.
- **[API](./src/api/README.md) — alternative, scriptable.** `pnpm generate:keyframe` via the
  `@higgsfield/client` SDK. Uses a **separate platform API credit balance** (`.env` keys).

Both read prompts from the shared SSOT, [`src/core/scenes.ts`](./src/core/scenes.ts).

## Plans & minimum tier

Model access is gated by Higgsfield subscription tier (credit-based). Snapshot **as of
2026-07-15** — plans/prices drift, so verify on the [pricing page](https://higgsfield.ai/pricing)
and by the in-app lock icons. Encoded in [`src/core/models.ts`](./src/core/models.ts); run `pnpm plan:report`.

| Plan | ~Price | Credits | Notes |
|---|---|---|---|
| Free | $0 | ~10/day | watermark, selected models, **no Veo** |
| Starter | $15/mo | 200/mo | selected models; Seedance 2.0 **Fast** only |
| Plus | $39/mo | 1,000/mo | **all models** — full Seedance 2.0 + Veo 3.1 |
| Ultra | $99/mo | 3,000/mo | high volume; unlimited Kling (annual) |

Minimum plan per model used in this project:

| Model | Min plan | Note |
|---|---|---|
| Soul 2.0 (keyframes) | Starter | unlimited on Starter+ |
| Cinema Studio | Starter | bundled with Soul/Cinema unlimited |
| DoP | Starter | Lite runs on free credits; Standard/Turbo paid |
| Kling 3.0 | Starter | selected models on Starter |
| Seedance 2.0 (full) | **Plus** | Starter has only Seedance 2.0 *Fast* |
| Veo 3.1 | **Plus** | not on Free; premium credit cost |

**Bottom line:** the recommended pipeline (full Seedance 2.0 as the main model, Veo 3.1 as an
alt) needs **Plus ($39/mo annual)**. Starter covers only a cheaper proof cut (Soul keyframes +
Kling / Cinema Studio / DoP Lite + Seedance *Fast*).

## Workflow

1. Edit prompts/camera/models/status in **`src/core/scenes.ts`** (single source of truth).
2. `pnpm export:prompts` → refreshes `prompts/`.
3. Ask Claude to generate via the Higgsfield MCP: a Soul keyframe per scene → save under
   `keyframes/` → image-to-video with the scene's model → save under `outputs/`.
4. Update each scene's `status` as it progresses (`todo → keyframe → video → done`);
   track with `pnpm shot-list`.

See `docs/higgsfield-production-guide.md` (kept locally, not committed to the repo) for the
full production plan (palette, camera mapping, per-scene notes, model A/B protocol).
