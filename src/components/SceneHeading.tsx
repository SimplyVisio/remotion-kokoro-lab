import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS } from "../theme";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  titleSize?: number;
  subtitleSize?: number;
  top?: number;
};

export const SceneHeading: React.FC<Props> = ({
  eyebrow,
  title,
  subtitle,
  titleSize = 76,
  subtitleSize = 40,
  top = 104,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleIn = spring({
    frame: frame - 8,
    fps,
    config: { damping: 200, stiffness: 110 },
    durationInFrames: 28,
  });

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "0 90px",
        fontFamily: FONTS.sans,
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: 8,
          textTransform: "uppercase",
          color: COLORS.teal,
          opacity: interpolate(frame, [4, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(frame, [4, 18], ["0px 12px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          marginTop: 18,
          fontSize: titleSize,
          lineHeight: 1.08,
          fontWeight: 700,
          letterSpacing: -1.5,
          color: COLORS.text,
          opacity: titleIn,
          translate: interpolate(titleIn, [0, 1], ["0px 30px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            marginTop: 16,
            fontSize: subtitleSize,
            lineHeight: 1.3,
            color: COLORS.muted,
            opacity: interpolate(frame, [24, 40], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            translate: interpolate(frame, [24, 40], ["0px 16px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
};
