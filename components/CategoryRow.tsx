import { View, Text, FlatList, Pressable } from "react-native";
import { Product } from "../types/product";
import { ProductPreview } from "./ProductPreview";
import { useRouter } from "expo-router";
import { CategoryWithMeta } from "@/types/category";

interface Props {
  title: string;
  products: Product[];
  category: string
}

export function CategoryRow({ title, products, category }: Props) {
    const router = useRouter();
    const handleViewAll = () => {
    router.push(`/categories/${category}`);
  };
  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-2 px-4">
        <Text className="text-white font-semibold text-base">{title}</Text>
        <Pressable onPress={handleViewAll}>
          <Text className="text-gray-300 text-sm">View All</Text>
        </Pressable>
      </View>

      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => <ProductPreview product={item} />}
      />
    </View>
  );
}
