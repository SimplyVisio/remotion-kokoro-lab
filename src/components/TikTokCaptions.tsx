import {createTikTokStyleCaptions, type Caption} from "@remotion/captions";
import {useMemo} from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import captionsData from "../../public/captions.json";
import {COLORS, FONTS} from "../theme";

const CAPTIONS = captionsData as Caption[];

export const TikTokCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const nowMs = (frame / fps) * 1000;

  const {pages} = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions: CAPTIONS,
        combineTokensWithinMilliseconds: 1800,
        breakOnSilenceAfterMilliseconds: 450,
      }),
    [],
  );

  const page = pages.find((candidate) => {
    const lastToken = candidate.tokens[candidate.tokens.length - 1];
    const visibleUntil = Math.min(
      candidate.startMs + candidate.durationMs,
      lastToken.toMs + 120,
    );
    return nowMs >= candidate.startMs && nowMs < visibleUntil;
  });

  if (!page) {
    return null;
  }

  const pageFrame = ((nowMs - page.startMs) / 1000) * fps;
  const enter = interpolate(pageFrame, [0, 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 90px 26px",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: 1680,
          textAlign: "center",
          fontFamily: FONTS.sans,
          fontSize: 56,
          fontWeight: 700,
          lineHeight: 1.22,
          letterSpacing: -0.5,
          opacity: enter,
          translate: `0px ${interpolate(enter, [0, 1], [10, 0])}px`,
        }}
      >
        {page.tokens.map((token, index) => {
          const active = nowMs >= token.fromMs && nowMs < token.toMs;

          return (
            <span
              key={`${token.fromMs}-${index}`}
              style={{
                whiteSpace: "pre",
                color: active ? COLORS.tealSoft : COLORS.text,
                textShadow: active
                  ? `0 2px 10px rgba(0, 0, 0, 0.9), 0 0 28px ${COLORS.tealGlow}`
                  : "0 2px 10px rgba(0, 0, 0, 0.9)",
              }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
