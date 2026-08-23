/**
 * PlaceFlow Mobile Theme — v1.0
 *
 * "A warm-neutral foundation with a confident navy accent and a full
 *  semantic status language for placement pipelines."
 *
 * Tokens mirror the web globals.css 1-to-1 for cross-platform consistency.
 * Use:
 *   - NativeWind className props  → via tailwind.config.js
 *   - StyleSheet.create()         → import { semantic, elevation, … } from "@/constants"
 *   - Programmatic style logic    → import { colors, STATUS_COLORS } from "@/constants"
 */

// ---------------------------------------------------------------------------
// 01 · Neutrals (warm, parchment-toned)
// ---------------------------------------------------------------------------

export const neutral = {
  bgCanvas:      "#F5F3EF", // page / screen background
  bgCard:        "#FBFAF8", // default card / surface
  bgCardAlt:     "#EFEDE8", // alternate section
  borderSubtle:  "#E4E1DA", // dividers, borders
  textPrimary:   "#1C1B19", // near-black, warm
  textSecondary: "#6F6C66", // medium warm gray
  textTertiary:  "#9E9B97", // faint text
  textDisabled:  "#B8B5B1",
  textInverse:   "#FBFAF8",
  textOnBrand:   "#FFFFFF",
} as const;

// ---------------------------------------------------------------------------
// 02 · Brand Accent (confident dark navy)
// ---------------------------------------------------------------------------

export const brand = {
  primary:       "#1E3A5F",
  primaryHover:  "#16293F",
  tint:          "#E8EEF5",
} as const;

// ---------------------------------------------------------------------------
// 03 · Semantic — Placement Status
// ---------------------------------------------------------------------------

export const status = {
  placed: {
    color: "#1E8E5A",
    tint:  "#E5F5EC",
  },
  inProcess: {
    color: "#C77D14",
    tint:  "#FBF0DF",
  },
  applied: {
    color: "#3B6FA8",
    tint:  "#E8F0F8",
  },
  notEligible: {
    color: "#C43D3D",
    tint:  "#FBEAEA",
  },
  draft: {
    color: "#8A8680",
    tint:  "#EFEDE8",
  },
} as const;

export type PlacementStatus = keyof typeof status;

/** Quick access: status key → foreground color */
export const STATUS_COLORS: Record<PlacementStatus, string> = {
  placed:      status.placed.color,
  inProcess:   status.inProcess.color,
  applied:     status.applied.color,
  notEligible: status.notEligible.color,
  draft:       status.draft.color,
} as const;

/** Quick access: status key → tint (background) color */
export const STATUS_TINTS: Record<PlacementStatus, string> = {
  placed:      status.placed.tint,
  inProcess:   status.inProcess.tint,
  applied:     status.applied.tint,
  notEligible: status.notEligible.tint,
  draft:       status.draft.tint,
} as const;

// ---------------------------------------------------------------------------
// 04 · Typography — Inter
//
// Scale (from design system):
//   Display · 32 / 800
//   H1      · 22 / 700
//   H2      · 17 / 600
//   Body    · 15 / 400
//   Metric  · 26 / 800
//   Caption · 13 / 400
// ---------------------------------------------------------------------------

export const typography = {
  fontFamily: { sans: "Inter" },

  /** Design system–defined sizes (px) */
  fontSize: {
    caption: 13,
    sm:      14,
    body:    15,
    h2:      17,
    base:    16, // fallback
    h1:      22,
    metric:  26,
    display: 32,
  },

  fontWeight: {
    regular:  "400" as const,
    semibold: "600" as const,
    bold:     "700" as const,
    heavy:    "800" as const,
  },

  lineHeight: {
    tight:   1.2,
    snug:    1.35,
    normal:  1.5,
    relaxed: 1.6,
  },
} as const;

/**
 * Pre-built type style objects — drop into StyleSheet or Text style props.
 *
 * @example
 * <Text style={typeStyles.display}>Work smarter, place faster</Text>
 */
export const typeStyles = {
  display: {
    fontFamily:  "Inter",
    fontSize:    32,
    fontWeight:  "800" as const,
    lineHeight:  38,
    color:       neutral.textPrimary,
    letterSpacing: -0.5,
  },
  h1: {
    fontFamily:  "Inter",
    fontSize:    22,
    fontWeight:  "700" as const,
    lineHeight:  30,
    color:       neutral.textPrimary,
  },
  h2: {
    fontFamily:  "Inter",
    fontSize:    17,
    fontWeight:  "600" as const,
    lineHeight:  24,
    color:       neutral.textPrimary,
  },
  body: {
    fontFamily:  "Inter",
    fontSize:    15,
    fontWeight:  "400" as const,
    lineHeight:  22,
    color:       neutral.textPrimary,
  },
  metric: {
    fontFamily:  "Inter",
    fontSize:    26,
    fontWeight:  "800" as const,
    lineHeight:  32,
    color:       neutral.textPrimary,
    letterSpacing: -0.3,
  },
  caption: {
    fontFamily:  "Inter",
    fontSize:    13,
    fontWeight:  "400" as const,
    lineHeight:  18,
    color:       neutral.textSecondary,
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing (4 px base unit)
// ---------------------------------------------------------------------------

export const spacing = {
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

export const borderRadius = {
  none: 0,
  sm:   4,
  md:   8,
  lg:   12,
  xl:   16,
  "2xl": 24,
  full: 9999,
} as const;

// ---------------------------------------------------------------------------
// Elevation (React Native shadows)
// ---------------------------------------------------------------------------

export const elevation = {
  none: {
    shadowColor:   "transparent",
    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius:  0,
    elevation: 0,
  },
  card: {
    shadowColor:   "#1C1B19",
    shadowOffset:  { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius:  3,
    elevation: 2,
  },
  hover: {
    shadowColor:   "#1C1B19",
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius:  12,
    elevation: 4,
  },
  modal: {
    shadowColor:   "#1C1B19",
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius:  24,
    elevation: 10,
  },
} as const;

// ---------------------------------------------------------------------------
// Dark Mode semantic overrides
// ---------------------------------------------------------------------------

export const semanticDark = {
  bgCanvas:      "#141310",
  bgCard:        "#1C1B18",
  bgCardAlt:     "#242320",
  borderSubtle:  "rgba(228,225,218,0.12)",
  textPrimary:   "#F0EDE8",
  textSecondary: "#9E9B97",
  textTertiary:  "#6F6C66",
  textDisabled:  "#4A4845",
  textInverse:   "#141310",
  textOnBrand:   "#FFFFFF",
  brandPrimary:      "#3B6FA8",
  brandPrimaryHover: "#2E5A8A",
  brandTint:         "rgba(59,111,168,0.15)",
} as const;

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export const layout = {
  screenHorizontalPadding: 16,
  tabBarHeight:            64,
  headerHeight:            56,
  cardPadding:             20,
  listItemHeight:          72,
  maxContentWidth:         480,
} as const;

// ---------------------------------------------------------------------------
// Full theme export
// ---------------------------------------------------------------------------

export const theme = {
  neutral,
  brand,
  status,
  STATUS_COLORS,
  STATUS_TINTS,
  typography,
  typeStyles,
  spacing,
  borderRadius,
  elevation,
  semanticDark,
  layout,
} as const;

export type Theme = typeof theme;
