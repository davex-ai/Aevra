import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { Stack, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { collection, getDocs, orderBy, query, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SafeAreaView } from "react-native-safe-area-context";

interface Order {
  id: string;
  products: { id: number; title: string; quantity: number; price: number }[];
  total: number;
  status: string;
  createdAt: any;
  shipping?: { name: string; phone: string; address: string };
}

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [editingName, setEditingName] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  const [nameInput, setNameInput] = useState(user?.displayName || "");
  const [phoneInput, setPhoneInput] = useState("");
  const [addressInput, setAddressInput] = useState("");
  
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const q = query(
          collection(db, "orders", user.uid, "userOrders"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const fetched: Order[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Order));
        setOrders(fetched);
        
        if (fetched.length > 0) {
          const lastShipping = fetched[0].shipping;
          if (lastShipping) {
            setNameInput(lastShipping.name);
            setPhoneInput(lastShipping.phone);
            setAddressInput(lastShipping.address);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleLogout = async () => {
    try {
      await import("@/lib/firebase").then(({ auth }) => auth.signOut());
      router.replace("/login");
    } catch (err) {
      console.error(err);
      Alert.alert("Logout failed", "Please try again.");
    }
  };

  const updateProfileField = async (field: string, value: string) => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { [field]: value });
    } catch (err) {
      console.error(err);
      Alert.alert("Update Failed", `Could not update ${field}`);
    }
  };

  return (
      <SafeAreaView className="flex-1">
    <ScrollView className=" bg-black px-6 pt-8">      
      <Stack.Screen  options={{headerShown: false}}/>
      <Text className="text-white text-2xl font-bold mb-6">Your Profile</Text>      
      <View className="bg-white/10 p-4 rounded-xl mb-4 flex-row justify-between items-center">
        <View className="flex-1 mr-2">
          <Text className="text-white font-semibold">Name</Text>
          {editingName ? (
            <TextInput
              className="text-white border-b border-gray-400"
              value={nameInput}
              onChangeText={setNameInput}
              onBlur={() => {
                setEditingName(false);
                updateProfileField("fullName", nameInput);
              }}
            />
          ) : (
            <Text className="text-gray-300">{nameInput}</Text>
          )}
        </View>
        <MaterialIcons
          name="edit"
          size={24}
          color="white"
          onPress={() => setEditingName(!editingName)}
        />
      </View>      
      <View className="bg-white/10 p-4 rounded-xl mb-4 flex-row justify-between items-center">
        <View className="flex-1 mr-2">
          <Text className="text-white font-semibold">Phone</Text>
          {editingPhone ? (
            <TextInput
              className="text-white border-b border-gray-400"
              value={phoneInput}
              onChangeText={setPhoneInput}
              onBlur={() => {
                setEditingPhone(false);
                updateProfileField("phone", phoneInput);
              }}
              keyboardType="phone-pad"
            />
          ) : (
            <Text className="text-gray-300">{phoneInput || "N/A"}</Text>
          )}
        </View>
        <MaterialIcons
          name="edit"
          size={24}
          color="white"
          onPress={() => setEditingPhone(!editingPhone)}
        />
      </View>      
      <View className="bg-white/10 p-4 rounded-xl mb-4 flex-row justify-between items-center">
        <View className="flex-1 mr-2">
          <Text className="text-white font-semibold">Address</Text>
          {editingAddress ? (
            <TextInput
              className="text-white border-b border-gray-400"
              value={addressInput}
              onChangeText={setAddressInput}
              onBlur={() => {
                setEditingAddress(false);
                updateProfileField("address", addressInput);
              }}
            />
          ) : (
            <Text className="text-gray-300">{addressInput || "N/A"}</Text>
          )}
        </View>
        <MaterialIcons
          name="edit"
          size={24}
          color="white"
          onPress={() => setEditingAddress(!editingAddress)}
        />
      </View>      
      <View className="mb-4">
        <Text className="text-white font-semibold text-lg mb-2">Orders</Text>
        {loadingOrders ? (
          <ActivityIndicator color="white" size="large" />
        ) : orders.length === 0 ? (
          <Text className="text-gray-300">No orders yet.</Text>
        ) : (
          orders.map((order) => (
            <Pressable
              key={order.id}
              className="bg-white/10 p-4 rounded-xl mb-3"
              onPress={() => Alert.alert("Order Details", `Order ${order.id} status: ${order.status}`)}
            >
              <Text className="text-white font-bold">
                Order ID: {order.id}
              </Text>
              <Text className="text-gray-300">Status: {order.status}</Text>
              <Text className="text-gray-300">Total: ${order.total.toFixed(2)}</Text>
              <Text className="text-gray-300">
                {order.shipping ? `Ship to: ${order.shipping.address}` : ""}
              </Text>
            </Pressable>
          ))
        )}
      </View>      
      <Pressable
        onPress={handleLogout}
        className="bg-white rounded-xl py-4 mt-6 items-center"
      >
        <Text className="text-black font-bold">Logout</Text>
      </Pressable>
    </ScrollView>
    </SafeAreaView>
  );
}
