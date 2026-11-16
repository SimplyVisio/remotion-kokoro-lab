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

type IconKind = "memory" | "checkpoint" | "human";

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  caption: string;
  icon: IconKind;
  accent: AccentName;
  appearAt: number;
};

const ChipIcon: React.FC<{ kind: IconKind; color: string }> = ({
  kind,
  color,
}) => {
  const strokeProps = {
    width: 34,
    height: 34,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (kind === "memory") {
    return (
      <svg {...strokeProps}>
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
        <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </svg>
    );
  }

  if (kind === "checkpoint") {
    return (
      <svg {...strokeProps}>
        <path d="M7 4h10v16l-5-4-5 4V4Z" />
      </svg>
    );
  }

  return (
    <svg {...strokeProps}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19c.6-3.4 3.2-5.3 6.5-5.3s5.9 1.9 6.5 5.3" />
    </svg>
  );
};

export const Chip: React.FC<Props> = ({
  x,
  y,
  width,
  height,
  label,
  caption,
  icon,
  accent,
  appearAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palette = ACCENTS[accent];
  const appear = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 200, stiffness: 120 },
    durationInFrames: 26,
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - height / 2,
        width,
        height,
        borderRadius: 26,
        border: `1px solid ${palette.line}`,
        backgroundImage: `linear-gradient(180deg, ${COLORS.surfaceRaised} 0%, ${COLORS.surface} 100%)`,
        boxShadow: `0 18px 50px rgba(0, 0, 0, 0.42), 0 0 50px ${palette.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.06)`,
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "0 26px",
        opacity: appear,
        scale: interpolate(appear, [0, 1], [0.8, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          output: "perceptual-scale",
        }),
        translate: interpolate(appear, [0, 1], ["0px 30px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        zIndex: 3,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          border: `1px solid ${palette.line}`,
          backgroundColor: palette.glow,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <ChipIcon kind={icon} color={palette.soft} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span
          style={{
            fontFamily: FONTS.sans,
            fontSize: 30,
            fontWeight: 600,
            lineHeight: 1.1,
            color: COLORS.text,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 22,
            lineHeight: 1.2,
            color: COLORS.muted,
          }}
        >
          {caption}
        </span>
      </div>
    </div>
  );
};
