import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { ACCENTS, FADE_FRAMES, type AccentName } from "../theme";

type Props = {
  durationInFrames: number;
  accent: AccentName;
  children: React.ReactNode;
};

export const SceneShell: React.FC<Props> = ({
  durationInFrames,
  accent,
  children,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(
          frame,
          [0, FADE_FRAMES, durationInFrames - FADE_FRAMES, durationInFrames],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          },
        ),
        translate: interpolate(
          frame,
          [0, FADE_FRAMES, durationInFrames - FADE_FRAMES, durationInFrames],
          ["0px 22px", "0px 0px", "0px 0px", "0px -22px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          },
        ),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "54%",
          width: 1500,
          height: 1300,
          translate: "-50% -50%",
          backgroundImage: `radial-gradient(ellipse, ${ACCENTS[accent].glow} 0%, transparent 62%)`,
          opacity: 0.55,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};
