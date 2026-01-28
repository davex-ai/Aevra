import { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProductsByCategory } from "../../api/api";
import { Product } from "../../types/product";
import CategorySection from "../../components/CategorySection";
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useRouter } from "expo-router";


interface CategoryData {
  name: string;
  products: Product[];
}

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  const { requireAuth } = useRequireAuth();
  const router = useRouter()

  const FEATURED = ["smartphones", "laptops", "fragrances"];

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

  if (loading) {
    return  <SafeAreaView className="flex-1 bg-black items-center justify-center">
      <ActivityIndicator size="large" color="white" />
    </SafeAreaView>
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row px-10 justify-between items-center">
        <MaterialCommunityIcons name={'account-circle'} size={24} color="black" onPress={() => requireAuth(() => { router.push("/wishlist"); }) } />
        <Feather name="heart" size={24} color="black" onPress={() => requireAuth(() => { router.push("/wishlist"); }) } /> 
      </View>
      <ScrollView>
        <View>
          <Text className="font-bold text-xl ml-6 mt-4">Curatehd. Crafted. Exceptional.</Text>
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
            onSeeAll={() => { }}
            onProductPress={() => { }}
            onWishlist={() => { }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}