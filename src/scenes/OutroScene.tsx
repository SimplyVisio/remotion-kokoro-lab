import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SceneShell } from "../components/SceneShell";
import { COLORS, FONTS } from "../theme";

type Props = {
  durationInFrames: number;
};

export const OutroScene: React.FC<Props> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineOne = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 140 },
    durationInFrames: 12,
  });
  const lineTwo = spring({
    frame: frame - 1,
    fps,
    config: { damping: 200, stiffness: 140 },
    durationInFrames: 12,
  });
  const codeIn = spring({
    frame: frame - 2,
    fps,
    config: { damping: 200, stiffness: 140 },
    durationInFrames: 12,
  });

  return (
    <SceneShell durationInFrames={durationInFrames} accent="teal">
      <AbsoluteFill style={{ fontFamily: FONTS.sans }}>
        <div
          style={{
            position: "absolute",
            top: 316,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: COLORS.teal,
            opacity: interpolate(frame, [0, 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Empieza hoy
        </div>

        <div
          style={{
            position: "absolute",
            top: 362,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1.12,
            color: COLORS.text,
            opacity: lineOne,
            translate: interpolate(lineOne, [0, 1], ["0px 28px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Construye agentes
        </div>
        <div
          style={{
            position: "absolute",
            top: 466,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1.12,
            backgroundImage: `linear-gradient(100deg, ${COLORS.tealSoft} 0%, ${COLORS.violet} 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            opacity: lineTwo,
            translate: interpolate(lineTwo, [0, 1], ["0px 28px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            filter: `drop-shadow(0 0 34px ${COLORS.tealGlow})`,
          }}
        >
          que razonan en bucle
        </div>

        <div
          style={{
            position: "absolute",
            top: 604,
            left: "50%",
            width: 240,
            height: 3,
            translate: "-50% 0",
            borderRadius: 2,
            backgroundImage: `linear-gradient(90deg, transparent, ${COLORS.teal}, ${COLORS.violet}, transparent)`,
            scale: `${interpolate(lineTwo, [0.2, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })} 1`,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 654,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: codeIn,
            scale: interpolate(codeIn, [0, 1], [0.9, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              output: "perceptual-scale",
            }),
            translate: interpolate(codeIn, [0, 1], ["0px 22px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              height: 118,
              padding: "0 46px",
              borderRadius: 22,
              border: `1px solid ${COLORS.tealLine}`,
              backgroundImage: `linear-gradient(180deg, ${COLORS.surfaceRaised} 0%, ${COLORS.surface} 100%)`,
              boxShadow: `0 20px 60px rgba(0, 0, 0, 0.45), 0 0 54px ${COLORS.tealGlow}, inset 0 1px 0 rgba(255, 255, 255, 0.06)`,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 40,
                fontWeight: 700,
                color: COLORS.teal,
              }}
            >
              $
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 40,
                fontWeight: 500,
                color: COLORS.text,
                letterSpacing: 0.5,
              }}
            >
              pip install langgraph
            </span>
            <span
              style={{
                width: 3,
                height: 44,
                borderRadius: 1,
                backgroundColor: COLORS.teal,
                opacity: interpolate(
                  frame % 28,
                  [0, 13, 14, 27],
                  [1, 1, 0.15, 0.15],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                ),
              }}
            />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 830,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 28,
            color: COLORS.muted,
            opacity: interpolate(frame, [4, 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Estado, nodos y aristas. Todo en un mismo grafo.
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
