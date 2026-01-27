import { ActivityIndicator, FlatListComponent, ScrollView, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { getProductsByCategory } from "../../api/api";
import { CATEGORIES } from "../../constants/categoryIcon";
import { CategoryCard } from "../../components/CategoryCard";
import { CategoryRow } from "../../components/CategoryRow";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native";
import {  useRouter } from "expo-router";

export default function CategoriesScreen({ navigation }: any) {
  const featured = CATEGORIES.slice(0, 4);
  const [loading, setLoading] = useState(true);
  const [previews, setPreviews] = useState<Record<string, any[]>>({});
  const navigate = useRouter()

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
          {/* Featured Categories */}
          <FlatList
            data={CATEGORIES.slice(0,6)}
            keyExtractor={(item) => item.slug}
            numColumns={2}
            scrollEnabled={false} // important since inside ScrollView
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
                    onViewAll={() =>
                      navigation.navigate("CategoryProducts", {
                        category: cat.slug,
                      })
                    }
                  />
                )
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
