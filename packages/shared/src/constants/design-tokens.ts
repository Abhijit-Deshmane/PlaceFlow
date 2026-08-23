/**
 * PlaceFlow Design Tokens — v1.0
 *
 * Source: PlaceFlow Design System artifact (Training & Placement Management System)
 * "A warm-neutral foundation with a confident navy accent and a full semantic
 *  status language for placement pipelines."
 *
 * Platform-agnostic TypeScript constants.
 * - Web  → globals.css (Tailwind v4 @theme)
 * - Mobile → constants/theme.ts (NativeWind + StyleSheet)
 *
 * @packageDocumentation
 */

// ---------------------------------------------------------------------------
// 01 · Neutrals  (warm, parchment-toned)
// ---------------------------------------------------------------------------

/** Named neutral surface tokens — use these aliases in components */
export const COLOR_NEUTRAL = {
  /** Page / canvas background */
  bgCanvas:   "#F5F3EF",
  /** Default card background */
  bgCard:     "#FBFAF8",
  /** Alternate card / section background */
  bgCardAlt:  "#EFEDE8",
  /** Subtle border / divider */
  borderSubtle: "#E4E1DA",
  /** Primary text — warm near-black */
  textPrimary:  "#1C1B19",
  /** Secondary text — warm medium gray */
  textSecondary: "#6F6C66",
} as const;

// ---------------------------------------------------------------------------
// 02 · Brand Accent  (dark confident navy)
// ---------------------------------------------------------------------------

export const COLOR_BRAND = {
  /** Primary — dark navy */
  primary:      "#1E3A5F",
  /** Hover / pressed state */
  primaryHover: "#16293F",
  /** Tint — very light blue wash */
  tint:         "#E8EEF5",
} as const;

// ---------------------------------------------------------------------------
// 03 · Semantic — Placement Status
// ---------------------------------------------------------------------------

/** Semantic status colors aligned to the placement pipeline lifecycle */
export const COLOR_STATUS = {
  placed: {
    DEFAULT: "#1E8E5A",
    tint:    "#E5F5EC",
  },
  inProcess: {
    DEFAULT: "#C77D14",
    tint:    "#FBF0DF",
  },
  applied: {
    DEFAULT: "#3B6FA8",
    tint:    "#E8F0F8",
  },
  notEligible: {
    DEFAULT: "#C43D3D",
    tint:    "#FBEAEA",
  },
  draft: {
    DEFAULT: "#8A8680",
    tint:    "#EFEDE8",
  },
} as const;

export type PlacementStatus = keyof typeof COLOR_STATUS;

/** Convenience map: status → foreground color */
export const STATUS_COLORS: Record<PlacementStatus, string> = {
  placed:      COLOR_STATUS.placed.DEFAULT,
  inProcess:   COLOR_STATUS.inProcess.DEFAULT,
  applied:     COLOR_STATUS.applied.DEFAULT,
  notEligible: COLOR_STATUS.notEligible.DEFAULT,
  draft:       COLOR_STATUS.draft.DEFAULT,
} as const;

/** Convenience map: status → tint (background) color */
export const STATUS_TINTS: Record<PlacementStatus, string> = {
  placed:      COLOR_STATUS.placed.tint,
  inProcess:   COLOR_STATUS.inProcess.tint,
  applied:     COLOR_STATUS.applied.tint,
  notEligible: COLOR_STATUS.notEligible.tint,
  draft:       COLOR_STATUS.draft.tint,
} as const;

// ---------------------------------------------------------------------------
// 04 · Typography — Inter
// ---------------------------------------------------------------------------

export const FONT_FAMILY = {
  sans: "Inter",
} as const;

/**
 * Typography scale from design system:
 * Display · 32 / 800
 * H1      · 22 / 700
 * H2      · 17 / 600
 * Body    · 15 / 400
 * Metric  · 26 / 800
 * Caption · 13 / 400
 */
export const FONT_SIZE = {
  caption: 13,
  sm:      14,
  body:    15,
  h2:      17,
  h1:      22,
  metric:  26,
  display: 32,
} as const;

export const FONT_WEIGHT = {
  regular:  "400",
  semibold: "600",
  bold:     "700",
  heavy:    "800",
} as const;

export const LINE_HEIGHT = {
  tight:   1.2,
  snug:    1.35,
  normal:  1.5,
  relaxed: 1.6,
} as const;

// ---------------------------------------------------------------------------
// Spacing  (4 px base unit)
// ---------------------------------------------------------------------------

export const SPACING = {
  0:  0,
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  7:  28,
  8:  32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

// ---------------------------------------------------------------------------
// Border Radius
// ---------------------------------------------------------------------------

export const BORDER_RADIUS = {
  none:  0,
  sm:    4,
  md:    8,
  lg:    12,
  xl:    16,
  "2xl": 24,
  full:  9999,
} as const;
