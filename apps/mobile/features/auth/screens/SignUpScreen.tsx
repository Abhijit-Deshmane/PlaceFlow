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
import { useSignUp } from "@clerk/expo/legacy";
import { useRouter, Link } from "expo-router";
import {
  User,
  IdCard,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react-native";
import { PlaceFlowIcon } from "@/components/shared/PlaceFlowLogo";
import { AuthInput } from "../components/AuthInput";
import { neutral, brand } from "@/constants/theme";
import type { SignUpFormData, SignUpFormErrors } from "../types";

export function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: "",
    universityId: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<SignUpFormErrors>({});

  // Verification State
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: SignUpFormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.universityId.trim()) {
      newErrors.universityId = "University ID is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "College email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!isLoaded) return;
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      // Split full name into first and last name
      const nameParts = formData.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      await signUp.create({
        emailAddress: formData.email.trim(),
        password: formData.password,
        firstName,
        lastName,
        unsafeMetadata: {
          universityId: formData.universityId.trim().toUpperCase(),
          fullName: formData.fullName.trim(),
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred while creating your account.";
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;
    if (!verificationCode.trim()) {
      setErrors({ general: "Please enter the verification code" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode.trim(),
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/(tabs)");
      } else {
        setErrors({
          general: "Verification incomplete. Please try again or check the code.",
        });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Verification failed. Please check the code.";
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded) return;
    setResending(true);
    setResendSuccess(false);
    setErrors({});

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setResendSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to resend verification code.";
      setErrors({ general: message });
    } finally {
      setResending(false);
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
            <Text style={styles.pageTitle}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join PlaceFlow to kickstart your career journey.
            </Text>
          </View>

          {/* Error Banner */}
          {errors.general && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errors.general}</Text>
            </View>
          )}

          {!pendingVerification ? (
            /* Main Form Card */
            <View style={styles.card}>
              <View nativeID="clerk-captcha" />
              {/* Full Name */}
              <AuthInput
                label="Full Name"
                placeholder="Jane Doe"
                value={formData.fullName}
                autoCapitalize="words"
                autoCorrect={false}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, fullName: text }));
                  if (errors.fullName) {
                    setErrors((prev) => ({ ...prev, fullName: undefined }));
                  }
                }}
                leftIcon={<User size={18} color="#716E68" />}
                error={errors.fullName}
              />

              {/* University ID */}
              <AuthInput
                label="University ID"
                placeholder="e.g. 2023CS015"
                value={formData.universityId}
                autoCapitalize="characters"
                autoCorrect={false}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, universityId: text }));
                  if (errors.universityId) {
                    setErrors((prev) => ({ ...prev, universityId: undefined }));
                  }
                }}
                leftIcon={<IdCard size={18} color="#716E68" />}
                error={errors.universityId}
              />

              {/* College Email */}
              <AuthInput
                label="College Email"
                placeholder="jane.doe@college.edu"
                value={formData.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, email: text }));
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                leftIcon={<Mail size={18} color="#716E68" />}
                error={errors.email}
              />

              {/* Password */}
              <AuthInput
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, password: text }));
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }
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
                helperText="Must be at least 8 characters long."
                error={errors.password}
                containerStyle={{ marginBottom: 24 }}
              />

              {/* Primary Action Button */}
              <TouchableOpacity
                onPress={handleSignUp}
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
                    <Text style={styles.buttonText}>Sign Up</Text>
                    <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            /* OTP Verification Sub-Card */
            <View style={styles.card}>
              <View style={styles.verificationHeader}>
                <View style={styles.verificationIconBadge}>
                  <ShieldCheck size={32} color="#0B2545" />
                </View>
                <Text style={styles.verificationTitle}>Verify Your Email</Text>
                <Text style={styles.verificationSubtitle}>
                  We sent a 6-digit verification code to{"\n"}
                  <Text style={styles.verificationEmailHighlight}>
                    {formData.email}
                  </Text>
                </Text>
              </View>

              {resendSuccess && (
                <View style={styles.successBanner}>
                  <Text style={styles.successBannerText}>
                    A new verification code has been sent!
                  </Text>
                </View>
              )}

              <AuthInput
                label="Verification Code"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
                onChangeText={(text) => {
                  setVerificationCode(text);
                  if (errors.general) {
                    setErrors({});
                  }
                }}
                leftIcon={<ShieldCheck size={18} color="#716E68" />}
                containerStyle={{ marginBottom: 20 }}
              />

              <TouchableOpacity
                onPress={handleVerify}
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
                    <Text style={styles.buttonText}>Verify Email</Text>
                    <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.resendContainer}>
                <TouchableOpacity
                  onPress={handleResendCode}
                  disabled={resending}
                  activeOpacity={0.7}
                  style={styles.resendButton}
                >
                  <RotateCcw size={14} color="#0B2545" />
                  <Text style={styles.resendText}>
                    {resending ? "Sending..." : "Resend Code"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPendingVerification(false)}
                  activeOpacity={0.7}
                  style={styles.backButton}
                >
                  <Text style={styles.backButtonText}>Change Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Footer Section */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.signInLink}>Sign in</Text>
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
  verificationHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  verificationIconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E8EEF5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  verificationTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0B2545",
    marginBottom: 6,
  },
  verificationSubtitle: {
    fontSize: 14,
    color: "#6F6C66",
    textAlign: "center",
    lineHeight: 20,
  },
  verificationEmailHighlight: {
    fontWeight: "700",
    color: "#0B2545",
  },
  successBanner: {
    backgroundColor: "#E5F5EC",
    borderWidth: 1,
    borderColor: "rgba(30, 142, 90, 0.25)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  successBannerText: {
    color: "#1E8E5A",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
    paddingHorizontal: 4,
  },
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resendText: {
    color: "#0B2545",
    fontSize: 13,
    fontWeight: "600",
  },
  backButton: {
    paddingVertical: 4,
  },
  backButtonText: {
    color: "#6F6C66",
    fontSize: 13,
    fontWeight: "500",
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
  signInLink: {
    fontSize: 14,
    color: "#0B2545",
    fontWeight: "700",
  },
});
