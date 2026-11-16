import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../theme";

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 4,
        backgroundColor: "rgba(148, 163, 184, 0.12)",
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: "100%",
          backgroundImage: `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.violet})`,
          boxShadow: `0 0 18px ${COLORS.tealGlow}`,
        }}
      />
    </div>
  );
};

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = interpolate(frame, [0, durationInFrames], [0, 80], {
    extrapolateRight: "clamp",
  });
  const glowDrift = interpolate(frame, [0, durationInFrames], [0, -70], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          inset: -100,
          backgroundImage: `linear-gradient(${COLORS.grid} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.grid} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          translate: `${-drift}px ${-drift}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -280,
          top: -340 + glowDrift,
          width: 1200,
          height: 1200,
          background:
            "radial-gradient(circle, rgba(45, 212, 191, 0.16) 0%, rgba(45, 212, 191, 0.05) 38%, transparent 68%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -340,
          bottom: -420 - glowDrift,
          width: 1400,
          height: 1400,
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, rgba(139, 92, 246, 0.05) 40%, transparent 68%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 42%, rgba(3, 6, 12, 0.72) 100%)",
        }}
      />
      <ProgressBar />
    </AbsoluteFill>
  );
};
