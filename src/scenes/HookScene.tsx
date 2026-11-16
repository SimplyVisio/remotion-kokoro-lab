import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ArrowEdge } from "../components/ArrowEdge";
import { NodeDot } from "../components/NodeDot";
import { SceneShell } from "../components/SceneShell";
import { COLORS, FONTS } from "../theme";

const NODES = [
  { x: 760, y: 300, radius: 26, accent: "teal", appearAt: 4, pulseDelay: 0 },
  { x: 960, y: 236, radius: 38, accent: "violet", appearAt: 10, pulseDelay: 22 },
  { x: 1160, y: 306, radius: 26, accent: "teal", appearAt: 14, pulseDelay: 44 },
  { x: 852, y: 446, radius: 30, accent: "violet", appearAt: 20, pulseDelay: 12 },
  { x: 1070, y: 442, radius: 26, accent: "teal", appearAt: 24, pulseDelay: 34 },
] as const;

const EDGES = [
  { d: "M 790 290 L 918 249", from: 18 },
  { d: "M 777 327 L 833 416", from: 23 },
  { d: "M 919 251 L 1130 295", from: 28 },
  { d: "M 939 275 L 1055 414", from: 33 },
  { d: "M 887 445 L 1038 442", from: 38 },
  { d: "M 1142 333 L 1088 415", from: 43 },
] as const;

type Props = {
  durationInFrames: number;
};

export const HookScene: React.FC<Props> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleIn = spring({
    frame: frame - 14,
    fps,
    config: { damping: 200, stiffness: 110 },
    durationInFrames: 30,
  });
  const subtitleIn = spring({
    frame: frame - 28,
    fps,
    config: { damping: 200, stiffness: 120 },
    durationInFrames: 26,
  });

  return (
    <SceneShell durationInFrames={durationInFrames} accent="teal">
      <AbsoluteFill style={{ fontFamily: FONTS.sans }}>
        {EDGES.map((edge) => (
          <ArrowEdge
            key={edge.d}
            d={edge.d}
            progress={interpolate(frame, [edge.from, edge.from + 26], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            })}
            strokeWidth={2.5}
          />
        ))}

        {NODES.map((node) => (
          <NodeDot
            key={`${node.x}-${node.y}`}
            x={node.x}
            y={node.y}
            radius={node.radius}
            accent={node.accent}
            appearAt={node.appearAt}
            pulseDelay={node.pulseDelay}
          />
        ))}

        <div
          style={{
            position: "absolute",
            top: 540,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 168,
            lineHeight: 1.05,
            fontWeight: 700,
            letterSpacing: -6,
            opacity: titleIn,
            scale: interpolate(titleIn, [0, 1], [0.9, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              output: "perceptual-scale",
            }),
            translate: interpolate(titleIn, [0, 1], ["0px 34px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            filter: `drop-shadow(0 0 42px ${COLORS.tealGlow})`,
          }}
        >
          <span style={{ color: COLORS.text }}>Lang</span>
          <span
            style={{
              backgroundImage: `linear-gradient(100deg, ${COLORS.tealSoft} 0%, ${COLORS.violet} 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Graph
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            top: 742,
            left: "50%",
            width: 320,
            height: 4,
            translate: "-50% 0",
            borderRadius: 2,
            backgroundImage: `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.violet})`,
            boxShadow: `0 0 24px ${COLORS.tealGlow}`,
            scale: `${interpolate(titleIn, [0.4, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })} 1`,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 792,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 50,
            fontWeight: 400,
            letterSpacing: 1,
            color: COLORS.textSoft,
            opacity: subtitleIn,
            translate: interpolate(subtitleIn, [0, 1], ["0px 20px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Agentes de IA como grafos
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
