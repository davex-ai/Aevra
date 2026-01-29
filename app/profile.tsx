import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Alert, ScrollView, TextInput } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Order {
  id: string;
  products: { id: number; title: string; quantity: number; price: number }[];
  total: number;
  status: string;
  createdAt: any;
}

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.displayName || "");

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      const q = query(
        collection(db, "orders", user.uid, "userOrders"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const fetched: Order[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(fetched);
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

  return (
    <ScrollView className="flex-1 bg-black px-6 pt-8">
      <Text className="text-white text-2xl font-bold mb-6">Your Profile</Text>

      {/* Editable Name */}
      <View className="bg-white/10 p-4 rounded-xl mb-4 flex-row justify-between items-center">
        <View className="flex-1 mr-2">
          <Text className="text-white font-semibold">Name</Text>
          {editingName ? (
            <TextInput
              className="text-white border-b border-gray-400"
              value={nameInput}
              onChangeText={setNameInput}
              onBlur={() => setEditingName(false)}
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
        <View>
          <Text className="text-white font-semibold">Email</Text>
          <Text className="text-gray-300">{user?.email || "N/A"}</Text>
        </View>
        <MaterialIcons
          name="edit"
          size={24}
          color="white"
          onPress={() => Alert.alert("Edit Email", "Feature coming soon")}
        />
      </View>

      {/* Orders */}
      <View className="mb-4">
        <Text className="text-white font-semibold text-lg mb-2">Orders</Text>
        {orders.length === 0 ? (
          <Text className="text-gray-300">No orders yet.</Text>
        ) : (
          orders.map((order) => (
            <View
              key={order.id}
              className="bg-white/10 p-4 rounded-xl mb-3"
            >
              <Text className="text-white font-bold">
                Order ID: {order.id}
              </Text>
              <Text className="text-gray-300">
                Status: {order.status}
              </Text>
              <Text className="text-gray-300">
                Total: ${order.total.toFixed(2)}
              </Text>
            </View>
          ))
        )}
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
