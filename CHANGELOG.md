# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Commit type → section: `feat` → **Added**, `fix` → **Fixed**, `refactor` → **Changed**.
`docs` / `chore` are folded into the relevant section only when notable.

## [Unreleased]

_Next up: the video stage — generate the 9 scene videos via the Higgsfield MCP once
credits are topped up (keyframes → `generate_video`, camera woven into the motion
prompt). See `src/mcp/model-map.ts` and `pnpm models`._

## [0.1.0] - 2026-07-15

Keyframes-complete milestone: the working environment, model research, and all 9
scene keyframes are done. Video generation is not yet started (blocked on credits).

### Added

- Higgsfield MCP working environment at project scope (`.mcp.json`), pre-approved
  via `.claude/settings.local.json`.
- `src/{core,mcp,api}` structure with per-path docs — MCP (active, agent-driven) vs
  API (alternative, scriptable) generation paths kept separate.
- 9-scene "Quantum Bitcoin Elements" single source of truth (`src/core/scenes.ts`):
  prompts, motion, camera, models, and narration for the continuous molecule→atom→quark zoom.
- Authoritative MCP model reference (`src/mcp/model-map.ts`): real model ids, native
  aspect ratios, measured credit costs, and video durations — printable with `pnpm models`.
- Per-model minimum subscription-plan reference (`src/core/models.ts`), printable with
  `pnpm plan:report`.
- API-path scripts: `check:auth` (verify Higgsfield API credentials) and
  `generate:keyframe` (Soul keyframe via the REST API).
- `.env.example` template using `HF_API_KEY` + `HF_API_SECRET`.
- All 9 scene keyframes generated with `soul_cinematic` (21:9), saved under
  `keyframes/sceneNN/` as versioned files; `scenes.ts` status set to `keyframe`.

### Changed

- Use each model's native aspect ratio instead of forcing 2.35:1 with cropping.
- Split the monolithic `src` into `core` / `mcp` / `api` with dedicated READMEs.
- `.env` uses two variables — `HF_API_KEY` (key id) and `HF_API_SECRET` (key secret) —
  matching Higgsfield's credential pair.
- Documented that MCP video camera moves are prompt-driven (no camera-preset param) and
  recorded measured model costs and durations in `model-map.ts`.

### Fixed

- Scene 1 keyframe now renders Bitcoin (₿ token), not an Ethereum-like gem.
- Keyframes are saved as versioned per-scene files and never overwritten.

[Unreleased]: https://github.com/kyle-park-io/higgsfield/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/kyle-park-io/higgsfield/releases/tag/v0.1.0
