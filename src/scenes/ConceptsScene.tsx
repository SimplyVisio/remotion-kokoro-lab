import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ArrowEdge } from "../components/ArrowEdge";
import { ConceptPill } from "../components/ConceptPill";
import { GraphNode } from "../components/GraphNode";
import { SceneHeading } from "../components/SceneHeading";
import { SceneShell } from "../components/SceneShell";
import { COLORS, FONTS } from "../theme";

type Props = {
  durationInFrames: number;
};

export const ConceptsScene: React.FC<Props> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stateIn = spring({
    frame: frame - 144,
    fps,
    config: { damping: 200, stiffness: 140 },
    durationInFrames: 22,
  });
  const stateX = interpolate(
    frame,
    [149, 166, 170, 184, 187, 200, 203],
    [804, 1120, 1172, 1028, 892, 748, 804],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.45, 0, 0.55, 1),
    },
  );
  const stateY = interpolate(
    frame,
    [149, 166, 170, 184, 187, 200, 203],
    [550, 550, 607, 733, 731, 609, 550],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.45, 0, 0.55, 1),
    },
  );

  return (
    <SceneShell durationInFrames={durationInFrames} accent="teal">
      <SceneHeading
        eyebrow="Cómo funciona"
        title="Anatomía de un grafo"
        titleSize={68}
        top={92}
      />

      <div
        style={{
          position: "absolute",
          top: 306,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 20,
          fontFamily: FONTS.sans,
        }}
      >
        <ConceptPill
          index="01"
          label="Nodos"
          intensity={interpolate(
            frame,
            [7, 16, 75, 84],
            [0.25, 1, 1, 0.25],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )}
          appearAt={18}
        />
        <ConceptPill
          index="02"
          label="Aristas"
          intensity={interpolate(
            frame,
            [79, 88, 135, 144],
            [0.25, 1, 1, 0.25],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )}
          appearAt={26}
        />
        <ConceptPill
          index="03"
          label="Estado"
          intensity={interpolate(
            frame,
            [140, 149, 201, 210],
            [0.25, 1, 1, 0.25],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )}
          appearAt={34}
        />
      </div>

      <AbsoluteFill style={{ fontFamily: FONTS.sans }}>
        <GraphNode
          x={680}
          y={550}
          width={240}
          height={110}
          label="nodo 1"
          badge="fn"
          fontSize={30}
          appearAt={12}
        />
        <GraphNode
          x={1240}
          y={550}
          width={240}
          height={110}
          label="nodo 2"
          badge="fn"
          accent="violet"
          fontSize={30}
          appearAt={22}
        />
        <GraphNode
          x={960}
          y={790}
          width={240}
          height={110}
          label="nodo 3"
          badge="fn"
          fontSize={30}
          appearAt={32}
        />

        <ArrowEdge
          d="M 804 550 L 1116 550"
          head={{ x: 1120, y: 550, angle: 0 }}
          progress={interpolate(frame, [82, 108], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}
        />
        <ArrowEdge
          d="M 1172 607 L 1028 733"
          accent="violet"
          head={{ x: 1024, y: 735, angle: 140 }}
          progress={interpolate(frame, [89, 116], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}
        />
        <ArrowEdge
          d="M 892 731 L 748 609"
          accent="violet"
          head={{ x: 744, y: 605, angle: -140 }}
          progress={interpolate(frame, [96, 123], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}
        />

        <div
          style={{
            position: "absolute",
            left: stateX - 30,
            top: stateY - 30,
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: `1px solid ${COLORS.teal}`,
            backgroundColor: COLORS.tealGlow,
            boxShadow: `0 0 34px ${COLORS.tealGlow}, 0 0 70px ${COLORS.tealGlow}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: stateIn,
            scale: interpolate(stateIn, [0, 1], [0.5, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              output: "perceptual-scale",
            }),
            zIndex: 6,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              backgroundImage: `radial-gradient(circle at 35% 30%, ${COLORS.text} 0%, ${COLORS.tealSoft} 40%, ${COLORS.teal} 100%)`,
              boxShadow: `0 0 18px ${COLORS.teal}`,
            }}
          />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
