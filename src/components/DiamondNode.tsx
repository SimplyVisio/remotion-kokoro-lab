import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS } from "../theme";

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  lines: string[];
  appearAt?: number;
};

export const DiamondNode: React.FC<Props> = ({
  x,
  y,
  width,
  height,
  lines,
  appearAt = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
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
        opacity: appear,
        scale: interpolate(appear, [0, 1], [0.7, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          output: "perceptual-scale",
        }),
        zIndex: 4,
      }}
    >
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          filter: `drop-shadow(0 0 26px ${COLORS.violetGlow})`,
        }}
      >
        <polygon
          points={`${width / 2},4 ${width - 4},${height / 2} ${width / 2},${height - 4} 4,${height / 2}`}
          fill={COLORS.surfaceRaised}
          stroke={COLORS.violetLine}
          strokeWidth={2}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 52px",
          fontFamily: FONTS.sans,
          fontSize: 26,
          fontWeight: 600,
          lineHeight: 1.18,
          color: COLORS.text,
        }}
      >
        {lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    </div>
  );
};
