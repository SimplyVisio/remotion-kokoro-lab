import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  ACCENTS,
  COLORS,
  FONTS,
  type AccentName,
} from "../theme";

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  accent?: AccentName;
  appearAt?: number;
  badge?: string;
  fontSize?: number;
  mono?: boolean;
  zIndex?: number;
};

export const GraphNode: React.FC<Props> = ({
  x,
  y,
  width,
  height,
  label,
  accent = "teal",
  appearAt = 0,
  badge,
  fontSize = 34,
  mono = false,
  zIndex = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 200, stiffness: 120 },
    durationInFrames: 26,
  });
  const palette = ACCENTS[accent];

  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - height / 2,
        width,
        height,
        borderRadius: 24,
        border: `1px solid ${palette.line}`,
        backgroundImage: `linear-gradient(180deg, ${COLORS.surfaceRaised} 0%, ${COLORS.surface} 100%)`,
        boxShadow: `0 18px 50px rgba(0, 0, 0, 0.45), 0 0 60px ${palette.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.06)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: "0 20px",
        opacity: appear,
        scale: interpolate(appear, [0, 1], [0.72, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          output: "perceptual-scale",
        }),
        translate: interpolate(appear, [0, 1], ["0px 24px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        zIndex,
      }}
    >
      {badge ? (
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: Math.round(fontSize * 0.48),
            fontWeight: 600,
            color: palette.soft,
            border: `1px solid ${palette.line}`,
            backgroundColor: palette.glow,
            borderRadius: 10,
            padding: "5px 9px",
            lineHeight: 1,
          }}
        >
          {badge}
        </span>
      ) : null}
      <span
        style={{
          fontFamily: mono ? FONTS.mono : FONTS.sans,
          fontSize,
          fontWeight: 600,
          color: COLORS.text,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
};
