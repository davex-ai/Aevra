import React from "react";
import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";

export default function CheckoutScreen() {
  const { cart, getCartTotal } = useCart();
  const router = useRouter();

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      Alert.alert("Cart Empty", "Add some products before placing an order.");
      return;
    }

    // Simple notification
    Alert.alert(
      "Order Placed!",
      "Check your profile for order status."
    );

    // Optional: redirect to profile after order
    router.push("/profile");
  };

  return (
    <ScrollView className="flex-1 bg-black px-6 pt-8">
      <Text className="text-white text-2xl font-bold mb-6">Checkout</Text>

      {cart.length === 0 ? (
        <Text className="text-gray-300 mb-4">Your cart is empty.</Text>
      ) : (
        cart.map(({ product, quantity }) => (
          <View
            key={product.id}
            className="bg-white/10 p-4 rounded-xl mb-4 flex-row justify-between"
          >
            <Text className="text-white">{product.title} x {quantity}</Text>
            <Text className="text-gray-300">${product.price * quantity}</Text>
          </View>
        ))
      )}

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
