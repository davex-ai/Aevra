import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false); // <-- loading state

  const handleRegister = async () => {
    if (loading) return; // prevent double clicks
    setLoading(true);

    try {
      const { email, password, fullName, phone, address } = form;

      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // update auth profile
      await updateProfile(cred.user, { displayName: fullName });

      // create Firestore profile
      await setDoc(doc(db, "users", cred.user.uid), {
        fullName,
        email,
        phone,
        address,
        createdAt: new Date(),
      });

      // automatic redirect after successful registration
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Registration failed.");
    } finally {
      setLoading(false); // re-enable button
    }
  };

  return (
    <View className="flex-1 bg-black px-6 justify-center">
      <Text className="text-white text-2xl text-center bottom-24 font-bold">Welcome To Aevra</Text>
      <Text className="text-white text-2xl font-bold mb-6">Create account</Text>

      {["fullName", "email", "password", "phone", "address"].map((field) => (
        <TextInput
          key={field}
          placeholder={field}
          placeholderTextColor="#888"
          secureTextEntry={field === "password"}
          className="bg-white/10 text-white rounded-xl px-4 py-3 mb-4"
          onChangeText={(v) => setForm((p) => ({ ...p, [field]: v }))}
        />
      ))}

      <Pressable
        onPress={handleRegister}
        className={`rounded-xl py-4 mt-2 ${loading ? "bg-gray-500" : "bg-white"}`}
        disabled={loading} // <-- disable button while processing
      >
        {loading ? (
          <ActivityIndicator size="small" color="black" />
        ) : (
          <Text className="text-black text-center font-bold">Register</Text>
        )}
      </Pressable>
    </View>
  );
}
