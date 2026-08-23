import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function DashboardScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#09090b" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Welcome Card */}
        <View
          style={{
            backgroundColor: "#18181b",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "#27272a",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 13, color: "#818cf8", fontWeight: "600", textTransform: "uppercase" }}>
            Authenticated Session
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#f4f4f5", marginTop: 4 }}>
            {user?.fullName || user?.primaryEmailAddress?.emailAddress || "Student"}
          </Text>
          <Text style={{ fontSize: 14, color: "#a1a1aa", marginTop: 2 }}>
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>

        {/* Identity & Role Info */}
        <View
          style={{
            backgroundColor: "#18181b",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "#27272a",
            marginBottom: 24,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#f4f4f5", marginBottom: 12 }}>
            Account Details
          </Text>

          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: "#71717a" }}>Clerk User ID</Text>
            <Text style={{ fontSize: 14, color: "#d4d4d8", fontFamily: "monospace", marginTop: 2 }}>
              {user?.id}
            </Text>
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: "#71717a" }}>PlaceFlow Default Role</Text>
            <Text style={{ fontSize: 14, color: "#34d399", fontWeight: "600", marginTop: 2 }}>
              STUDENT
            </Text>
          </View>

          <View>
            <Text style={{ fontSize: 12, color: "#71717a" }}>Status</Text>
            <Text style={{ fontSize: 14, color: "#60a5fa", fontWeight: "600", marginTop: 2 }}>
              ACTIVE
            </Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={handleSignOut}
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            borderWidth: 1,
            borderColor: "rgba(239, 68, 68, 0.3)",
            borderRadius: 10,
            paddingVertical: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#f87171", fontSize: 15, fontWeight: "600" }}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
