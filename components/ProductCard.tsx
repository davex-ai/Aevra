import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../types/product";
import { useRouter } from "expo-router";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

interface Props {
  product: Product;
  onPress: (product: Product) => void;
  onWishlist: (product: Product) => void;
}

export default function ProductCard({ product }: Props) {
  const discountedPrice =
    product.price - (product.price * (product.discountPercentage ?? 0)) / 100;
  const router = useRouter();
  const { requireAuth } = useRequireAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const inWishlist = isInWishlist(product.id);
  const inCart = isInCart(product.id);

  const handlePress = () => {
    router.push(`/products/${product.id}`);
  };

  const toggleWishlist = () => {
    requireAuth(() => {
      inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
    });
  };

  const handleAddToCart = () => {
    requireAuth(() => {
      addToCart(product, 1);
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white rounded-lg border border-gray-100 mb-4"
      style={{ width: CARD_WIDTH }}
      activeOpacity={0.7}
    >
      {/* Product Image */}
      <View className="relative">
        <Image
          source={{ uri: product.thumbnail ?? product.images?.[0] }}
          className="w-full h-40 rounded-t-lg bg-gray-100"
          resizeMode="cover"
        />

        {/* Discount Badge */}
        {(product.discountPercentage ?? 0) > 0 && (
          <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded">
            <Text className="text-white text-xs font-bold">
              -{Math.round(product.discountPercentage ?? 0)}%
            </Text>
          </View>
        )}

        {/* Wishlist Button */}
        <TouchableOpacity
          onPress={toggleWishlist}
          className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow"
          activeOpacity={0.7}
        >
          <Ionicons
            name={inWishlist ? "heart" : "heart-outline"}
            size={18}
            color={inWishlist ? "#DC2626" : "#6B7280"}
          />
        </TouchableOpacity>
      </View>

      {/* Product Info */}
      <View className="p-3">
        <Text className="text-dark font-semibold text-sm mb-1" numberOfLines={2}>
          {product.title}
        </Text>

        <Text className="text-gray-500 text-xs mb-2 capitalize">
          {product.category}
        </Text>

        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-dark font-bold text-base">
              ${discountedPrice.toFixed(2)}
            </Text>
            {(product.discountPercentage ?? 0) > 0 && (
              <Text className="text-gray-400 text-xs line-through">
                ${product.price.toFixed(2)}
              </Text>
            )}
          </View>

          {/* Cart Button */}
          <TouchableOpacity
            onPress={handleAddToCart}
            className={`p-2 rounded-full ${
              inCart ? "bg-green-500" : "bg-black"
            }`}
            activeOpacity={0.7}
          >
            <Ionicons
              name={inCart ? "checkmark" : "cart-outline"}
              size={16}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Rating */}
        {product.rating && (
          <View className="flex-row items-center mt-2">
            <Ionicons name="star" size={12} color="#FFA500" />
            <Text className="text-gray-600 text-xs ml-1">
              {product.rating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}