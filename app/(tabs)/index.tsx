import { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProductsByCategory } from "../../api/api";
import { Product } from "../../types/product";
import CategorySection from "../../components/CategorySection";

interface CategoryData {
  name: string;
  products: Product[];
}

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);

  const FEATURED = ["smartphones", "laptops", "fragrances"];

  useEffect(() => {
    (async () => {
      try {
        const results = await Promise.all(
          FEATURED.map(async (cat) => {
            const res = await getProductsByCategory(cat);
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
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        {categoriesData.map((cat) => (
          <CategorySection
            key={cat.name}
            category={cat.name}
            products={cat.products}
            onSeeAll={() => {}}
            onProductPress={() => {}}
            onWishlist={() => {}}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
