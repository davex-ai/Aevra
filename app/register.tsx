import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const handleRegister = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { email, password, fullName, phone, address } = form;

      // 1. Create and sign in user
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Update profile
      await updateProfile(cred.user, { displayName: fullName });

      // 3. Save to Firestore
      await setDoc(doc(db, "users", cred.user.uid), {
        fullName,
        email,
        phone,
        address,
        createdAt: new Date(),
      });

      // 4. Redirect to home screen after successful registration
      router.replace("/(tabs)");
      
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black px-6 justify-center">
      <Text className="text-white text-2xl text-center bottom-24 font-bold">
        Welcome To Aevra
      </Text>
      <Text className="text-white text-2xl font-bold mb-6">Create account</Text>

      {["fullName", "email", "password", "phone", "address"].map((field) => (
        <TextInput
          key={field}
          placeholder={field}
          placeholderTextColor="#888"
          secureTextEntry={field === "password"}
          className="bg-white/10 text-white rounded-xl px-4 py-3 mb-4"
          onChangeText={(v) => setForm((p) => ({ ...p, [field]: v }))}
          value={form[field as keyof typeof form]}
        />
      ))}

      <Pressable
        onPress={handleRegister}
        className={`rounded-xl py-4 mt-2 ${loading ? "bg-gray-500" : "bg-white"}`}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="black" />
        ) : (
          <Text className="text-black text-center font-bold">Register</Text>
        )}
      </Pressable>

      <View className="mt-4 flex-row justify-center">
        <Text className="text-white">Already have an account? </Text>
        <Pressable onPress={() => router.push("/login")}>
          <Text className="text-gray-400">Login</Text>
        </Pressable>
      </View>
    </View>
  );
}