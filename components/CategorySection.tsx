import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "./ProductCard";
import { Product } from "../types/product";

interface Props {
  category: string;
  products: Product[];
  onSeeAll: (category: string) => void;
  onProductPress: (product: Product) => void;
  onWishlist: (product: Product) => void;
}
 

export default function CategorySection({
  category,
  products,
  onSeeAll,
  onProductPress,
  onWishlist,
}: Props) {
  return (
    <View className="mb-6 mx-auto">
      <View className="flex-row justify-between px-4 mb-3 ">
        <Text className="font-bold capitalize">{category}</Text>

        <TouchableOpacity onPress={() => onSeeAll(category)}>
          <Ionicons name="arrow-forward" size={16} />
        </TouchableOpacity>
      </View>

      <FlatList
  data={products.slice(0, 4)}
  keyExtractor={(item) => item.id.toString()}
  numColumns={2}
  scrollEnabled={false}
  columnWrapperStyle={{ gap: 20, marginBottom: 16 }} // <- Add vertical spacing here
  contentContainerStyle={{ paddingHorizontal: 16 }}
  renderItem={({ item }) => (
    <ProductCard
  product={item}
  onPress={onProductPress}
  onWishlist={onWishlist}
/>

  )}
/>

    </View>
  );
}
