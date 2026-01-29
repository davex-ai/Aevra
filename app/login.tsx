import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black px-6 justify-center">
      <Text className="text-white text-2xl font-bold mb-6">Welcome back</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        className="bg-white/10 text-white rounded-xl px-4 py-3 mb-4"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        className="bg-white/10 text-white rounded-xl px-4 py-3 mb-6"
        onChangeText={setPassword}
        value={password}
      />

      <Pressable
        onPress={handleLogin}
        className={`rounded-xl py-4 ${loading ? "bg-gray-500" : "bg-white"}`}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="black" />
        ) : (
          <Text className="text-black text-center font-bold">Login</Text>
        )}
      </Pressable>

      <View className="mt-4 flex-row justify-center">
        <Text className="text-white">Don't have an account? </Text>
        <Pressable onPress={() => router.push("/register")}>
          <Text className="text-gray-400">Register</Text>
        </Pressable>
      </View>
    </View>
  );
}