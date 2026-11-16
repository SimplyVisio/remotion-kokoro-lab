import {
  AbsoluteFill,
  Audio,
  Series,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";
import { Background } from "./components/Background";
import { TikTokCaptions } from "./components/TikTokCaptions";
import { ConceptsScene } from "./scenes/ConceptsScene";
import { HookScene } from "./scenes/HookScene";
import { OutroScene } from "./scenes/OutroScene";
import { PersistenceScene } from "./scenes/PersistenceScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { SuperpowerScene } from "./scenes/SuperpowerScene";
import { COLORS } from "./theme";
import { getSceneDurations } from "./timing";

export type LangGraphExplainerProps = {
  musicSrc: string | null;
};

export const LangGraphExplainer: React.FC<LangGraphExplainerProps> = ({
  musicSrc,
}) => {
  const { durationInFrames, fps } = useVideoConfig();
  const scenes = getSceneDurations(durationInFrames);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Background />
      <Audio src={staticFile("narracion.wav")} />
      {musicSrc ? (
        <Audio
          src={staticFile(musicSrc)}
          volume={(frame) =>
            interpolate(
              frame,
              [durationInFrames - 2 * fps, durationInFrames],
              [0.12, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            )
          }
        />
      ) : null}
      <Series>
        <Series.Sequence durationInFrames={scenes.hook}>
          <HookScene durationInFrames={scenes.hook} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={scenes.problem}>
          <ProblemScene durationInFrames={scenes.problem} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={scenes.concepts}>
          <ConceptsScene durationInFrames={scenes.concepts} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={scenes.superpower}>
          <SuperpowerScene durationInFrames={scenes.superpower} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={scenes.persistence}>
          <PersistenceScene durationInFrames={scenes.persistence} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={scenes.outro}>
          <OutroScene durationInFrames={scenes.outro} />
        </Series.Sequence>
      </Series>
      <TikTokCaptions />
    </AbsoluteFill>
  );
};
