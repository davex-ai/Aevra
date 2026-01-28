import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firestore"; // we’ll add this
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

  const handleRegister = async () => {
    const { email, password, fullName, phone, address } = form;

    const cred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // update auth profile
    await updateProfile(cred.user, {
      displayName: fullName,
    });

    // create Firestore profile
    await setDoc(doc(db, "users", cred.user.uid), {
      fullName,
      email,
      phone,
      address,
      createdAt: new Date(),
    });

    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 bg-black px-6 justify-center">
      <Text className="text-white text-2xl font-bold mb-6">
        Create account
      </Text>

      {["fullName", "email", "password", "phone", "address"].map((field) => (
        <TextInput
          key={field}
          placeholder={field}
          placeholderTextColor="#888"
          secureTextEntry={field === "password"}
          className="bg-white/10 text-white rounded-xl px-4 py-3 mb-4"
          onChangeText={(v) =>
            setForm((p) => ({ ...p, [field]: v }))
          }
        />
      ))}

      <Pressable
        onPress={handleRegister}
        className="bg-white rounded-xl py-4 mt-2"
      >
        <Text className="text-black text-center font-bold">
          Register
        </Text>
      </Pressable>
    </View>
  );
}
