// Generate a scene's Soul keyframe (still image) via the Higgsfield REST API.
// This uses the API/SDK path (platform.higgsfield.ai + HF_API_KEY/HF_API_SECRET),
// NOT the MCP. It SPENDS CREDITS.
//
// Run:  node --disable-warning=ExperimentalWarning --env-file=.env \
//         src/api/scripts/generate-keyframe.ts [sceneId]
//   or:  pnpm generate:keyframe [sceneId]      (defaults to scene 1)
//
// Use Soul's native max ratio (16:9, 2048x1152) as-is — no cropping.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BatchSize, HiggsfieldClient, SoulQuality, SoulSize } from "@higgsfield/client";
import { scenes } from "../../core/scenes.ts";

const sceneId = Number(process.argv[2] ?? "1");
const scene = scenes.find((s) => s.id === sceneId);
if (!scene) {
  console.error(`✗ No scene with id ${sceneId} (have 1..${scenes.length}).`);
  process.exit(1);
}

const apiKey = process.env.HF_API_KEY?.trim();
const apiSecret = process.env.HF_API_SECRET?.trim();
if (!apiKey || !apiSecret) {
  console.error("✗ Missing HF_API_KEY / HF_API_SECRET. Run with:  pnpm generate:keyframe");
  process.exit(1);
}

const size = SoulSize.LANDSCAPE_2048x1152; // 16:9 — Soul's native max ratio (no cropping)
const client = new HiggsfieldClient({ apiKey, apiSecret });

console.log(`Scene ${scene.id} "${scene.title}" — Soul keyframe (single · HD · ${size})`);
console.log("  path: REST API (platform.higgsfield.ai) — NOT the MCP. Spends credits.");
console.log(`  prompt: ${scene.keyframePrompt.slice(0, 90)}…\n`);

try {
  const jobSet = await client.generate(
    "/v1/text2image/soul",
    {
      prompt: scene.keyframePrompt,
      width_and_height: size,
      quality: SoulQuality.HD,
      batch_size: BatchSize.SINGLE,
    },
    { withPolling: true },
  );

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
  const n = String(scene.id).padStart(2, "0");
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
