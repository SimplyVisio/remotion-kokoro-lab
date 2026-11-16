export const COLORS = {
  bg: "#0B0F1A",
  bgDeep: "#070A12",
  surface: "#101828",
  surfaceRaised: "#141E31",
  border: "rgba(148, 163, 184, 0.22)",
  borderStrong: "rgba(148, 163, 184, 0.38)",
  text: "#F8FAFC",
  textSoft: "#CBD5E1",
  muted: "#94A3B8",
  faint: "#64748B",
  teal: "#2DD4BF",
  tealSoft: "#5EEAD4",
  tealGlow: "rgba(45, 212, 191, 0.22)",
  tealLine: "rgba(45, 212, 191, 0.55)",
  violet: "#A78BFA",
  violetDeep: "#8B5CF6",
  violetGlow: "rgba(167, 139, 250, 0.22)",
  violetLine: "rgba(167, 139, 250, 0.55)",
  danger: "#FB7185",
  dangerGlow: "rgba(251, 113, 133, 0.25)",
  dangerLine: "rgba(251, 113, 133, 0.55)",
  grid: "rgba(148, 163, 184, 0.055)",
} as const;

export const ACCENTS = {
  teal: {
    solid: COLORS.teal,
    soft: COLORS.tealSoft,
    line: COLORS.tealLine,
    glow: COLORS.tealGlow,
  },
  violet: {
    solid: COLORS.violetDeep,
    soft: COLORS.violet,
    line: COLORS.violetLine,
    glow: COLORS.violetGlow,
  },
  danger: {
    solid: COLORS.danger,
    soft: COLORS.danger,
    line: COLORS.dangerLine,
    glow: COLORS.dangerGlow,
  },
} as const;

export type AccentName = keyof typeof ACCENTS;

export const FONTS = {
  sans: "'Liberation Sans', 'DejaVu Sans', 'Helvetica Neue', Arial, sans-serif",
  mono: "'JetBrains Mono', 'DejaVu Sans Mono', monospace",
} as const;

export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 900,
} as const;

export const SCENES = {
  hook: 120,
  problem: 150,
  concepts: 240,
  superpower: 210,
  persistence: 120,
  outro: 60,
} as const;

export const FADE_FRAMES = 10;
