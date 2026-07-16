import type { SceneStatus } from "../types.ts";
import { loadProject } from "../project.ts";

const { name, scenes } = loadProject();

const mark: Record<SceneStatus, string> = {
  todo: "[ ]",
  keyframe: "[k]",
  video: "[v]",
  done: "[x]",
};

const pad = (s: string, n: number): string =>
  s.length > n ? s.slice(0, n - 1) + "…" : s.padEnd(n);

console.log(`Project: ${name}`);
console.log(
  `${pad("Scene", 6)} ${pad("Layer", 9)} ${pad("Camera", 26)} ${pad("Model A / B", 26)} Status`,
);
console.log("-".repeat(80));

for (const s of scenes) {
  const camera = s.camera.join(" → ");
  const model = `${s.models.primary} / ${s.models.alt}`;
  console.log(
    `${pad("#" + s.id, 6)} ${pad(s.layer, 9)} ${pad(camera, 26)} ${pad(model, 26)} ${mark[s.status]} ${s.status}`,
  );
}

const done = scenes.filter((s) => s.status === "done").length;
console.log("-".repeat(80));
console.log(`${done}/${scenes.length} scenes done`);
