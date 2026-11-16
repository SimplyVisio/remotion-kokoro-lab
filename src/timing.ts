import timing from "./narration-timing.json";
import {VIDEO} from "./theme";

const SCENE_KEYS = [
  "hook",
  "problem",
  "concepts",
  "superpower",
  "persistence",
  "outro",
] as const;

export type SceneKey = (typeof SCENE_KEYS)[number];

export const getSceneDurations = (
  totalFrames: number,
): Record<SceneKey, number> => {
  const starts = timing.sections.map((section) =>
    Math.round((section.sceneStartMs / 1000) * VIDEO.fps),
  );

  return SCENE_KEYS.reduce(
    (durations, key, index) => {
      const start = starts[index] ?? 0;
      const end = starts[index + 1] ?? totalFrames;
      durations[key] = Math.max(1, end - start);
      return durations;
    },
    {} as Record<SceneKey, number>,
  );
};
