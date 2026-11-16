import {
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ACCENTS, COLORS, FONTS } from "../theme";

type Props = {
  index: string;
  label: string;
  intensity: number;
  appearAt: number;
};

export const ConceptPill: React.FC<Props> = ({
  index,
  label,
  intensity,
  appearAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 200, stiffness: 130 },
    durationInFrames: 24,
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        height: 54,
        padding: "0 24px",
        borderRadius: 27,
        border: `1px solid ${interpolateColors(
          intensity,
          [0, 1],
          [COLORS.border, ACCENTS.teal.line],
        )}`,
        backgroundColor: interpolateColors(
          intensity,
          [0, 1],
          ["rgba(148, 163, 184, 0.05)", ACCENTS.teal.glow],
        ),
        boxShadow: `0 0 30px ${interpolateColors(
          intensity,
          [0, 1],
          ["rgba(0, 0, 0, 0)", ACCENTS.teal.glow],
        )}`,
        opacity: appear,
        scale: interpolate(appear, [0, 1], [0.9, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        zIndex: 4,
      }}
    >
      <span
        style={{
          fontFamily: FONTS.mono,
          fontSize: 18,
          fontWeight: 600,
          color: interpolateColors(
            intensity,
            [0, 1],
            [COLORS.faint, ACCENTS.teal.soft],
          ),
        }}
      >
        {index}
      </span>
      <span
        style={{
          fontFamily: FONTS.sans,
          fontSize: 27,
          fontWeight: 600,
          color: interpolateColors(
            intensity,
            [0, 1],
            [COLORS.muted, COLORS.text],
          ),
        }}
      >
        {label}
      </span>
    </div>
  );
};
