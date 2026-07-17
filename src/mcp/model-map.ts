import type { VideoModel } from "../core/types.ts";

/**
 * Authoritative Higgsfield **MCP** reference for this project: scene model names →
 * real MCP model ids, native aspect ratios, and measured credit costs.
 *
 * Sources (all via the MCP, on the date below):
 *   • catalog — `models_explore(action:"list", type:"image"|"video")`
 *   • costs   — `generate_image` / `generate_video` with `get_cost:true` (no credits spent)
 *
 * Costs are agent-queried (MCP tools can't run from a standalone script), so they are
 * snapshotted here. Run `pnpm models` to print this, and re-check with `get_cost`
 * before a real run. We always use each model's **native** aspect ratio — never crop.
 *
 * This file is the CURATED subset the scenes actually use. For the COMPLETE Higgsfield
 * roster (every image + video model) with measured costs, see ./catalog.ts.
 */
export const CATALOG_AS_OF = "2026-07-15";

export interface ModelInfo {
  /** Real MCP model_id for `models_explore` / `generate_*` (null = no direct equivalent). */
  mcpModelId: string | null;
  /** Native aspect ratios the model supports. */
  aspects: string[];
  /** Measured credit cost (MCP `get_cost`) keyed by a tier label (e.g. "2k", "720p/5s"). */
  cost: Record<string, number>;
  /** Duration options/range for video models (omitted for images). */
  durations?: string;
  note: string;
}

/* ── Keyframe (image) models ─────────────────────────────────────────────── */

export const keyframeModels: Record<string, ModelInfo> = {
  nano_banana_2: {
    mcpModelId: "nano_banana_2",
    aspects: ["1:1", "3:2", "2:3", "4:3", "3:4", "4:5", "5:4", "9:16", "16:9", "21:9"],
    cost: { "1k": 2, "2k": 2, "4k": 4 },
    note: "⭐ keyframe REQUEST id — used for scenes 2–9 (excellent detail + legible ₿/labels at 21:9). NB: the response `model` echoes Higgsfield's backend ENGINE, not the requested id — requesting this ran engine `nano_banana_flash`. Mapping is opaque (not a simple alias). 1k=2k=2cr; 4k=4cr.",
  },
  nano_banana_pro: {
    mcpModelId: "nano_banana_pro",
    aspects: ["1:1", "3:2", "2:3", "4:3", "3:4", "4:5", "5:4", "9:16", "16:9", "21:9"],
    cost: { "1k": 2, "2k": 2, "4k": 4 },
    note: "Requesting this ran engine `nano_banana_2` (Scene 1 keeper). The echoed `model` is a backend engine name ≠ the requested id; the mapping is opaque. 1k=2k=2cr; 4k=4cr.",
  },
  soul_cinematic: {
    mcpModelId: "soul_cinematic",
    aspects: ["1:1", "4:3", "3:4", "16:9", "9:16", "3:2", "2:3", "21:9"],
    cost: { "1.5k": 0.12, "2k": 0.12 },
    note: "Soul Cinema — cinema stills/concept art, 21:9. Filmic; renders short text labels legibly (unlike soul_2). Sparse on dense many-particle scenes (Scene 1). ~free. Used for the 1st keyframe pass (superseded by nano_banana_2).",
  },
  soul_2: {
    mcpModelId: "soul_2",
    aspects: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"],
    cost: { "1.5k": 0.12, "2k": 0.12 },
    note: "Soul 2.0 — UGC/portrait/fashion, 16:9 max; weak on abstract & text. Legacy default. ~free.",
  },
};

/** Recommended keyframe model per use. */
export const keyframeChoice = {
  default: "nano_banana_2", // nano_banana_pro aliases to this via MCP; best for abstract + labeled scenes
  mood: "soul_cinematic", // pure establishing / atmosphere shots
  cheap: "soul_2", // ~free when quality doesn't matter
} as const;

/* ── Video models ────────────────────────────────────────────────────────── */

/**
 * How camera moves work in the MCP video path — **prompt-driven**.
 * The video models take `prompt + start_image` only; there is NO camera-preset param,
 * and `presets_show` returns viral/character templates (BASEBALL GAME, KUNG FU HIT, …),
 * NOT the app's Camera Controls (Dolly In / Crash Zoom / …). So a scene's `camera`
 * (CameraPreset[]) must be woven into the motion-prompt TEXT when generating
 * (e.g. prepend "slow dolly in, " / "crash zoom into the surface, ").
 * Duration limits matter: scenes assume ~15s but Veo 3.1 caps at 8s — use
 * Seedance / Kling / Cinema Studio for the full 15s clips.
 */
export const CAMERA_IN_MCP_VIDEO =
  "prompt-driven — no camera-preset param; describe scene.camera in the motion prompt";

