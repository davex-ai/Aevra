import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Stack } from "expo-router";

export default function CheckoutScreen() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!user) return;

    if (cart.length === 0) {
      Alert.alert("Cart Empty", "Add some products before placing an order.");
      return;
    }

    if (!name || !phone || !address) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const orderRef = doc(collection(db, "orders", user.uid, "userOrders"));
      await setDoc(orderRef, {
        products: cart.map((item) => ({
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
        })),
        total: getCartTotal(),
        shipping: { name, phone, address },
        createdAt: Timestamp.now(),
        status: "pending",
      });

      clearCart();

      Alert.alert(
        "Order Placed!",
        "Your order has been placed. You will be redirected to your profile for order status."
      );

      router.replace("/profile");
    } catch (err) {
      console.error(err);
      Alert.alert("Order Failed", "Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-black px-6 pt-8">
        <Stack.Screen  options={{headerShown: false}}/>
      <Text className="text-white text-2xl font-bold mb-6">Checkout</Text>      
      <View className="mb-6">
        <Text className="text-white font-semibold mb-2">Shipping Info</Text>
        <TextInput
          placeholder="Name"
          placeholderTextColor="#888"
          className="bg-white/10 text-white px-4 py-3 rounded-xl mb-3"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Phone"
          placeholderTextColor="#888"
          className="bg-white/10 text-white px-4 py-3 rounded-xl mb-3"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          placeholder="Address"
          placeholderTextColor="#888"
          className="bg-white/10 text-white px-4 py-3 rounded-xl mb-3"
          value={address}
          onChangeText={setAddress}
        />
      </View>      
      <Text className="text-white font-semibold text-lg mb-3">Order Summary</Text>
      {cart.map(({ product, quantity }) => (
        <View
          key={product.id}
          className="bg-white/10 p-4 rounded-xl mb-3 flex-row justify-between"
        >
          <Text className="text-white">{product.title} x {quantity}</Text>
          <Text className="text-gray-300">
            ${(product.price * quantity).toFixed(2)}
          </Text>
        </View>
      ))}

      <View className="flex-row justify-between mt-4 mb-6">
        <Text className="text-white font-bold text-lg">Total:</Text>
        <Text className="text-white font-bold text-lg">${getCartTotal()}</Text>
      </View>      
      <Pressable
        onPress={handlePlaceOrder}
        className="bg-white rounded-xl py-4 mt-6 items-center"
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text className="text-black font-bold">Place Order</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
