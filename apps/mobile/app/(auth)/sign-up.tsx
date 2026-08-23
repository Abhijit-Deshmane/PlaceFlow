import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError(null);

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred during sign up.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError(null);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/(tabs)");
      } else {
        setError("Verification was not completed. Please try again.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred during verification.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#09090b" }}>
      <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24 }}>
        <View style={{ marginBottom: 32, alignItems: "center" }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: "#4f46e5",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>
              P
            </Text>
          </View>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#f4f4f5" }}>
            Create PlaceFlow Account
          </Text>
          <Text style={{ fontSize: 14, color: "#a1a1aa", marginTop: 4 }}>
            Join your campus placement network
          </Text>
        </View>

        {error && (
          <View
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              borderWidth: 1,
              borderColor: "rgba(239, 68, 68, 0.3)",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: "#f87171", fontSize: 13 }}>{error}</Text>
          </View>
        )}

        {!pendingVerification ? (
          <>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: "500", color: "#d4d4d8", marginBottom: 6 }}>
                Email Address
              </Text>
              <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="student@college.edu"
                placeholderTextColor="#71717a"
                onChangeText={setEmailAddress}
                style={{
                  backgroundColor: "#18181b",
                  borderWidth: 1,
                  borderColor: "#27272a",
                  borderRadius: 8,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  color: "#f4f4f5",
                  fontSize: 15,
                }}
              />
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 13, fontWeight: "500", color: "#d4d4d8", marginBottom: 6 }}>
                Password
              </Text>
              <TextInput
                value={password}
                placeholder="••••••••"
                placeholderTextColor="#71717a"
                secureTextEntry
                onChangeText={setPassword}
                style={{
                  backgroundColor: "#18181b",
                  borderWidth: 1,
                  borderColor: "#27272a",
                  borderRadius: 8,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  color: "#f4f4f5",
                  fontSize: 15,
                }}
              />
            </View>

            <TouchableOpacity
              onPress={onSignUpPress}
              disabled={loading || !isLoaded}
              style={{
                backgroundColor: "#4f46e5",
                borderRadius: 8,
                paddingVertical: 14,
                alignItems: "center",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>
                  Sign Up
                </Text>
              )}
            </TouchableOpacity>

            <View style={{ marginTop: 24, flexDirection: "row", justifyContent: "center" }}>
              <Text style={{ color: "#a1a1aa", fontSize: 14 }}>
                Already have an account?{" "}
              </Text>
              <Link href="/(auth)/sign-in" asChild>
                <TouchableOpacity>
                  <Text style={{ color: "#818cf8", fontSize: 14, fontWeight: "600" }}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </>
        ) : (
          <>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: "500", color: "#d4d4d8", marginBottom: 6 }}>
                Verification Code
              </Text>
              <TextInput
                value={code}
                placeholder="Enter 6-digit code"
                placeholderTextColor="#71717a"
                keyboardType="numeric"
                onChangeText={setCode}
                style={{
                  backgroundColor: "#18181b",
                  borderWidth: 1,
                  borderColor: "#27272a",
                  borderRadius: 8,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  color: "#f4f4f5",
                  fontSize: 15,
                }}
              />
            </View>

            <TouchableOpacity
              onPress={onPressVerify}
              disabled={loading || !isLoaded}
              style={{
                backgroundColor: "#4f46e5",
                borderRadius: 8,
                paddingVertical: 14,
                alignItems: "center",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>
                  Verify Email
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
