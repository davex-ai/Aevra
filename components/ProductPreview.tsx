import { View, Text, Image } from "react-native";
import { Product } from "../types/product";

export function ProductPreview ({ product }: { product: Product }) {
  return (
    <View className="w-32 mr-3 bg-white/5 rounded-xl p-2">
      <Image
        source={{ uri: product.thumbnail }}
        className="h-20 w-full rounded-lg"
        resizeMode="cover"
      />
      <Text className="text-white text-xs mt-1" numberOfLines={1}>
        {product.title}
      </Text>
    </View>
  );
}
