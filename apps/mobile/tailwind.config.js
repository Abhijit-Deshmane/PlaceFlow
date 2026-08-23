/** @type {import('tailwindcss').Config} */

/**
 * PlaceFlow Mobile — NativeWind / Tailwind v3 Config  (v1.0)
 *
 * "A warm-neutral foundation with a confident navy accent and a full semantic
 *  status language for placement pipelines."
 *
 * Uses NativeWind v4 (Tailwind v3 config syntax).
 * All tokens mirror web globals.css exactly.
 *
 * Usage:
 *   <View className="bg-canvas p-4">
 *   <Text className="text-primary text-body font-semibold">
 *   <Pressable className="bg-brand active:bg-brand-hover rounded-full">
 *   <View className="bg-placed-tint"><Text className="text-placed">Placed</Text></View>
 */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // -----------------------------------------------------------------------
      // Colors
      // -----------------------------------------------------------------------
      colors: {
        // ── 01 · Neutrals (warm, parchment-toned) ──────────────────────────
        canvas:       "#F5F3EF",  // page / screen background
        card:         "#FBFAF8",  // default card / surface
        "card-alt":   "#EFEDE8",  // alternate section

        // Text
        primary:      "#1C1B19",  // near-black warm
        secondary:    "#6F6C66",  // medium warm gray
        tertiary:     "#9E9B97",  // faint
        disabled:     "#B8B5B1",
        inverse:      "#FBFAF8",
        "on-brand":   "#FFFFFF",

        // Borders
        border:             "#E4E1DA",
        "border-strong":    "#B8B5B1",

        // ── 02 · Brand Accent (confident dark navy) ─────────────────────────
        brand:              "#1E3A5F",
        "brand-hover":      "#16293F",
        "brand-tint":       "#E8EEF5",

        // ── 03 · Semantic — Placement Status ────────────────────────────────
        // Foreground colors
        placed:       "#1E8E5A",
        "in-process": "#C77D14",
        applied:      "#3B6FA8",
        "not-eligible": "#C43D3D",
        draft:        "#8A8680",

        // Tint (background) colors
        "placed-tint":       "#E5F5EC",
        "in-process-tint":   "#FBF0DF",
        "applied-tint":      "#E8F0F8",
        "not-eligible-tint": "#FBEAEA",
        "draft-tint":        "#EFEDE8",
      },

      // -----------------------------------------------------------------------
      // Typography — Inter
      // -----------------------------------------------------------------------
      fontFamily: {
        sans: ["Inter", "System"],
      },

      /**
       * Design system type scale:
       *   caption  13 / 400
       *   body     15 / 400
       *   h2       17 / 600
       *   h1       22 / 700
       *   metric   26 / 800
       *   display  32 / 800
       */
      fontSize: {
        caption: ["13px", { lineHeight: "18px" }],
        sm:      ["14px", { lineHeight: "20px" }],
        body:    ["15px", { lineHeight: "22px" }],
        base:    ["16px", { lineHeight: "24px" }],
        h2:      ["17px", { lineHeight: "24px" }],
        xl:      ["20px", { lineHeight: "28px" }],
        h1:      ["22px", { lineHeight: "30px" }],
        metric:  ["26px", { lineHeight: "32px" }],
        display: ["32px", { lineHeight: "38px" }],
      },

      fontWeight: {
        regular:  "400",
        semibold: "600",
        bold:     "700",
        heavy:    "800",
      },

      // -----------------------------------------------------------------------
      // Spacing (4 px base unit)
      // -----------------------------------------------------------------------
      spacing: {
        0:  "0px",
        1:  "4px",
        2:  "8px",
        3:  "12px",
        4:  "16px",
        5:  "20px",
        6:  "24px",
        7:  "28px",
        8:  "32px",
        10: "40px",
        12: "48px",
        16: "64px",
        20: "80px",
        24: "96px",
      },

      // -----------------------------------------------------------------------
      // Border Radius
      // -----------------------------------------------------------------------
      borderRadius: {
        none:    "0px",
        sm:      "4px",
        md:      "8px",
        DEFAULT: "8px",
        lg:      "12px",
        xl:      "16px",
        "2xl":   "24px",
        full:    "9999px",
      },

      // -----------------------------------------------------------------------
      // Sizing helpers
      // -----------------------------------------------------------------------
      height: {
        "tab-bar": "64px",
        header:    "56px",
        "btn-sm":  "32px",
        "btn-md":  "40px",
        "btn-lg":  "48px",
        badge:     "26px",
      },
    },
  },
  plugins: [],
};
