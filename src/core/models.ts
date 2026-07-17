import type { VideoModel } from "./types.ts";

/**
 * Minimum-plan reference for the Higgsfield models used in this project.
 *
 * ⚠️ Higgsfield pricing/plans change often and third-party sources disagree.
 * Treat this as a dated snapshot, not gospel — the authoritative check is the
 * live pricing page, the in-app model picker (locked models show a lock icon),
 * and, once the MCP is authenticated, which tools/models it actually exposes.
 */
export const PLANS_AS_OF = "2026-07-16"; // Starter/Plus credits verified live via MCP show_plans_and_credits + balance

export const PLANS_SOURCES = [
  "https://higgsfield.ai/pricing",
  "https://higgsfield.ai/blog/seedance-2-0-pricing-2026",
  "https://www.imagine.art/blogs/higgsfield-ai-pricing",
  "https://www.scopeful.org/tools/higgsfield",
  "https://blog.segmind.com/higgsfield-ai-features-pricing-guide/",
] as const;

/** Subscription tiers, cheapest → most capable. */
export type PlanTier = "free" | "starter" | "plus" | "ultra" | "business";

/** Capability rank for comparisons (business ≈ plus in model access). */
export const planRank: Record<PlanTier, number> = {
  free: 0,
  starter: 1,
  plus: 2,
  business: 2,
  ultra: 3,
};

/** Return whichever plan is the more capable of the two. */
export const higherPlan = (a: PlanTier, b: PlanTier): PlanTier =>
  planRank[a] >= planRank[b] ? a : b;

export interface PlanInfo {
  tier: PlanTier;
  label: string;
  /** Month-to-month price in USD (annual is cheaper); null = custom/N/A. */
  priceMonthlyUsd: number | null;
  monthlyCredits: string;
  note: string;
}

export const plans: PlanInfo[] = [
  {
    tier: "free",
    label: "Free",
    priceMonthlyUsd: 0,
    monthlyCredits: "~10 credits/day (no rollover)",
    note: "Watermarked exports, selected models only, no Veo, resolution/length/commercial caps.",
  },
  {
    tier: "starter",
    label: "Starter",
    priceMonthlyUsd: 15,
    monthlyCredits: "270/mo",
    note: "Selected models. Seedance 2.0 *Fast* only (not full). Unlimited Soul V2 & Cinema.",
  },
  {
    tier: "plus",
    label: "Plus",
    priceMonthlyUsd: 49, // month-to-month; annual ~$26 (live 2026-07-16)
    monthlyCredits: "~1,200/mo (card lists 1,000; observed grant = 1,200)",
    note: "ALL models — full Seedance 2.0 and Veo 3.1 unlock here. 5,000 free Soul/Cinema gens.",
  },
  {
    tier: "ultra",
    label: "Ultra",
    priceMonthlyUsd: 99, // annual; ~$129 month-to-month
    monthlyCredits: "3,000/mo (scalable to ~9,000)",
    note: "High volume. 10,000 free Soul gens. Unlimited Kling 3.0 on annual.",
  },
  {
    tier: "business",
    label: "Business",
    priceMonthlyUsd: 89, // per seat, 2-seat minimum, shared pool
    monthlyCredits: "1,500/seat",
    note: "Team plan, shared credit pool, 2-seat minimum. (Enterprise = custom/SOC2.)",
  },
];

export type Confidence = "high" | "medium" | "low";

/** The keyframe model plus every VideoModel referenced by scenes. */
export type ProjectModel = VideoModel | "Nano Banana 2";

export interface ModelPlanInfo {
  /** Minimum plan able to call this model at the quality this project uses. */
  minPlan: PlanTier;
  /** Rough credit cost per generation at 720p — varies by resolution/length. */
  approxCredits: string;
  /** Confidence given source drift. */
  confidence: Confidence;
  note: string;
}

export const modelPlans: Record<ProjectModel, ModelPlanInfo> = {
  "Nano Banana 2": {
    minPlan: "plus",
    approxCredits: "~2cr / 2k image (4k=4cr)",
    confidence: "high",
    note: "Keyframe model — what `nano_banana_pro` resolves to via MCP. Plus+ only. soul_cinematic (~0.12cr) is the cheap Soul-family alt.",
  },
  "Cinema Studio": {
    minPlan: "starter",
    approxCredits: "5.0 cr/s @21:9/720p (60 @12s) — dearer than Seedance 2.0 std",
    confidence: "high",
    note: "= `cinematic_studio_3_0`, which does 21:9 at 4–15s. Do NOT confuse it with `cinematic_studio_video` / `_v2`, older models with no 21:9 and 5/10s and 3–12s caps. Bundled with 'Soul V2 & Cinema' unlimited access on Starter+.",
  },
  "DoP": {
    minPlan: "starter",
    approxCredits: "Lite 3 / Turbo 5 / Standard 7 credits per 3s @720p",
    confidence: "medium",
    note: "DEPRECATED — no real MCP model; scenes now use Cinema Studio. Kept only because VideoModel still lists DoP.",
  },
  "Kling 3.0": {
    minPlan: "starter",
    approxCredits: "~7 credits / 5s @720p",
    confidence: "medium",
    note: "Available on Starter's selected models; unlimited on Ultra (annual).",
  },
  "Seedance 2.0": {
    minPlan: "plus",
    approxCredits: "4.5 cr/s @21:9/720p/std (22.5 @5s · 67.5 @15s); fast 3.5 cr/s; 1080p 9 cr/s",
    confidence: "high",
    note: "Starter includes only Seedance 2.0 *Fast*; the full model unlocks on Plus. Cost is linear in duration — see src/mcp/model-map.ts.",
  },
  "Seedance 2.0 Mini": {
    minPlan: "plus",
    approxCredits: "2.5 cr/s @21:9/720p (30 @12s · 37.5 @15s)",
    confidence: "high",
    note: "Budget Seedance 2.0: same 21:9 and start/end-image support at ~55% of the std rate. 480p/720p only.",
  },
  "Veo 3.1": {
    minPlan: "plus",
    approxCredits: "~58 credits / 8s @720p (with audio)",
    confidence: "high",
    note: "Not on Free. Plus and higher. Premium credit cost — cheapest to run out of credits.",
  },
};
