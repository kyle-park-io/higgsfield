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

## Layout

```
.mcp.json          Higgsfield MCP (project scope)
docs/              production guide + original scenario (local only — git-ignored)
src/
  types.ts         Scene / camera / model types
  scenes.ts        the 9 scenes as typed data (SSOT) + fixed palette/format
  scripts/         export-prompts.ts, shot-list.ts
prompts/           generated per-scene prompt files (tracked)
keyframes/         Soul stills (git-ignored — large binaries)
outputs/           rendered video clips (git-ignored — large binaries)
```

## Workflow

1. Edit prompts/camera/models/status in **`src/scenes.ts`** (single source of truth).
2. `pnpm export:prompts` → refreshes `prompts/`.
3. Ask Claude to generate via the Higgsfield MCP: a Soul keyframe per scene → save under
   `keyframes/` → image-to-video with the scene's model → save under `outputs/`.
4. Update each scene's `status` as it progresses (`todo → keyframe → video → done`);
   track with `pnpm shot-list`.

See `docs/higgsfield-production-guide.md` (kept locally, not committed to the repo) for the
full production plan (palette, camera mapping, per-scene notes, model A/B protocol).
