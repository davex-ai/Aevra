import React from "react";
import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await import("@/lib/firebase").then(({ auth }) => auth.signOut());
      router.replace("/login");
    } catch (err) {
      console.error(err);
      Alert.alert("Logout failed", "Please try again.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-black px-6 pt-8">
      <Text className="text-white text-2xl font-bold mb-6">Your Profile</Text>

      {/* User Info */}
      <View className="bg-white/10 p-4 rounded-xl mb-4 flex-row justify-between items-center">
        <View>
          <Text className="text-white font-semibold">Name</Text>
          <Text className="text-gray-300">{user?.displayName || "N/A"}</Text>
        </View>
        <MaterialIcons
          name="edit"
          size={24}
          color="white"
          onPress={() => Alert.alert("Edit Name", "Edit feature coming soon!")}
        />
      </View>

      <View className="bg-white/10 p-4 rounded-xl mb-4 flex-row justify-between items-center">
        <View>
          <Text className="text-white font-semibold">Email</Text>
          <Text className="text-gray-300">{user?.email || "N/A"}</Text>
        </View>
        <MaterialIcons
          name="edit"
          size={24}
          color="white"
          onPress={() => Alert.alert("Edit Email", "Edit feature coming soon!")}
        />
      </View>

      {/* Order Status */}
      <View className="bg-white/10 p-4 rounded-xl mb-4">
        <Text className="text-white font-semibold mb-2">Order Status</Text>
        <Text className="text-gray-300">You have no active orders.</Text>
      </View>

      {/* Logout Button */}
      <Pressable
        onPress={handleLogout}
        className="bg-white rounded-xl py-4 mt-6 items-center"
      >
        <Text className="text-black font-bold">Logout</Text>
      </Pressable>
    </ScrollView>
  );
}
