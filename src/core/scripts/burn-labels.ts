import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { loadProject, stripProjectFlag } from "../project.ts";

/**
 * Burn a scene's `labels` onto its clip as real-font text overlays.
 *
 * Video generation corrupts small on-screen diagram text (URXO, UVO, STC…), so labels are burned in
 * post from `Scene.labels` instead — accurate spelling, stable, editable. See the video-transitions
 * spec and `Scene.labels` in src/core/types.ts.
 *
 * Usage:
 *   node src/core/scripts/burn-labels.ts --project <name> --scene 5 [--font <path>] [--size 26]
 *   (reads projects/<name>/outputs/scene0N/keeper.mp4 → writes keeper-labeled.mp4)
 */

const FONT_CANDIDATES = [
  "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
  "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
  "/System/Library/Fonts/Helvetica.ttc",
];

function arg(name: string): string | undefined {
  const argv = stripProjectFlag();
  const i = argv.findIndex((a) => a === name);
  return i >= 0 ? argv[i + 1] : undefined;
}

const { name: projectName, dir, scenes } = loadProject();

const sceneId = Number(arg("--scene"));
if (!sceneId) throw new Error("pass --scene <id>, e.g. --scene 5");
const scene = scenes.find((s) => s.id === sceneId);
if (!scene) throw new Error(`no scene ${sceneId} in ${projectName}`);
if (!scene.labels?.length) throw new Error(`scene ${sceneId} has no labels to burn`);

const font = arg("--font") ?? FONT_CANDIDATES.find((f) => existsSync(f));
if (!font) throw new Error(`no font found; pass --font <path>. Tried: ${FONT_CANDIDATES.join(", ")}`);
const size = Number(arg("--size") ?? 26);

const sceneDir = join(dir, "outputs", `scene${String(sceneId).padStart(2, "0")}`);
const input = join(sceneDir, "keeper.mp4");
const output = join(sceneDir, "keeper-labeled.mp4");
if (!existsSync(input)) throw new Error(`no keeper clip at ${input}`);

// ffmpeg drawtext escaping: ':' and '\' inside text; x/y in normalized coords → *(w)/(h).
const esc = (t: string) => t.replace(/\\/g, "\\\\").replace(/:/g, "\\:").replace(/'/g, "’");
const filter = scene.labels
  .map((l) => {
    const x = `(w*${l.x})`;
    const y = `(h*${l.y})`;
    return (
      `drawtext=fontfile=${font}:text='${esc(l.text)}':x=${x}:y=${y}` +
      `:fontsize=${size}:fontcolor=white:borderw=3:bordercolor=black@0.85`
    );
  })
  .join(",");

console.log(`burning ${scene.labels.length} labels onto scene ${sceneId} (${projectName})`);
for (const l of scene.labels) console.log(`  "${l.text}"  @ ${l.x}, ${l.y}`);

execFileSync("ffmpeg", ["-loglevel", "error", "-i", input, "-vf", filter, "-c:a", "copy", output, "-y"], {
  stdio: "inherit",
});

console.log(`\nwrote ${output.replace(join(dir, ".."), "projects")}`);
