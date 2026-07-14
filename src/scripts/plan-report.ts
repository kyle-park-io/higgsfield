import type { PlanTier } from "../models.ts";
import {
  PLANS_AS_OF,
  PLANS_SOURCES,
  higherPlan,
  modelPlans,
  plans,
} from "../models.ts";
import { scenes } from "../scenes.ts";

const pad = (s: string, n: number): string =>
  s.length > n ? s.slice(0, n - 1) + "…" : s.padEnd(n);
const up = (t: PlanTier): string => t.toUpperCase();

console.log(`Higgsfield plans — as of ${PLANS_AS_OF}`);
console.log("(verify against the live pricing page and in-app lock icons — these drift)\n");

for (const p of plans) {
  const price = p.priceMonthlyUsd === null ? "custom" : `$${p.priceMonthlyUsd}/mo`;
  console.log(`  ${pad(p.label, 9)} ${pad(price, 10)} ${pad(p.monthlyCredits, 28)} ${p.note}`);
}

console.log("\nModel → minimum plan (models used in this project)");
console.log("-".repeat(92));
for (const [model, info] of Object.entries(modelPlans)) {
  console.log(
    `  ${pad(model, 15)} ${pad(up(info.minPlan), 9)} ${pad(info.approxCredits, 40)} [${info.confidence}]`,
  );
}

console.log("\nPer scene — plan needed for keyframe (Soul) + primary video model");
console.log("-".repeat(92));
const soulPlan = modelPlans["Soul 2.0"].minPlan;
let projectPlan: PlanTier = soulPlan;
for (const s of scenes) {
  const primaryPlan = modelPlans[s.models.primary].minPlan;
  const scenePlan = higherPlan(soulPlan, primaryPlan);
  projectPlan = higherPlan(projectPlan, scenePlan);
  console.log(
    `  ${pad("#" + s.id, 5)} ${pad("Soul 2.0 + " + s.models.primary, 30)} → ${up(scenePlan)}`,
  );
}

console.log("-".repeat(92));
console.log(`Bottom line: minimum plan to produce this project as specified = ${up(projectPlan)}`);
console.log(
  "  (Starter covers a cheaper proof: Soul keyframes + Kling/Cinema/DoP Lite + Seedance *Fast*;",
);
console.log("   full Seedance 2.0 and Veo 3.1 are what require Plus.)");

console.log("\nSources:");
for (const url of PLANS_SOURCES) console.log(`  - ${url}`);
