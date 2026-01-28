import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 bg-black px-6 justify-center">
      <Text className="text-white text-2xl font-bold mb-6">
        Welcome back
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        className="bg-white/10 text-white rounded-xl px-4 py-3 mb-4"
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        className="bg-white/10 text-white rounded-xl px-4 py-3 mb-6"
        onChangeText={setPassword}
      />

      <Pressable
        onPress={handleLogin}
        className="bg-white rounded-xl py-4"
      >
        <Text className="text-black text-center font-bold">
          Login
        </Text>
      </Pressable>
    </View>
  );
}
