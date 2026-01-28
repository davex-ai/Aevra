//app/(tabs)/categories/index.tsx
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProductsByCategory } from "../../api/api";
import { CategoryCard } from "../../components/CategoryCard";
import { CategoryRow } from "../../components/CategoryRow";
import { CATEGORIES } from "../../constants/categoryIcon";

export default function CategoriesScreen({ navigation }: any) {
  const featured = CATEGORIES.slice(0, 6);
  const [loading, setLoading] = useState(true);
  const [previews, setPreviews] = useState<Record<string, any[]>>({})

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const results: Record<string, any[]> = {};

      await Promise.all(
        CATEGORIES.map(async (cat) => {
          const res = await getProductsByCategory(cat.slug, 6);
          if (res.data) {
            results[cat.slug] = res.data.products;
          }
        })
      );

      if (mounted) {
        setPreviews(results);
        setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);


  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="white" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <LinearGradient
        colors={["#0f0f0f", "#1a1a1a"]}
        className="flex-1"
      >
        <ScrollView>
          <FlatList
            data={featured}
            keyExtractor={(item) => item.slug}
            numColumns={2}
            scrollEnabled={false} 
            contentContainerStyle={{ paddingHorizontal: 8, marginTop: 16 }}
            renderItem={({ item }) => (
              <CategoryCard
                category={item} 
              />
            )}
          />


          {/* All Categories */}
          <View className="mt-8">
            {CATEGORIES.map(
              (cat) =>
                previews[cat.slug] && (
                  <CategoryRow
                    key={cat.slug}
                    title={cat.name}
                    products={previews[cat.slug]}
                    category={cat.slug}
                  />
                )
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
