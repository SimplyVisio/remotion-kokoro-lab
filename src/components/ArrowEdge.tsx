import { interpolate } from "remotion";
import {
  ACCENTS,
  VIDEO,
  type AccentName,
} from "../theme";

type Props = {
  d: string;
  progress: number;
  accent?: AccentName;
  head?: { x: number; y: number; angle: number };
  strokeWidth?: number;
};

export const ArrowEdge: React.FC<Props> = ({
  d,
  progress,
  accent = "teal",
  head,
  strokeWidth = 3,
}) => {
  const palette = ACCENTS[accent];
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <svg
      width={VIDEO.width}
      height={VIDEO.height}
      viewBox={`0 0 ${VIDEO.width} ${VIDEO.height}`}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        overflow: "visible",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <path
        d={d}
        fill="none"
        stroke={palette.line}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - clamped}
      />
      {head && clamped > 0 ? (
        <g
          transform={`translate(${head.x} ${head.y}) rotate(${head.angle})`}
          opacity={interpolate(clamped, [0.8, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          <path
            d="M -13 -8 L 3 0 L -13 8"
            fill="none"
            stroke={palette.soft}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ) : null}
    </svg>
  );
};