/**
 * `scenes[].models` (VideoModel) → MCP video model.
 *
 * **Aspect ratio disqualifies before quality does.** Only four generators render **21:9**:
 * `seedance_2_0`, `seedance_2_0_mini`, `cinematic_studio_3_0`, `seedance1_5`
 * (plus `marketing_studio_video`, which is ad-specific). Everything else — the whole Kling
 * family, every Veo, Wan, Grok, Hailuo — tops out at 16:9. A 21:9 project can only use those four.
 *
 * **Video cost is linear in duration.** Measured on 2026-07-17 via `get_cost` at 21:9 / 720p /
 * silent, so each entry below records a **credits-per-second** rate; multiply by the clip length.
 * A 5s quote tells you nothing about a 15s clip except by this rate.
 *
 * **Beware near-identical ids.** `cinematic_studio_3_0` (Cinema Studio Video 3.0) does 21:9 at
 * 4–15s. `cinematic_studio_video` and `cinematic_studio_video_v2` are *different, older* models
 * that do NOT do 21:9 and are capped at 5/10s and 3–12s. Query the exact id.
 */
export const videoModelMap: Record<VideoModel, ModelInfo> = {
  "Seedance 2.0": {
    mcpModelId: "seedance_2_0",
    aspects: ["auto", "16:9", "9:16", "4:3", "3:4", "1:1", "21:9"],
    // 21:9/720p/std/silent measured: 5s=22.5, 12s=54, 15s=67.5 → exactly 4.5 cr/s.
    // mode 'fast' = 3.5 cr/s (52.5 @15s). 1080p/std = 9.0 cr/s (135 @15s).
    cost: { "720p/s": 4.5, "720p-fast/s": 3.5, "1080p/s": 9 },
    durations: "4–15s",
    note: "start/end image + image/video/audio refs, up to 4k. Our primary.",
  },
  "Seedance 2.0 Mini": {
    mcpModelId: "seedance_2_0_mini",
    aspects: ["auto", "16:9", "9:16", "4:3", "3:4", "1:1", "21:9"],
    // 21:9/720p/silent measured: 12s=30, 15s=37.5 → 2.5 cr/s. 480p/720p only (no 1080p/4k).
    cost: { "720p/s": 2.5 },
    durations: "4–15s",
    note: "budget Seedance 2.0 — same 21:9, start/end image and refs, at 2.5 cr/s. Proof clip b33a7b16.",
  },
  "Cinema Studio": {
    mcpModelId: "cinematic_studio_3_0",
    aspects: ["auto", "21:9", "16:9", "4:3", "1:1", "3:4", "9:16"],
    // 21:9/720p/silent measured: 12s=60 → 5.0 cr/s. Dearer than Seedance 2.0 std.
    cost: { "720p/s": 5 },
    durations: "4–15s",
    note: "cinema-grade, genre hints, start/end image, up to 4k. The only non-Seedance 21:9 generator.",
  },
  "Kling 3.0": {
    mcpModelId: "kling3_0",
    aspects: ["16:9", "9:16", "1:1"],
    cost: { "5s/std/silent": 7.5 },
    durations: "3–15s",
    note: "UNUSABLE at 21:9 — 16:9 is its ceiling. Multi-shot, motion transfer, audio adds cost.",
  },
  "Veo 3.1": {
    mcpModelId: "veo3_1",
    aspects: ["16:9", "9:16"],
    cost: { "8s/basic/fast": 22 },
    durations: "4/6/8s",
    note: "UNUSABLE at 21:9, and caps at 8s — under most scene lengths.",
  },
  DoP: {
    mcpModelId: null,
    aspects: ["21:9", "16:9"],
    cost: {},
    note: "deprecated — no direct MCP model. Substitute Cinema Studio (cinematic_studio_3_0).",
  },
};

/**
 * 21:9-capable generators not in `VideoModel`, kept here so the cheap option is not forgotten.
 *
 * `seedance1_5` (Seedance 1.5 Pro) is by far the cheapest 21:9 video: **1.2 cr/s**
 * (12s @ 21:9/720p/silent = 14.39 cr) — half of Mini, a quarter of Seedance 2.0 std.
 * Its catch is duration: **only 4, 8 or 12 seconds**, so it cannot serve a 13s or 15s scene.
 * Reach for it whenever a shot fits in 12s.
 */
export const cheap21x9Alternative = {
  mcpModelId: "seedance1_5",
  crPerSecond: 1.2,
  durations: [4, 8, 12],
  aspects: ["auto", "16:9", "9:16", "4:3", "3:4", "1:1", "21:9"],
  medias: ["start_image", "end_image"],
} as const;
