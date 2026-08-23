import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError(null);

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
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
            Sign in to PlaceFlow
          </Text>
          <Text style={{ fontSize: 14, color: "#a1a1aa", marginTop: 4 }}>
            Access campus recruitment and drives
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
          onPress={onSignInPress}
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
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ marginTop: 24, flexDirection: "row", justifyContent: "center" }}>
          <Text style={{ color: "#a1a1aa", fontSize: 14 }}>
            Don&apos;t have an account?{" "}
          </Text>
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity>
              <Text style={{ color: "#818cf8", fontSize: 14, fontWeight: "600" }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
