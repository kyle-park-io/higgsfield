// Print the Higgsfield MCP model reference (ids, aspects, measured costs).
// Run:  pnpm models
import {
  type CatalogEntry,
  CATALOG_MEASURED_AS_OF,
  cheapest,
  imageCatalog,
  videoCatalog,
} from "../catalog.ts";
import {
  CAMERA_IN_MCP_VIDEO,
  CATALOG_AS_OF,
  keyframeChoice,
  keyframeModels,
  videoModelMap,
} from "../model-map.ts";

const fmtCost = (cost: Record<string, number>): string => {
  const e = Object.entries(cost);
  return e.length ? e.map(([t, c]) => `${t}=${c}cr`).join(", ") : "—";
};

console.log(`Higgsfield MCP model reference — costs as of ${CATALOG_AS_OF} (re-check with get_cost)`);
console.log("Aspect ratio does not affect cost; resolution / duration / quality do.\n");

console.log("KEYFRAME (image) models");
console.log("─".repeat(80));
for (const m of Object.values(keyframeModels)) {
  console.log(`  ${(m.mcpModelId ?? "").padEnd(18)} ${fmtCost(m.cost).padEnd(22)} ${m.aspects.join(" ")}`);
  console.log(`    ${m.note}`);
}
console.log(
  `\n  recommended → default: ${keyframeChoice.default} · mood: ${keyframeChoice.mood} · cheap: ${keyframeChoice.cheap}`,
);

console.log("\nVIDEO models (per clip)");
console.log("─".repeat(80));
for (const [name, m] of Object.entries(videoModelMap)) {
  console.log(`  ${name.padEnd(15)} ${(m.mcpModelId ?? "(none)").padEnd(22)} ${fmtCost(m.cost)}`);
  console.log(`    aspects: ${m.aspects.join(" ")}${m.durations ? "  ·  duration: " + m.durations : ""}`);
  console.log(`    ${m.note}`);
}

console.log(`\nVideo camera moves: ${CAMERA_IN_MCP_VIDEO}.`);

/* ── Full catalog (everything the MCP exposes, measured) ─────────────────────── */

const printCatalog = (title: string, entries: CatalogEntry[]): void => {
  console.log(`\n${title}`);
  console.log("─".repeat(80));
  const gens = entries
    .filter((e) => e.role === "generator")
    .sort((a, b) => (a.cr ?? Number.POSITIVE_INFINITY) - (b.cr ?? Number.POSITIVE_INFINITY));
  for (const e of gens) {
    console.log(`  ${e.id.padEnd(26)} ${e.cost.padEnd(27)} ${e.provider}`);
    if (e.note) console.log(`    ${e.note}`);
  }
  const utils = entries.filter((e) => e.role === "utility").map((u) => u.id);
  console.log(`  · utilities (edit/post, cost varies): ${utils.join(", ")}`);
};

console.log(`\n\n${"═".repeat(80)}`);
console.log(`FULL CATALOG — every MCP model, generators by measured cost (as of ${CATALOG_MEASURED_AS_OF})`);
console.log("get_cost snapshots at a representative tier; resolution/duration/quality/audio move it.");
console.log("═".repeat(80));
printCatalog("IMAGE generators (cheapest first)", imageCatalog);
printCatalog("VIDEO generators (cheapest first)", videoCatalog);
console.log(`\ncheapest → image: ${cheapest.image}`);
console.log(`cheapest → video: ${cheapest.video}`);
