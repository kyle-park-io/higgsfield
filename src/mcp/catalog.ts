/**
 * FULL Higgsfield MCP catalog (image + video) with MEASURED credit costs.
 *
 * Sources (all via the MCP, on the date below):
 *   • roster — `models_explore(action:"list", type:"image"|"video")` (both had has_more:false)
 *   • costs  — `generate_image` / `generate_video` with `get_cost:true` (spends NO credits)
 *
 * `cr` is the measured cost at the representative tier named in `cost` — the baseline used to
 * compare models, not the only price (resolution / duration / quality / audio move it). This is
 * the COMPLETE catalog of what the MCP exposes; the curated subset this project actually wires
 * into scenes lives in ./model-map.ts (⭐ marks those here). Re-measure with `get_cost` before a
 * real run — rosters and prices change. Print with `pnpm models`.
 */
export const CATALOG_MEASURED_AS_OF = "2026-07-15";

export type CatalogRole = "generator" | "utility";

export interface CatalogEntry {
  /** Real MCP model_id for `models_explore` / `generate_*`. */
  id: string;
  name: string;
  provider: string;
  role: CatalogRole;
  /** Measured baseline cost in credits; undefined = utility or not benchmarkable via get_cost. */
  cr?: number;
  /** Human label for the tier `cr` was measured at, or why it wasn't measured. */
  cost: string;
  /** Widest / notable native aspect ratios (omitted for utilities). */
  aspects?: string;
  /** Duration options/range — video only. */
  durations?: string;
  note?: string;
}

/* ── IMAGE ────────────────────────────────────────────────────────────────── */

