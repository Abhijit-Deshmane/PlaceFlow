import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

interface PlaceFlowIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

/**
 * PlaceFlow geometric circuit 'P' icon mark.
 */
export function PlaceFlowIcon({
  size = 48,
  color = "#1E3A5F",
  style,
}: PlaceFlowIconProps) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
      >
        {/* Outer Hexagonal / Circuit 'P' outline */}
        <Path
          d="M 38 14 L 66 14 L 84 32 L 84 48 L 68 64 L 46 64 L 46 86 L 24 94 L 24 38 L 38 14 Z"
          stroke={color}
          strokeWidth="6"
          strokeLinejoin="miter"
          strokeLinecap="round"
        />

        {/* Inner loop & connector stem */}
        <Path
          d="M 46 44 C 46 32 54 28 66 28 C 72 28 76 34 76 40 C 76 46 70 52 62 52 L 46 52"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M 46 52 L 24 94"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Circuit Nodes (Dots) */}
        {/* Top edge node */}
        <Circle cx="38" cy="14" r="7" fill={color} />
        {/* Right perimeter node */}
        <Circle cx="84" cy="40" r="7" fill={color} />
        {/* Inner loop node */}
        <Circle cx="64" cy="38" r="6" fill={color} />
        {/* Lower left node */}
        <Circle cx="16" cy="62" r="7" fill={color} />
      </Svg>
    </View>
  );
}

interface PlaceFlowLogoProps {
  size?: number;
  orientation?: "vertical" | "horizontal";
  color?: string;
  textColor?: string;
  style?: ViewStyle;
}

/**
 * PlaceFlow brand logo component (Icon + Wordmark)
 */
export function PlaceFlowLogo({
  size = 52,
  orientation = "vertical",
  color = "#1E3A5F",
  textColor = "#1E3A5F",
  style,
}: PlaceFlowLogoProps) {
  if (orientation === "horizontal") {
    return (
      <View style={[styles.horizontalContainer, style]}>
        <PlaceFlowIcon size={size} color={color} />
        <Text style={[styles.horizontalText, { color: textColor, fontSize: size * 0.55 }]}>
          PlaceFlow
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.verticalContainer, style]}>
      <PlaceFlowIcon size={size} color={color} />
      <Text style={[styles.verticalText, { color: textColor }]}>PlaceFlow</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  verticalContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  verticalText: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginTop: 8,
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  horizontalText: {
    fontWeight: "800",
    letterSpacing: -0.5,
  },
});
