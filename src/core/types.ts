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

/** Video model candidates available in the Higgsfield workspace. */
export type VideoModel =
  | "Seedance 2.0"
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
  /** Current production status. */
  status: SceneStatus;
}
