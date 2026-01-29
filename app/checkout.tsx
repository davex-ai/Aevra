import React from "react";
import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function CheckoutScreen() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handlePlaceOrder = async () => {
    if (!user) return;
    if (cart.length === 0) {
      Alert.alert("Cart Empty", "Add some products before placing an order.");
      return;
    }

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
        createdAt: Timestamp.now(),
        status: "pending",
      });

      clearCart();

      Alert.alert(
        "Order Placed!",
        "Your order has been placed. Check your profile for status."
      );

      router.push("/profile");
    } catch (err) {
      console.error(err);
      Alert.alert("Order Failed", "Please try again later.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-black px-6 pt-8">
      <Text className="text-white text-2xl font-bold mb-6">Checkout</Text>
      {cart.map(({ product, quantity }) => (
        <View
          key={product.id}
          className="bg-white/10 p-4 rounded-xl mb-4 flex-row justify-between"
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
      >
        <Text className="text-black font-bold">Place Order</Text>
      </Pressable>
    </ScrollView>
  );
}
