import { View, Text, FlatList, ActivityIndicator, Image } from "react-native";
import { useSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getProductsByCategory } from "../../api/products";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryProductsScreen() {
  const { category } = useSearchParams<{ category: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      const res = await getProductsByCategory(category!, 20);
      if (mounted && res.data) {
        setProducts(res.data.products);
        setLoading(false);
      }
    };

    loadProducts();
    return () => {
      mounted = false;
    };
  }, [category]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="white" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black px-4">
      <Text className="text-white font-bold text-xl mb-4">{category}</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 16 }}
        renderItem={({ item }) => (
          <View className="bg-white/10 rounded-xl p-2 flex-1 mx-1">
            <Image
              source={{ uri: item.thumbnail }}
              className="w-full h-32 rounded-lg"
              resizeMode="cover"
            />
            <Text className="text-white mt-2 text-sm">{item.title}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