export const imageCatalog: CatalogEntry[] = [
  // Generators
  { id: "nano_banana_pro", name: "Nano Banana Pro", provider: "Google", role: "generator", cr: 2, cost: "2cr (1k/2k; 4k=4)", aspects: "1:1…21:9", note: "⭐ project keyframe default — detail + text/diagrams, 4k" },
  { id: "nano_banana_2", name: "Nano Banana 2", provider: "Google", role: "generator", cr: 2, cost: "2cr (2k)", aspects: "1:1…21:9", note: "next-gen fast, photorealistic" },
  { id: "nano_banana_2_lite", name: "Nano Banana 2 Lite", provider: "Google", role: "generator", cr: 1, cost: "1cr (1k)", aspects: "1:1…21:9", note: "lite next-gen" },
  { id: "nano_banana_2_shots", name: "Nano Banana Pro (shots)", provider: "Google", role: "generator", cr: 4, cost: "4cr", aspects: "1:1…21:9", note: "multi-reference NBP variant" },
  { id: "nano_banana", name: "Nano Banana", provider: "Google", role: "generator", cr: 1, cost: "1cr", aspects: "1:1…21:9", note: "budget realistic" },
  { id: "soul_cinematic", name: "Soul Cinema", provider: "Higgsfield", role: "generator", cr: 0.12, cost: "0.12cr (2k)", aspects: "1:1…21:9", note: "⭐ all 9 keyframes — cinema stills; legible short labels" },
  { id: "soul_2", name: "Soul 2.0", provider: "Higgsfield", role: "generator", cr: 0.12, cost: "0.12cr (2k)", aspects: "16:9 max", note: "UGC/portrait/fashion; weak on abstract & text" },
  { id: "soul_v2", name: "Soul 2.0", provider: "Higgsfield", role: "generator", cr: 0.12, cost: "0.12cr (2k)", aspects: "16:9 max", note: "alias of soul_2" },
  { id: "soul_cast", name: "Soul Cast", provider: "Higgsfield", role: "generator", cr: 0.12, cost: "0.12cr (budget 50)", aspects: "16:9", note: "consistent cinematic character identity" },
  { id: "soul_location", name: "Soul Location", provider: "Higgsfield", role: "generator", cr: 0.12, cost: "0.12cr", aspects: "1:1…21:9", note: "environments / backgrounds" },
  { id: "cinematic_studio_2_5", name: "Cinema Studio Image 2.5", provider: "Higgsfield", role: "generator", cr: 2, cost: "2cr (2k)", aspects: "1:1…21:9", note: "cinematic stills up to 4k" },
  { id: "gpt_image_2", name: "GPT Image 2", provider: "OpenAI", role: "generator", cr: 7, cost: "7cr (2k/high)", aspects: "16:9 max", note: "strong text rendering / editing" },
  { id: "openai_hazel", name: "OpenAI Hazel", provider: "OpenAI", role: "generator", cr: 6, cost: "6cr (high)", aspects: "1:1/3:2/2:3", note: "best text/logos/diagrams; limited ratios" },
  { id: "seedream_v4_5", name: "Seedream 4.5", provider: "Bytedance", role: "generator", cr: 1, cost: "1cr (basic)", aspects: "1:1…21:9", note: "4k/~6k, transformations" },
  { id: "seedream_v5_lite", name: "Seedream V5 Lite", provider: "Bytedance", role: "generator", cr: 1, cost: "1cr (basic)", aspects: "1:1…21:9", note: "instruction-based editing" },
  { id: "seedream_v5_pro", name: "Seedream 5.0 Pro", provider: "Bytedance", role: "generator", cr: 3, cost: "3cr (2k)", aspects: "1:1…21:9", note: "pro visual reasoning / editing" },
  { id: "flux_2", name: "FLUX.2", provider: "Black Forest Labs", role: "generator", cr: 1.5, cost: "1.5cr (2k/pro)", aspects: "16:9 max", note: "precise prompt adherence (pro/flex/max)" },
  { id: "flux_kontext", name: "Flux Kontext", provider: "Black Forest Labs", role: "generator", cr: 1.5, cost: "1.5cr", aspects: "16:9 max", note: "context-aware editing / style transfer" },
  { id: "kling_omni_image", name: "Kling O1 Image", provider: "Kling", role: "generator", cr: 0.5, cost: "0.5cr (2k)", aspects: "1:1…21:9", note: "cheap photorealistic, wide ratios" },
  { id: "grok_image", name: "Grok Image", provider: "xAI", role: "generator", cr: 2, cost: "2cr (2k/quality)", aspects: "1:2…16:9", note: "expressive, high-contrast" },
  { id: "recraft_v4_1", name: "Recraft V4.1", provider: "Recraft", role: "generator", cr: 8, cost: "8cr (2k)", aspects: "16:9 max", note: "logos/vector/icons/mockups" },
  { id: "z_image", name: "Z Image", provider: "Tongyi-MAI", role: "generator", cr: 0.15, cost: "0.15cr", aspects: "16:9 max", note: "cheapest image — fast stylized" },
  { id: "marketing_studio_image", name: "Marketing Studio Image", provider: "Higgsfield", role: "generator", cr: 2, cost: "2cr (2k)", aspects: "1:1…21:9", note: "one-click product ads" },
  { id: "ms_image", name: "DTC Ads", provider: "Higgsfield", role: "generator", cost: "needs style_id (not measured)", aspects: "many", note: "brand-kit-aware DTC ads; requires a style_id" },
  { id: "image_auto", name: "Auto", provider: "Higgsfield", role: "generator", cr: 2, cost: "2cr (routes to a model)", aspects: "16:9 max", note: "auto-selects a model by prompt intent" },
  { id: "autosprite", name: "AutoSprite Animation", provider: "Higgsfield", role: "generator", cr: 2, cost: "2cr (turbo)", note: "character image → game sprite sheet" },
  // Utilities (edit/post — cost depends on input; not benchmarked here)
  { id: "image_background_remover", name: "Image Background Remover", provider: "Higgsfield", role: "utility", cost: "varies (cutout)" },
  { id: "outpaint", name: "Outpaint", provider: "Higgsfield", role: "utility", cost: "varies (uncrop/expand)" },
  { id: "topaz_image", name: "Topaz", provider: "Topaz", role: "utility", cost: "varies (upscale; needs target dims)" },
  { id: "topaz_image_generative", name: "Topaz (generative)", provider: "Topaz", role: "utility", cost: "varies (generative upscale; needs target dims)" },
  { id: "bytedance_image_upscale", name: "Bytedance Image Upscale", provider: "Bytedance", role: "utility", cost: "varies (upscale; needs prompt+media)" },
];

