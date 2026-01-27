import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CategoryWithMeta } from "../types/category";

interface Props {
  category: CategoryWithMeta;
  onPress: () => void;
}

export function CategoryCard({ category, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 bg-white/10 rounded-2xl p-4 m-2 items-center justify-center"
    >
      <Ionicons name={category.icon} size={28} color="white" />
      <Text className="text-white mt-2 font-semibold text-sm">
        {category.name}
      </Text>
    </Pressable>
  );
}
