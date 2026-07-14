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
 */
export const CATALOG_AS_OF = "2026-07-15";

export interface ModelInfo {
  /** Real MCP model_id for `models_explore` / `generate_*` (null = no direct equivalent). */
  mcpModelId: string | null;
  /** Native aspect ratios the model supports. */
  aspects: string[];
  /** Measured credit cost (MCP `get_cost`) keyed by a tier label (e.g. "2k", "720p/5s"). */
  cost: Record<string, number>;
  note: string;
}

/* ── Keyframe (image) models ─────────────────────────────────────────────── */

export const keyframeModels: Record<string, ModelInfo> = {
  nano_banana_pro: {
    mcpModelId: "nano_banana_pro",
    aspects: ["1:1", "3:2", "2:3", "4:3", "3:4", "4:5", "5:4", "9:16", "16:9", "21:9"],
    cost: { "1k": 2, "2k": 2, "4k": 4 },
    note: "⭐ best overall here — detail + text/diagrams, 21:9. Best Scene 1 result. 1k=2k=2cr (use 2k); 4k=4cr.",
  },
  soul_cinematic: {
    mcpModelId: "soul_cinematic",
    aspects: ["1:1", "4:3", "3:4", "16:9", "9:16", "3:2", "2:3", "21:9"],
    cost: { "1.5k": 0.12, "2k": 0.12 },
    note: "Soul Cinema — cinema stills/concept art, 21:9. Filmic mood; sparse on dense particle fields. ~free.",
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
  default: "nano_banana_pro", // best for this project's content (abstract + labeled scenes)
  mood: "soul_cinematic", // pure establishing / atmosphere shots
  cheap: "soul_2", // ~free when quality doesn't matter
} as const;

/* ── Video models ────────────────────────────────────────────────────────── */
/** `scenes[].models` (VideoModel) → MCP video model. Costs are per single clip. */

export const videoModelMap: Record<VideoModel, ModelInfo> = {
  "Seedance 2.0": {
    mcpModelId: "seedance_2_0",
    aspects: ["auto", "16:9", "9:16", "4:3", "3:4", "1:1", "21:9"],
    cost: { "720p/5s": 22.5, "1080p/5s": 45 }, // silent, mode std; 720p→1080p doubles
    note: "start/end image + image/video/audio refs, 4-15s, up to 4k. Our primary.",
  },
  "Kling 3.0": {
    mcpModelId: "kling3_0",
    aspects: ["16:9", "9:16", "1:1"],
    cost: { "5s/std/silent": 7.5 }, // cheapest video option
    note: "multi-shot, motion transfer, 3-15s. Cheapest video. Audio ('sound:on') adds cost.",
  },
  "Veo 3.1": {
    mcpModelId: "veo3_1",
    aspects: ["16:9", "9:16"],
    cost: { "8s/basic/fast": 22 },
    note: "top-tier cinematic, 4/6/8s. quality basic/high/ultra raises cost.",
  },
  "Cinema Studio": {
    mcpModelId: "cinematic_studio_3_0",
    aspects: ["auto", "21:9", "16:9", "4:3", "1:1", "3:4", "9:16"],
    cost: { "720p/5s": 25 },
    note: "cinema-grade video, genre hints, up to 4k.",
  },
  DoP: {
    mcpModelId: null,
    aspects: ["21:9", "16:9"],
    cost: {},
    note: "no direct MCP model — substitute Cinema Studio (cinematic_studio_3_0), the camera-aware model.",
  },
};