/* ── VIDEO ────────────────────────────────────────────────────────────────── */

export const videoCatalog: CatalogEntry[] = [
  // Generators
  { id: "seedance1_5", name: "Seedance 1.5 Pro", provider: "Bytedance", role: "generator", cr: 4.8, cost: "4.8cr (720p/4s silent)", aspects: "1:1…21:9", durations: "4/8/12s", note: "cheapest video generator; reliable motion" },
  { id: "cinematic_studio_video_v2", name: "Cinema Studio Video (refined)", provider: "Higgsfield", role: "generator", cr: 5, cost: "5cr (5s silent)", aspects: "16:9 max", durations: "3–12s", note: "cheap; genre + multi-shot control" },
  { id: "cinematic_studio_video", name: "Cinema Studio Video (v1)", provider: "Higgsfield", role: "generator", cr: 5, cost: "5cr (5s silent)", aspects: "16:9 max", durations: "5/10s", note: "cheap older cinematic" },
  { id: "kling2_6", name: "Kling 2.6 Video", provider: "Kling", role: "generator", cr: 5, cost: "5cr (5s silent)", aspects: "16:9/9:16/1:1", durations: "5/10s", note: "cinematic motion, advanced physics" },
  { id: "minimax_hailuo", name: "Minimax Hailuo", provider: "Hailuo", role: "generator", cr: 6, cost: "6cr (768/6s)", aspects: "—", durations: "6/10s", note: "natural physics, facial emotion" },
  { id: "kling3_0", name: "Kling v3.0", provider: "Kling", role: "generator", cr: 7.5, cost: "7.5cr (5s silent)", aspects: "16:9/9:16/1:1", durations: "3–15s", note: "⭐ project alt — multi-shot, motion transfer; audio adds cost" },
  { id: "kling3_0_turbo", name: "Kling 3.0 Turbo", provider: "Kling", role: "generator", cr: 7.5, cost: "7.5cr (720p/5s)", aspects: "16:9/9:16/1:1", durations: "3–15s", note: "fast text-to-video / single start-frame" },
  { id: "wan2_7", name: "Wan 2.7", provider: "Wan", role: "generator", cr: 7.5, cost: "7.5cr (720p/5s)", aspects: "16:9…3:4", durations: "2–15s", note: "synchronized audio, character-consistent" },
  { id: "grok_video", name: "Grok Video", provider: "xAI", role: "generator", cr: 7.5, cost: "7.5cr (5s)", aspects: "16:9/9:16/1:1", durations: "1–15s", note: "text/image-to-video, audio" },
  { id: "veo3_1_lite", name: "Veo 3.1 Lite", provider: "Google", role: "generator", cr: 8, cost: "8cr (8s silent)", aspects: "16:9/9:16/auto", durations: "4/6/8s", note: "budget Veo — big saving vs veo3_1" },
  { id: "seedance_2_0_mini", name: "Seedance 2.0 Mini", provider: "Bytedance", role: "generator", cr: 12.5, cost: "12.5cr (720p/5s silent)", aspects: "1:1…21:9", durations: "4–15s", note: "budget Seedance 2.0 (480p/720p only)" },
  { id: "wan2_6", name: "Wan 2.6 Video", provider: "Wan", role: "generator", cr: 13, cost: "13cr (720p/5s)", aspects: "16:9/9:16/1:1", durations: "5/10/15s", note: "stylized, experimental" },
  { id: "veo3_1", name: "Veo 3.1", provider: "Google", role: "generator", cr: 22, cost: "22cr (8s basic)", aspects: "16:9/9:16", durations: "4/6/8s", note: "⭐ project top-tier — max 8s (under scenes' 15s); quality tier raises cost" },
  { id: "veo3", name: "Veo 3", provider: "Google", role: "generator", cr: 22, cost: "22cr (fast variant)", aspects: "16:9/9:16", durations: "variant only", note: "reliable cinematic, broad range" },
  { id: "seedance_2_0", name: "Seedance 2.0", provider: "Bytedance", role: "generator", cr: 22.5, cost: "22.5cr (720p/5s; 1080p=45)", aspects: "1:1…21:9", durations: "4–15s", note: "⭐ project primary — reference-driven, up to 4k" },
  { id: "grok_video_v15", name: "Grok Video 1.5", provider: "xAI", role: "generator", cr: 22.5, cost: "22.5cr (720p/5s)", aspects: "—", durations: "2–15s", note: "image-to-video with native audio" },
  { id: "gemini_omni", name: "Gemini Omni Flash", provider: "Google", role: "generator", cr: 24, cost: "24cr (720p/8s)", aspects: "16:9/9:16", durations: "4–10s", note: "reference-driven + native audio" },
  { id: "cinematic_studio_3_0", name: "Cinema Studio Video 3.0", provider: "Higgsfield", role: "generator", cr: 25, cost: "25cr (720p/5s silent)", aspects: "1:1…21:9", durations: "4–15s", note: "⭐ project 'Cinema Studio' — SOTA cinema-grade; also the DoP substitute" },
  { id: "marketing_studio_video", name: "Marketing Studio", provider: "Higgsfield", role: "generator", cr: 60, cost: "60cr (720p/12s)", aspects: "1:1…21:9", durations: "12–15s", note: "product ads, TikTok/Reels ready" },
  { id: "higgsfield_preset", name: "Higgsfield Preset", provider: "Higgsfield", role: "generator", cost: "needs preset_id (not measured)", aspects: "16:9/9:16/1:1", note: "preset-routed image-to-video (viral templates)" },
  // Utilities (edit/post/workflow — cost depends on input; not benchmarked here)
  { id: "topaz_video", name: "Topaz", provider: "Topaz", role: "utility", cost: "varies (upscale)" },
  { id: "bytedance_video_upscale", name: "Bytedance Video Upscale", provider: "Bytedance", role: "utility", cost: "varies (upscale to 2k/4k)" },
  { id: "video_upscale", name: "Video Upscale", provider: "Higgsfield", role: "utility", cost: "varies (upscale)" },
  { id: "video_deflicker", name: "Video Deflicker", provider: "Higgsfield", role: "utility", cost: "varies (deflicker)" },
  { id: "sam_3_video", name: "Remove Background", provider: "Higgsfield", role: "utility", cost: "varies (segmentation)" },
  { id: "video_background_remover", name: "Video Background Remover", provider: "Higgsfield", role: "utility", cost: "varies (cutout)" },
  { id: "sync_so", name: "Sync Lipsync 3", provider: "Sync", role: "utility", cost: "varies (lipsync)" },
  { id: "clipify", name: "Personal Clipper", provider: "Higgsfield", role: "utility", cost: "varies (YouTube → clips)" },
  { id: "explainer_video", name: "Explainer Video", provider: "Higgsfield", role: "utility", cost: "varies (assembles a narrated explainer workflow)" },
  { id: "llm_text", name: "LLM Generation", provider: "Higgsfield", role: "utility", cost: "varies (text/LLM helper)" },
];

/** Cheapest measured generator in each category — handy for tight-credit runs. */
export const cheapest = {
  image: "z_image (0.15cr) · then soul family 0.12cr · kling_omni_image 0.5cr",
  video: "seedance1_5 (4.8cr) · cinematic_studio_video / kling2_6 5cr · minimax_hailuo 6cr",
} as const;
