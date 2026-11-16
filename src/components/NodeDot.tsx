import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ACCENTS, type AccentName } from "../theme";

type Props = {
  x: number;
  y: number;
  radius: number;
  accent: AccentName;
  appearAt: number;
  pulseDelay?: number;
};

export const NodeDot: React.FC<Props> = ({
  x,
  y,
  radius,
  accent,
  appearAt,
  pulseDelay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palette = ACCENTS[accent];
  const appear = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 200, stiffness: 120 },
    durationInFrames: 22,
  });
  const ringCycle = (frame + pulseDelay) % 80;

  return (
    <div
      style={{
        position: "absolute",
        left: x - radius,
        top: y - radius,
        width: radius * 2,
        height: radius * 2,
        opacity: appear,
        scale: interpolate(appear, [0, 1], [0.4, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          output: "perceptual-scale",
        }),
        zIndex: 3,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `1px solid ${palette.line}`,
          scale: interpolate(ringCycle, [0, 80], [1, 2.05], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          opacity:
            interpolate(ringCycle, [0, 80], [0.45, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }) * appear,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          backgroundImage: `radial-gradient(circle at 34% 28%, ${palette.soft} 0%, ${palette.solid} 52%, ${palette.line} 100%)`,
          border: `1px solid ${palette.soft}`,
          boxShadow: `0 0 34px ${palette.glow}, 0 10px 28px rgba(0, 0, 0, 0.45)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: radius * 0.55,
          height: radius * 0.55,
          translate: "-50% -50%",
          borderRadius: "50%",
          backgroundColor: "rgba(248, 250, 252, 0.92)",
        }}
      />
    </div>
  );
};
