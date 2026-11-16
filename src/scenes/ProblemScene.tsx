import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ArrowEdge } from "../components/ArrowEdge";
import { GraphNode } from "../components/GraphNode";
import { SceneHeading } from "../components/SceneHeading";
import { SceneShell } from "../components/SceneShell";
import { COLORS, FONTS } from "../theme";

type Props = {
  durationInFrames: number;
};

export const ProblemScene: React.FC<Props> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const crossIn = spring({
    frame: frame - 92,
    fps,
    config: { damping: 160, stiffness: 170 },
    durationInFrames: 20,
  });

  return (
    <SceneShell durationInFrames={durationInFrames} accent="violet">
      <SceneHeading
        eyebrow="El problema"
        title="Las cadenas lineales no bastan"
        subtitle="Un camino fijo, sin decisiones ni retorno."
      />
      <AbsoluteFill style={{ fontFamily: FONTS.sans }}>
        <GraphNode
          x={610}
          y={560}
          width={240}
          height={130}
          label="A"
          badge="01"
          mono
          fontSize={64}
          appearAt={12}
        />
        <GraphNode
          x={960}
          y={560}
          width={240}
          height={130}
          label="B"
          badge="02"
          mono
          fontSize={64}
          appearAt={20}
        />
        <GraphNode
          x={1310}
          y={560}
          width={240}
          height={130}
          label="C"
          badge="03"
          mono
          fontSize={64}
          appearAt={28}
        />

        <ArrowEdge
          d="M 734 560 L 832 560"
          head={{ x: 840, y: 560, angle: 0 }}
          progress={interpolate(frame, [34, 54], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}
        />
        <ArrowEdge
          d="M 1084 560 L 1182 560"
          head={{ x: 1190, y: 560, angle: 0 }}
          progress={interpolate(frame, [46, 66], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}
        />

        <ArrowEdge
          d="M 1310 628 C 1310 800, 610 800, 610 628"
          accent="violet"
          strokeWidth={3.5}
          head={{ x: 610, y: 628, angle: -90 }}
          progress={interpolate(frame, [58, 90], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}
        />

        <div
          style={{
            position: "absolute",
            left: 900,
            top: 696,
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor: "rgba(11, 15, 26, 0.94)",
            border: `1px solid ${COLORS.dangerLine}`,
            boxShadow: `0 0 46px ${COLORS.dangerGlow}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: crossIn,
            scale: interpolate(crossIn, [0, 1], [0.35, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              output: "perceptual-scale",
            }),
            rotate: interpolate(crossIn, [0, 1], ["-30deg", "0deg"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            zIndex: 6,
          }}
        >
          <svg width={120} height={120} viewBox="0 0 120 120">
            <path
              d="M 34 34 L 86 86 M 86 34 L 34 86"
              stroke={COLORS.danger}
              strokeWidth={8}
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div
          style={{
            position: "absolute",
            top: 838,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: FONTS.mono,
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: COLORS.danger,
            opacity: crossIn,
          }}
        >
          sin retorno
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
