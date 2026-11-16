import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { ArrowEdge } from "../components/ArrowEdge";
import { DiamondNode } from "../components/DiamondNode";
import { GraphNode } from "../components/GraphNode";
import { SceneHeading } from "../components/SceneHeading";
import { SceneShell } from "../components/SceneShell";
import { COLORS, FONTS } from "../theme";

const PULSE_TIMES = [47, 69, 90, 111, 124, 146, 163];
const PULSE_X = [660, 1180, 1180, 660, 660, 1180, 1558];
const PULSE_Y = [560, 560, 860, 860, 560, 560, 560];

type Props = {
  durationInFrames: number;
};

export const SuperpowerScene: React.FC<Props> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const pulseX = interpolate(frame, PULSE_TIMES, PULSE_X, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const pulseY = interpolate(frame, PULSE_TIMES, PULSE_Y, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  return (
    <SceneShell durationInFrames={durationInFrames} accent="violet">
      <SceneHeading
        eyebrow="El superpoder"
        title="Aristas condicionales"
        subtitle="El agente decide, actúa y vuelve a razonar."
        top={92}
        titleSize={72}
      />
      <AbsoluteFill style={{ fontFamily: FONTS.sans }}>
        <GraphNode
          x={660}
          y={560}
          width={340}
          height={140}
          label="Razonar"
          badge="LLM"
          fontSize={32}
          appearAt={10}
        />
        <DiamondNode
          x={1180}
          y={560}
          width={320}
          height={200}
          lines={["¿Necesita", "herramienta?"]}
          appearAt={18}
        />
        <GraphNode
          x={1180}
          y={860}
          width={340}
          height={140}
          label="Herramienta"
          badge="TOOL"
          accent="violet"
          fontSize={30}
          appearAt={30}
        />
        <GraphNode
          x={1680}
          y={560}
          width={210}
          height={90}
          label="Fin"
          fontSize={34}
          appearAt={40}
        />

        <ArrowEdge
          d="M 834 560 L 1012 560"
          head={{ x: 1016, y: 560, angle: 0 }}
          progress={interpolate(frame, [19, 43], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}
        />
        <ArrowEdge
          d="M 1180 664 L 1180 786"
          accent="violet"
          head={{ x: 1180, y: 790, angle: 90 }}
          progress={interpolate(frame, [26, 50], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}
        />
        <ArrowEdge
          d="M 1010 860 L 720 860 Q 660 860 660 800 L 660 636"
          accent="violet"
          head={{ x: 660, y: 636, angle: -90 }}
          progress={interpolate(frame, [33, 60], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}
        />
        <ArrowEdge
          d="M 1340 560 L 1568 560"
          head={{ x: 1572, y: 560, angle: 0 }}
          progress={interpolate(frame, [39, 63], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}
        />

        <div
          style={{
            position: "absolute",
            left: 1204,
            top: 698,
            fontFamily: FONTS.sans,
            fontSize: 26,
            fontWeight: 600,
            color: COLORS.violet,
            opacity: interpolate(frame, [38, 50], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Sí
        </div>
        <div
          style={{
            position: "absolute",
            left: 1438,
            top: 504,
            fontFamily: FONTS.sans,
            fontSize: 26,
            fontWeight: 600,
            color: COLORS.teal,
            opacity: interpolate(frame, [45, 57], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          No
        </div>
        <div
          style={{
            position: "absolute",
            left: 715,
            top: 818,
            width: 250,
            textAlign: "center",
            fontFamily: FONTS.mono,
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: 1,
            color: COLORS.muted,
            opacity: interpolate(frame, [46, 58], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          vuelve a razonar
        </div>

        <div
          style={{
            position: "absolute",
            left: pulseX - 15,
            top: pulseY - 15,
            width: 30,
            height: 30,
            borderRadius: "50%",
            backgroundImage: `radial-gradient(circle at 35% 30%, ${COLORS.text} 0%, ${COLORS.tealSoft} 35%, ${COLORS.teal} 100%)`,
            boxShadow: `0 0 26px ${COLORS.teal}, 0 0 60px ${COLORS.tealGlow}`,
            opacity: interpolate(frame, [43, 50, 161, 173], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            zIndex: 2,
          }}
        />
      </AbsoluteFill>
    </SceneShell>
  );
};
