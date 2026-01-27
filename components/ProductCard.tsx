import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../types/product";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

interface Props {
  product: Product;
  onPress: (product: Product) => void;
  onWishlist: (product: Product) => void;
}

export default function ProductCard({
  product,
  onPress,
  onWishlist,
}: Props) {
  const discountedPrice =
    product.price -
    (product.price * (product.discountPercentage ?? 0)) / 100;

  return (
    <TouchableOpacity
      onPress={() => onPress(product)}
      className="bg-white rounded-lg mb-4 border border-gray-100"
      style={{ width: CARD_WIDTH }}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: product.thumbnail ?? product.images?.[0] }}
        className="w-full h-40 rounded-t-lg bg-light"
      />

      <View className="p-3">
        <Text className="text-dark font-semibold text-sm" numberOfLines={2}>
          {product.title}
        </Text>

        <Text className="text-gray-500 text-xs capitalize">
          {product.category}
        </Text>

        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-dark font-bold">
            ${discountedPrice.toFixed(2)}
          </Text>

          {product.rating && (
            <View className="flex-row items-center">
              <Ionicons name="star" size={12} color="#FFA500" />
              <Text className="text-xs ml-1">{product.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        onPress={() => onWishlist(product)}
        className="absolute top-2 right-2 bg-white p-2 rounded-full"
      >
        <Ionicons name="heart-outline" size={18} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
