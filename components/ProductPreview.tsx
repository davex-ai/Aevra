// components/ProductPreview.tsx
import { View, Text, Image, Pressable } from "react-native";
import { Product } from "../types/product";
import { useRouter } from "expo-router";

export function ProductPreview({ product }: { product: Product }) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/products/[id]",
      params: { id: String(product.id) }
    });
  };

  return (
    <Pressable onPress={handlePress} className="w-32 mr-3">
      <View className="bg-white/5 rounded-xl p-2">
        <Image
          source={{ uri: product.thumbnail }}
          className="h-20 w-full rounded-lg"
          resizeMode="cover"
        />
        <Text className="text-white text-xs mt-1" numberOfLines={1}>
          {product.title}
        </Text>
      </View>
    </Pressable>
  );
}