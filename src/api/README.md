# API generation path (scriptable) — alternative path

A **script-driven** path using the Higgsfield **REST API** (`https://platform.higgsfield.ai`) via the
[`@higgsfield/client`](https://www.npmjs.com/package/@higgsfield/client) SDK. Use this when you want
reproducible / batch generation **without an agent in the loop**.

> **Billing is separate from the MCP/subscription:** it draws on your **platform API credit balance**
> (top up at `cloud.higgsfield.ai`). At last check that balance was empty, so the [MCP path](../mcp/README.md)
> is the active one — this path is kept as a maintained alternative.

## Setup
- Put credentials in `.env` (git-ignored): `HF_API_KEY`, `HF_API_SECRET`
  (from `cloud.higgsfield.ai/api-keys`). Template: [`.env.example`](../../.env.example).
- Auth scheme: `Authorization: Key <KEY_ID>:<KEY_SECRET>`.

## Scripts
| Command | What it does |
|---|---|
| `pnpm check:auth` | Verify credentials (read-only, no credits) — `GET /v1/motions` |
| `pnpm generate:keyframe [sceneId]` | Soul keyframe via `POST /v1/text2image/soul` (defaults to scene 1) |

Outputs save to `keyframes/sceneNN/<timestamp>.png` — **never overwritten**. Prompts come from the
shared SSOT, [`../core/scenes.ts`](../core/scenes.ts).
