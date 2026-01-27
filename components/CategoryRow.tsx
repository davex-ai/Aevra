import { View, Text, FlatList, Pressable } from "react-native";
import { Product } from "../types/product";
import { ProductPreviewCard } from "./ProductPreview";

interface Props {
  title: string;
  products: Product[];
  onViewAll: () => void;
}

export function CategoryRow({ title, products, onViewAll }: Props) {
  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-2 px-4">
        <Text className="text-white font-semibold text-base">{title}</Text>
        <Pressable onPress={onViewAll}>
          <Text className="text-gray-300 text-sm">View All</Text>
        </Pressable>
      </View>

      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => <ProductPreviewCard product={item} />}
      />
    </View>
  );
}
