import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignIn } from "@clerk/expo/legacy";
import { useRouter, Link } from "expo-router";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react-native";
import { PlaceFlowIcon } from "@/components/shared/PlaceFlowLogo";
import { AuthInput } from "../components/AuthInput";

export function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSignInPress = async () => {
    if (!isLoaded) return;
    if (!emailAddress.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress.trim(),
        password,
      });

      if (completeSignIn.status === "complete") {
        await setActive({ session: completeSignIn.createdSessionId });
        router.replace("/(tabs)");
      } else {
        setError("Sign in requires additional verification.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred during sign in.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Brand Section */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <PlaceFlowIcon size={44} color="#0B2545" />
            </View>
            <Text style={styles.brandTitle}>PlaceFlow</Text>
            <Text style={styles.pageTitle}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to access your placement dashboard.
            </Text>
          </View>

          {/* Error Banner */}
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          {/* Form Card */}
          <View style={styles.card}>
            {/* Email Address */}
            <AuthInput
              label="College Email"
              placeholder="jane.doe@college.edu"
              value={emailAddress}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(text) => {
                setEmailAddress(text);
                if (error) setError(null);
              }}
              leftIcon={<Mail size={18} color="#716E68" />}
            />

            {/* Password */}
            <AuthInput
              label="Password"
              placeholder="••••••••"
              value={password}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError(null);
              }}
              leftIcon={<Lock size={18} color="#716E68" />}
              rightIcon={
                showPassword ? (
                  <EyeOff size={18} color="#716E68" />
                ) : (
                  <Eye size={18} color="#716E68" />
                )
              }
              onRightIconPress={() => setShowPassword((prev) => !prev)}
              containerStyle={{ marginBottom: 24 }}
            />

            {/* Primary Action Button */}
            <TouchableOpacity
              onPress={onSignInPress}
              disabled={loading || !isLoaded}
              activeOpacity={0.85}
              style={[
                styles.primaryButton,
                (loading || !isLoaded) && styles.buttonDisabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Sign In</Text>
                  <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Section */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.signUpLink}>Sign up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F3EF",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoBadge: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0B2545",
    letterSpacing: -0.4,
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0B2545",
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#6F6C66",
    textAlign: "center",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E2DC",
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: "#1C1B19",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#0B2545",
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  errorBanner: {
    backgroundColor: "#FBEAEA",
    borderWidth: 1,
    borderColor: "rgba(196, 61, 61, 0.25)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    color: "#C43D3D",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  footerText: {
    fontSize: 14,
    color: "#6F6C66",
  },
  signUpLink: {
    fontSize: 14,
    color: "#0B2545",
    fontWeight: "700",
  },
});
