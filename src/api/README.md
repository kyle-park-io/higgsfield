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
| `pnpm generate:keyframe [sceneId]` | Soul keyframe via `POST /v1/text2image/soul` (defaults to scene 1) — **spends credits** |
| `pnpm generate:keyframe:dry [sceneId]` | Dry run — preview the request, spend nothing |

Add `--project <name>` (default `quantum-bitcoin-elements`) to target a project. Outputs save to
`projects/<name>/keyframes/sceneNN/<timestamp>.png` — **never overwritten**. Prompts come from that
project's SSOT, `projects/<name>/scenes.ts`.

## Dry run (`--dry-run` / `-n`)

Since this is the only code that **spends credits**, `generate:keyframe` takes a `--dry-run` flag
(the MCP path has no such script — there, cost is checked in-session via the `get_cost: true`
parameter). Dry run validates the scene and env, then prints the **exact request that would be
sent** — model, size, estimated cost, credential status, save path, and the full prompt — and exits
**without any network call or credit spend**. Use it to confirm the prompt/params are wired right
before a real run:

```
$ pnpm generate:keyframe:dry 1
Scene 1 "흩어진 거래들이 모인다" — DRY RUN (no API call, no credits)
  project: quantum-bitcoin-elements
  path:   REST API (platform.higgsfield.ai)  POST /v1/text2image/soul
  model:  Soul · quality 1080p · size 2048x1152 (16:9 native, no crop) · batch 1
  est:    ≈0.12 cr (approx — MCP Soul snapshot; REST not separately measured)
  creds:  HF_API_KEY ✓   HF_API_SECRET ✓
  save:   projects/quantum-bitcoin-elements/keyframes/scene01/<timestamp>.png  (never overwrites)
  prompt: Abstract dark cosmic void filled with dozens of small glowing…
```

The cost line is an **estimate** from the MCP-measured Soul snapshot (`../mcp/model-map.ts`), not a
live quote — the REST balance is separate and not independently measured.
