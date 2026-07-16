import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadProject } from "../project.ts";

const { name, dir, production, scenes } = loadProject();
const outDir = join(dir, "prompts");
mkdirSync(outDir, { recursive: true });

for (const s of scenes) {
  const n = String(s.id).padStart(2, "0");
  const md = `# Scene ${s.id} — ${s.title}

- **Layer:** ${s.layer} (${production.layerColor[s.layer]})
- **Camera:** ${s.camera.join(" → ")}
- **Keyframe model:** ${production.keyframeModel}
- **Video model:** ${s.models.primary} (A) / ${s.models.alt} (B)
- **Format:** ${production.aspectRatio} keyframe · ${production.fps}fps · ${s.durationSeconds}s clip
- **Status:** ${s.status}

## Keyframe prompt
${s.keyframePrompt}

## Motion (video) prompt
${s.motionPrompt}

## Narration (KO)
${s.narration}

---
_Common style tags: ${production.styleTags}_
`;
  writeFileSync(join(outDir, `scene${n}.md`), md, "utf8");
  console.log(`wrote projects/${name}/prompts/scene${n}.md`);
}

console.log(`\n${scenes.length} scene prompt files written to projects/${name}/prompts/`);
