import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import { Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function WishlistScreen() {
  const { wishlist, removeFromWishlist } = useWishlist();
   const { requireAuth } = useRequireAuth();

  useEffect(() => {
    requireAuth(() => {});
  }, []);

  // optionally render loading until auth check
  const { loading } = useAuth();
  
  if (loading) return null;
  
  if (wishlist.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500 text-lg">Your wishlist is empty.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen options={{headerShown: false}}/>
        <View className="flex-row items-center justify-between px-9">
            <Text className="font-extrabold text-2xl"> My WishList</Text>
            <Text className="text-gray-500"> Total Items: {wishlist.length}</Text>
        </View>
      <ScrollView className="p-4">
        <View className="flex-row flex-wrap justify-between">
          {wishlist.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onWishlist={() => removeFromWishlist(product.id)}
              onPress={() => {}}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
