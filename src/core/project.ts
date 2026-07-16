import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_PROJECT, PROJECTS, type ProjectName } from "./registry.ts";

/** Monorepo root — two levels up from `src/core/`. */
export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

/**
 * Resolve the target project from `--project <name>` / `-p <name>` (argv),
 * then `HF_PROJECT` (env), else {@link DEFAULT_PROJECT}. Throws on an unknown name.
 */
export function resolveProjectName(argv: string[] = process.argv.slice(2)): ProjectName {
  const i = argv.findIndex((a) => a === "--project" || a === "-p");
  const raw = (i >= 0 ? argv[i + 1] : undefined) ?? process.env.HF_PROJECT ?? DEFAULT_PROJECT;
  if (!(raw in PROJECTS)) {
    const known = Object.keys(PROJECTS).join(", ");
    throw new Error(`Unknown project "${raw}". Known projects: ${known}.`);
  }
  return raw as ProjectName;
}

/** A selected project: its name, absolute folder, and loaded SSOT (`scenes` + `production`). */
export function loadProject(name: ProjectName = resolveProjectName()) {
  const mod = PROJECTS[name];
  return {
    name,
    /** Absolute path to `projects/<name>/`. */
    dir: join(repoRoot, "projects", name),
    scenes: mod.scenes,
    production: mod.production,
  };
}

/** Strip a `--project <name>` / `-p <name>` pair out of argv so positional parsing is clean. */
export function stripProjectFlag(argv: string[] = process.argv.slice(2)): string[] {
  const out: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--project" || argv[i] === "-p") {
      i++; // also skip its value
      continue;
    }
    out.push(argv[i]);
  }
  return out;
}
