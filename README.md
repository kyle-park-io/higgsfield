# Higgsfield — Cutscenes Monorepo

Working environment for producing Higgsfield cutscene projects, driven by Claude through the
**Higgsfield MCP** server. **Shared tooling** lives in `src/`; each production is an
**independent project** under `projects/<name>/` (its own `scenes.ts` SSOT + prompts + media),
selected with the `--project <name>` flag (default: `quantum-bitcoin-elements`).

**Projects**

- **`quantum-bitcoin-elements`** (default) — the 9-scene explainer as one continuous zoom
  (blockchain → block → transaction → input/output → script → opcode·byte).
- **`quantum-entanglement`** — same 9-scene guide & format (21:9), re-based on a new reference
  video (`projects/quantum-entanglement/references/…mp4`) as its visual base.

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

All scene-aware scripts take `--project <name>` (or `-p`, or `HF_PROJECT=<name>`); omit it to use
the default project. Pass it after `--`, e.g. `pnpm shot-list -- --project quantum-entanglement`.

| Command | What it does |
|---|---|
| `pnpm typecheck` | Type-check the whole monorepo (`tsc --noEmit`) |
| `pnpm export:prompts` | Regenerate the selected project's `prompts/sceneNN.md` from its `scenes.ts` |
| `pnpm shot-list` | Print the selected project's per-scene status table |
| `pnpm plan:report` | Plan tiers + the minimum Higgsfield plan each model/scene needs |
| `pnpm models` | Full Higgsfield model catalog with measured credit costs (project-agnostic) |

## Layout

```
.mcp.json          Higgsfield MCP (project scope)
src/               SHARED tooling (project-agnostic), selected via --project
  core/
    types.ts       Scene / camera / model types
    models.ts      plan tiers + per-model minimum-plan reference
    registry.ts    the list of projects (add a project here)
    project.ts     --project resolver + loader (name, dir, scenes, production)
    scripts/       export-prompts.ts, shot-list.ts, plan-report.ts
  mcp/             MCP path (active) — model-map.ts + catalog.ts + README.md  (agent-driven, no CLI)
  api/             API path (alt)   — scripts/{check-auth,generate-keyframe}.ts + README.md
projects/          one independent project per folder
  quantum-bitcoin-elements/
    scenes.ts      this project's 9 scenes as typed data (SSOT) + palette/format
    prompts/       generated per-scene prompt files (tracked)
    docs/          production guide + original scenario (local only — git-ignored)
    credit-log.md  per-asset credit spend log (local only — git-ignored)
    keyframes/     stills, per scene: keyframes/sceneNN/  (git-ignored — large binaries)
    outputs/       rendered video clips + audio/ (git-ignored — large binaries)
  quantum-entanglement/
    scenes.ts · prompts/ · docs/ · keyframes/ · outputs/
    references/    the reference video(s) this project is based on (git-ignored)
```

## Two generation paths

Two independent ways to drive Higgsfield — see each folder's README:

- **[MCP](./src/mcp/README.md) — active, agent-driven.** Claude calls the MCP `generate_*` tools
  in-session (no CLI). Uses your Higgsfield **subscription/account credits**.
- **[API](./src/api/README.md) — alternative, scriptable.** `pnpm generate:keyframe` via the
  `@higgsfield/client` SDK. Uses a **separate platform API credit balance** (`.env` keys).

Both read prompts from the selected project's SSOT, `projects/<name>/scenes.ts`.

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

Pick the project with `--project <name>` (default `quantum-bitcoin-elements`), then:

1. Edit prompts/camera/models/status in **`projects/<name>/scenes.ts`** (that project's SSOT).
2. `pnpm export:prompts -- --project <name>` → refreshes `projects/<name>/prompts/`.
3. Ask Claude to generate via the Higgsfield MCP: a keyframe per scene → save under
   `projects/<name>/keyframes/` → image-to-video with the scene's model → save under
   `projects/<name>/outputs/`.
4. Update each scene's `status` as it progresses (`todo → keyframe → video → done`);
   track with `pnpm shot-list -- --project <name>`.

To **add a project**: create `projects/<name>/scenes.ts` and register it in
[`src/core/registry.ts`](./src/core/registry.ts).

See `projects/<name>/docs/guide.md` (kept locally, not committed) for the full production plan
(palette, camera mapping, per-scene notes, model A/B protocol).
