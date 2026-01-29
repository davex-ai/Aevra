import { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator, View, Text, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProductsByCategory } from "../../api/api";
import { Product } from "../../types/product";
import CategorySection from "../../components/CategorySection";
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useRouter } from "expo-router";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

interface CategoryData {
  name: string;
  products: Product[];
}

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  const { requireAuth } = useRequireAuth();
  const router = useRouter();

  const FEATURED = ["smartphones", "laptops", "fragrances"];
  const { wishlist } = useWishlist();
  const { getCartCount } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const results = await Promise.all(
          FEATURED.map(async (cat) => {
            const res = await getProductsByCategory(cat, 4);
            return { name: cat, products: res.data?.products ?? [] };
          })
        );
        setCategoriesData(results);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleProductPress = (product: Product) => {
    console.log("Navigating to product:", product.id);
    router.push(`/products/${product.id}`);
  };

  const handleWishlist = (product: Product) => {
    // Handled in ProductCard component now
  };

  const handleSeeAll = (category: string) => {
    console.log("See all:", category);
    // Navigate to category page when you create it
    // router.push(`/category/${category}`);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="white" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-red-500">{error}</Text>
      </SafeAreaView>
    );
  }

  const cartCount = getCartCount();

  return (
    <SafeAreaView className="flex-1">
      {/* Header with Cart and Wishlist */}
      <View className="flex-row px-6 py-3 justify-between items-center border-b border-gray-200 ">
        <View className="flex-row items-center gap-4">
          <MaterialCommunityIcons
            name="account-circle"
            size={28}
            color="black"
            // onPress={() => requireAuth(() => router.push("/profile"))}
          />
        </View>

        <View className="flex-row items-center gap-4">
          {/* Wishlist Icon */}
          <Pressable onPress={() => router.push('/wishlist')} className="relative">
            <Feather name="heart" size={24} color="black" />
            {wishlist.length > 0 && (
              <View className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 items-center justify-center">
                <Text className="text-white text-xs font-bold">{wishlist.length}</Text>
              </View>
            )}
          </Pressable>        
        </View>
      </View>

      <ScrollView>
        <View>
          <Text className="font-bold text-xl ml-6 mt-4">Curated. Crafted. Exceptional.</Text>
          <Text className="text-sm text-[#9b9999] ml-6">Everything here earns its place.</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: 380 }}>
          <View className="gap-5 flex-row items-center mx-auto my-1">
            <Image
              source={require("../../assets/images/header.png")}
              className="w-60 h-40 rounded-lg"
              resizeMode="cover"
            />
            <Image source={require('../../assets/images/features 01.png')} />
            <Image source={require('../../assets/images/features 02.png')} />
          </View>
        </ScrollView>

        <Text className="font-bold text-xl ml-4">Featured Products.</Text>

        {categoriesData.map((cat) => (
          <CategorySection
            key={cat.name}
            category={cat.name}
            products={cat.products}
            onSeeAll={() => handleSeeAll(cat.name)}
            onProductPress={handleProductPress}
            onWishlist={handleWishlist}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}