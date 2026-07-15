// Generate a scene's Soul keyframe (still image) via the Higgsfield REST API.
// This uses the API/SDK path (platform.higgsfield.ai + HF_API_KEY/HF_API_SECRET),
// NOT the MCP. It SPENDS CREDITS.
//
// Run:  node --disable-warning=ExperimentalWarning --env-file=.env \
//         src/api/scripts/generate-keyframe.ts [sceneId] [--dry-run|-n]
//   or:  pnpm generate:keyframe [sceneId]          (defaults to scene 1)
//   or:  pnpm generate:keyframe:dry [sceneId]      (preview only — no call, no credits)
//
// --dry-run (-n): validate the scene + env and print the exact request that would be sent
// (model, size, est. cost, save path, prompt), then exit WITHOUT calling the API. Offline —
// needs no credits and makes no network request.
//
// Use Soul's native max ratio (16:9, 2048x1152) as-is — no cropping.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BatchSize, HiggsfieldClient, SoulQuality, SoulSize } from "@higgsfield/client";
import { scenes } from "../../core/scenes.ts";

// Args: a positional sceneId plus flags. `--dry-run` (`-n`) previews without spending.
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run") || args.includes("-n");
const sceneId = Number(args.find((a) => !a.startsWith("-")) ?? "1");
const scene = scenes.find((s) => s.id === sceneId);
if (!scene) {
  console.error(`✗ No scene with id ${sceneId} (have 1..${scenes.length}).`);
  process.exit(1);
}

const size = SoulSize.LANDSCAPE_2048x1152; // 16:9 — Soul's native max ratio (no cropping)
// Request payload — single source of truth shared by the dry-run preview and the real call.
const params = {
  prompt: scene.keyframePrompt,
  width_and_height: size,
  quality: SoulQuality.HD,
  batch_size: BatchSize.SINGLE,
};
const n = String(scene.id).padStart(2, "0");

const apiKey = process.env.HF_API_KEY?.trim();
const apiSecret = process.env.HF_API_SECRET?.trim();

// Approx credit cost, from the MCP-measured Soul snapshot (~0.12 cr at 1.5k/2k; see
// src/mcp/model-map.ts). The REST path bills a separate balance and isn't independently
// measured, so treat this as an estimate — not a live get_cost.
const APPROX_COST_CR = 0.12;

// --- Dry run: validate + preview the exact request. No network call, no credits. ---
if (dryRun) {
  console.log(`Scene ${scene.id} "${scene.title}" — DRY RUN (no API call, no credits)`);
  console.log("  path:   REST API (platform.higgsfield.ai)  POST /v1/text2image/soul");
  console.log(
    `  model:  Soul · quality ${params.quality} · size ${size} (16:9 native, no crop) · batch ${params.batch_size}`,
  );
  console.log(`  est:    ≈${APPROX_COST_CR} cr (approx — MCP Soul snapshot; REST not separately measured)`);
  console.log(`  creds:  HF_API_KEY ${apiKey ? "✓" : "✗ not set"}   HF_API_SECRET ${apiSecret ? "✓" : "✗ not set"}`);
  console.log(`  save:   keyframes/scene${n}/<timestamp>.png  (never overwrites)`);
  console.log(`  prompt: ${scene.keyframePrompt}`);
  process.exit(0);
}

if (!apiKey || !apiSecret) {
  console.error("✗ Missing HF_API_KEY / HF_API_SECRET. Run with:  pnpm generate:keyframe");
  process.exit(1);
}

const client = new HiggsfieldClient({ apiKey, apiSecret });

console.log(`Scene ${scene.id} "${scene.title}" — Soul keyframe (single · HD · ${size})`);
console.log("  path: REST API (platform.higgsfield.ai) — NOT the MCP. Spends credits.");
console.log(`  prompt: ${scene.keyframePrompt.slice(0, 90)}…\n`);

try {
  const jobSet = await client.generate("/v1/text2image/soul", params, { withPolling: true });

  if (jobSet.isNsfw) {
    console.error("✗ Result flagged NSFW — not saved.");
    process.exit(2);
  }
  if (!jobSet.isCompleted) {
    console.error("✗ Job did not complete:");
    console.error(JSON.stringify(jobSet.jobs, null, 2));
    process.exit(2);
  }

  const urls = jobSet.jobs
    .map((j) => j.results?.raw.url)
    .filter((u): u is string => typeof u === "string");
  if (urls.length === 0) {
    console.error("✗ Completed but no image URL found:");
    console.error(JSON.stringify(jobSet.jobs, null, 2));
    process.exit(2);
  }

  const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
  const dir = join(root, "keyframes", `scene${n}`); // per-scene folder — keep every attempt
  mkdirSync(dir, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  for (const [i, url] of urls.entries()) {
    const ext = (url.split("?")[0]?.split(".").pop() ?? "png").toLowerCase();
    const suffix = urls.length > 1 ? `-${i + 1}` : "";
    const out = join(dir, `${stamp}${suffix}.${ext}`); // unique timestamp — never overwrite
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`✗ Download failed (HTTP ${res.status}) for ${url}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(out, buf);
    console.log(`✓ Saved ${out}  (${(buf.length / 1024).toFixed(0)} KB)`);
    console.log(`  URL: ${url}`);
  }
} catch (err) {
  const e = err as { message?: string; response?: { status?: number; data?: unknown } };
  console.error(`✗ Generation error: ${e.message ?? String(err)}`);
  if (e.response?.data) console.error(JSON.stringify(e.response.data, null, 2));
  process.exit(2);
} finally {
  client.close();
}
