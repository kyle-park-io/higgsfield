import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { production, scenes } from "../scenes.ts";

// repo root = three levels up from src/core/scripts/
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const outDir = join(root, "prompts");
mkdirSync(outDir, { recursive: true });

for (const s of scenes) {
  const n = String(s.id).padStart(2, "0");
  const md = `# Scene ${s.id} — ${s.title}

- **Layer:** ${s.layer} (${production.layerColor[s.layer]})
- **Camera:** ${s.camera.join(" → ")}
- **Model:** ${s.models.primary} (A) / ${s.models.alt} (B)
- **Format:** ${production.aspectRatio} · ${production.fps}fps · ${production.clipSeconds}s
- **Status:** ${s.status}

## Keyframe (Soul) prompt
${s.keyframePrompt}

## Motion (video) prompt
${s.motionPrompt}

## Narration (KO)
${s.narration}

---
_Common style tags: ${production.styleTags}_
`;
  writeFileSync(join(outDir, `scene${n}.md`), md, "utf8");
  console.log(`wrote prompts/scene${n}.md`);
}

console.log(`\n${scenes.length} scene prompt files written to prompts/`);
