// app/(tabs)/categories/[category].tsx
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getProductsByCategory } from "../../../api/api";
import ProductCard from "../../../components/ProductCard";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryPage() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const res = await getProductsByCategory(category, 20);
      if (res.data) {
        setProducts(res.data.products);
      }
      setLoading(false);
    };
    loadProducts();
  }, [category]);

  if (loading) return <SafeAreaView className="flex-1 bg-black items-center justify-center">
          <ActivityIndicator size="large" color="white" />
        </SafeAreaView>;

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ProductCard product={item} onPress={() => {}} onWishlist={() => {}} />}
      numColumns={2}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}
