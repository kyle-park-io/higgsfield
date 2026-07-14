import type { VideoModel } from "../core/types.ts";

/**
 * Bridge from this project's model names (used in `core/scenes.ts`) to the real
 * Higgsfield **MCP** model ids, with native aspect ratios and notes.
 *
 * Source: `models_explore(action:"list")` on 2026-07-15.
 * The MCP path is agent-driven: Claude reads a scene's prompt from `core/scenes.ts`
 * and calls the MCP `generate_image` / `generate_video` tools with the mapped id below.
 * There is no executable script here (MCP tools are invoked by the agent, not a CLI).
 */

export interface McpModel {
  /** Real MCP model_id for `models_explore` / `generate_*` (null = no direct equivalent). */
  mcpModelId: string | null;
  /** Widest native aspect ratio the model supports — we use native ratios, no cropping. */
  maxAspect: string;
  /** Credit cost from the MCP `get_cost` preflight (agent-queried snapshot — see MODEL_COSTS_AS_OF). */
  approxCredits?: string;
  note: string;
}

/** `scenes[].models` (VideoModel) → MCP video model id. */
export const videoModelMap: Record<VideoModel, McpModel> = {
  "Seedance 2.0": {
    mcpModelId: "seedance_2_0",
    maxAspect: "21:9",
    note: "start/end image + image/video/audio refs, 4-15s, up to 4k",
  },
  "Kling 3.0": {
    mcpModelId: "kling3_0",
    maxAspect: "16:9",
    note: "multi-shot, audio sync, motion transfer, 3-15s",
  },
  "Veo 3.1": {
    mcpModelId: "veo3_1",
    maxAspect: "16:9",
    note: "top-tier cinematic, 4/6/8s, quality basic/high/ultra",
  },
  "Cinema Studio": {
    mcpModelId: "cinematic_studio_3_0",
    maxAspect: "21:9",
    note: "cinema-grade video, genre hints, up to 4k",
  },
  DoP: {
    mcpModelId: null,
    maxAspect: "21:9",
    note: "no direct MCP model — use Cinema Studio (cinematic_studio_3_0) as the camera-aware substitute",
  },
};

/** Date the `approxCredits` below were measured via the MCP `get_cost` preflight. */
export const MODEL_COSTS_AS_OF = "2026-07-15";

/**
 * Keyframe (image) model options. `soul_2` is the current default used so far;
 * the alternatives fit this project's content better (recorded for a future switch).
 * `approxCredits` are MCP `get_cost` snapshots for a single 2k image at the model's max aspect.
 * (MCP costs are agent-queried — they can't be fetched from a standalone script — so recorded here.)
 */
export const keyframeModelMap: Record<string, McpModel> = {
  default: {
    mcpModelId: "soul_2",
    maxAspect: "16:9",
    approxCredits: "1 (0.12) @ 2k",
    note: "Soul 2.0 — current default; UGC/portrait, weaker on abstract/text",
  },
  cinematic: {
    mcpModelId: "soul_cinematic",
    maxAspect: "21:9",
    approxCredits: "1 (0.12) @ 2k, 21:9",
    note: "Soul Cinema — cinema stills / concept art; better for abstract sci-viz scenes (1,2,3,5,6); same cost as soul_2",
  },
  diagram: {
    mcpModelId: "nano_banana_pro",
    maxAspect: "21:9",
    approxCredits: "2 @ 2k, 21:9",
    note: "Nano Banana Pro — text/diagram rendering, 4k; better for labeled scenes (4,7,8,9); ~2x cost",
  },
};
