/** Structural scale layer a scene lives in (molecule -> atom -> quark). */
export type Layer = "molecule" | "atom" | "quark";

/** Higgsfield camera-movement preset used to drive a shot. */
export type CameraPreset =
  | "Dolly In"
  | "Super Dolly In"
  | "Dolly Out"
  | "Super Dolly Out"
  | "Crash Zoom In"
  | "Dolly Zoom In"
  | "360 Orbit"
  | "Arc Left"
  | "Arc Right"
  | "Eyes In"
  | "Static";

/**
 * Video model candidates available in the Higgsfield workspace.
 *
 * Aspect ratio disqualifies models before quality does. Verified via `models_explore` 2026-07-17:
 * only the Seedance family renders **21:9** — `Kling 3.0`, `Cinema Studio` and `Veo 3.1` top out at
 * 16:9. `Cinema Studio` also only accepts 5s or 10s durations, and `Veo 3.1` caps at 8s.
 * A 21:9 project (see each project's `production.aspectRatio`) can therefore only use Seedance.
 */
export type VideoModel =
  | "Seedance 2.0"
  | "Seedance 2.0 Mini"
  | "DoP"
  | "Cinema Studio"
  | "Kling 3.0"
  | "Veo 3.1";

/** Production status for a single scene. */
export type SceneStatus = "todo" | "keyframe" | "video" | "done";

/** One scene of the 9-scene continuous zoom. Single source of truth. */
export interface Scene {
  /** 1-based scene number, matches the production guide. */
  id: number;
  /** Short Korean title from the scenario. */
  title: string;
  /** Which scale layer this scene belongs to. */
  layer: Layer;
  /** Soul keyframe (still image) prompt — English, per guide. */
  keyframePrompt: string;
  /** Motion (image-to-video) prompt — English, split into time segments. */
  motionPrompt: string;
  /** Target clip length in seconds — Korean-VO paced; video models cap at 15s (Seedance/Kling/Cinema). */
  durationSeconds: number;
  /** Camera presets to apply, in order (transition preset first). */
  camera: CameraPreset[];
  /** Preferred model (A) and comparison model (B) for A/B testing. */
  models: { primary: VideoModel; alt: VideoModel };
  /** Original Korean narration. */
  narration: string;
  /**
   * Diagram labels burned onto the clip in post, NOT generated in the video.
   *
   * Video models corrupt small on-screen text once several labels are present and the frame
   * animates — even with a locked camera (scene 5: URXO, UVO, STC, Transction). So keyframes carry
   * labels for composition only; the clip is generated ignoring them; the accurate labels are
   * overlaid at edit time from this list (real font → correct spelling, stable, editable).
   *
   * `x`/`y` are normalized 0–1 (fraction of width/height), top-left anchor, matching the label's
   * position in the keyframe. Optional — sparse scenes (1–3) need none.
   */
  labels?: { text: string; x: number; y: number }[];
  /** Current production status. */
  status: SceneStatus;
}
