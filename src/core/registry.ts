import type { Scene } from "./types.ts";
import * as quantumBitcoinElements from "../../projects/quantum-bitcoin-elements/scenes.ts";
import * as quantumEntanglement from "../../projects/quantum-entanglement/scenes.ts";

/**
 * Registry of every production project in this monorepo.
 *
 * Each project owns its own `scenes.ts` (SSOT: `production` constants + the 9 scenes)
 * and its own media under `projects/<name>/{prompts,keyframes,outputs}`. The shared
 * tooling in `src/` (this registry, the loader, generate scripts, catalog, model-map)
 * operates on whichever project you select with `--project <name>`.
 *
 * To add a project: create `projects/<name>/scenes.ts` and register it here.
 */
export const PROJECTS = {
  "quantum-bitcoin-elements": quantumBitcoinElements,
  "quantum-entanglement": quantumEntanglement,
} satisfies Record<string, { scenes: Scene[]; production: unknown }>;

export type ProjectName = keyof typeof PROJECTS;

/** Default project used when `--project` / `HF_PROJECT` is not given. */
export const DEFAULT_PROJECT: ProjectName = "quantum-bitcoin-elements";
