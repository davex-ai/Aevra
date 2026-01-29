import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/context/AuthContext";

export default function CartScreen() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { requireAuth } = useRequireAuth();

  const handleCheckout = () => {
    requireAuth(() => {
      // Navigate to checkout when implemented
      console.log("Checkout");
    });
  };

  // Not logged in state
  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="bg-white border-b border-gray-200 px-4 py-4">
          <Text className="text-dark font-bold text-2xl">Cart</Text>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="cart-outline" size={80} color="#9CA3AF" />
          <Text className="text-dark text-xl font-bold mt-6 text-center">
            Sign in to view your cart
          </Text>
          <Text className="text-gray-500 text-sm mt-2 text-center">
            Save items and checkout when you're ready
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/login")}
            className="bg-black px-8 py-4 rounded-lg mt-8"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Empty cart state
  if (cart.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="bg-white border-b border-gray-200 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-dark font-bold text-2xl">Cart</Text>
            <View className="bg-gray-100 px-3 py-1 rounded-full">
              <Text className="text-dark font-semibold text-sm">0 items</Text>
            </View>
          </View>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="cart-outline" size={80} color="#9CA3AF" />
          <Text className="text-dark text-xl font-bold mt-6 text-center">
            Your cart is empty
          </Text>
          <Text className="text-gray-500 text-sm mt-2 text-center">
            Add items to get started
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            className="bg-black px-8 py-4 rounded-lg mt-8"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Cart with items
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-dark font-bold text-2xl">Cart</Text>
          <View className="bg-gray-100 px-3 py-1 rounded-full">
            <Text className="text-dark font-semibold text-sm">
              {getCartCount()} {getCartCount() === 1 ? "item" : "items"}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.product.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const discountedPrice =
            item.product.price -
            (item.product.price * (item.product.discountPercentage || 0)) / 100;
          const itemTotal = discountedPrice * item.quantity;

          return (
            <View className="bg-white rounded-lg mb-4 flex-row border border-gray-200 overflow-hidden">
              {/* Product Image */}
              <Pressable
                onPress={() => router.push(`/products/${item.product.id}`)}
              >
                <Image
                  source={{ uri: item.product.thumbnail }}
                  className="w-24 h-24 bg-gray-100"
                  resizeMode="cover"
                />
              </Pressable>

              {/* Product Info */}
              <View className="flex-1 p-3">
                <View className="flex-row items-start justify-between mb-2">
                  <Pressable
                    onPress={() => router.push(`/products/${item.product.id}`)}
                    className="flex-1 mr-2"
                  >
                    <Text
                      className="text-dark font-semibold text-sm"
                      numberOfLines={2}
                    >
                      {item.product.title}
                    </Text>
                    <Text className="text-gray-500 text-xs mt-1 capitalize">
                      {item.product.category}
                    </Text>
                  </Pressable>

                  {/* Remove Button */}
                  <TouchableOpacity
                    onPress={() => removeFromCart(item.product.id)}
                    className="p-1"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={20} color="#DC2626" />
                  </TouchableOpacity>
                </View>

                {/* Price */}
                <Text className="text-dark font-bold text-base mb-2">
                  ${discountedPrice.toFixed(2)}
                  {item.product.discountPercentage > 0 && (
                    <Text className="text-gray-400 text-sm line-through ml-2">
                      ${item.product.price.toFixed(2)}
                    </Text>
                  )}
                </Text>

                {/* Quantity Controls */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center border border-gray-300 rounded-lg">
                    <TouchableOpacity
                      onPress={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="px-3 py-1"
                      activeOpacity={0.7}
                    >
                      <Ionicons name="remove" size={16} color="#1E1E1E" />
                    </TouchableOpacity>

                    <Text className="px-4 text-dark font-semibold">
                      {item.quantity}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="px-3 py-1"
                      activeOpacity={0.7}
                    >
                      <Ionicons name="add" size={16} color="#1E1E1E" />
                    </TouchableOpacity>
                  </View>

                  <Text className="text-dark font-bold text-base">
                    ${itemTotal.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Checkout Footer */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-gray-600 text-base">Subtotal</Text>
          <Text className="text-dark font-bold text-xl">
            ${getCartTotal().toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleCheckout}
          className="bg-black py-4 rounded-lg"
          activeOpacity={0.8}
        >
          <Text className="text-white text-center font-bold text-base">
            Proceed to Checkout
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          className="mt-2 py-3"
          activeOpacity={0.7}
        >
          <Text className="text-gray-600 text-center font-medium text-sm">
            Continue Shopping
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}