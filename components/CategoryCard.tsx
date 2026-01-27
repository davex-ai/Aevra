import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CategoryWithMeta } from "../types/category";
import { useRouter } from "expo-router";

interface Props {
  category: CategoryWithMeta;
}

export function CategoryCard({ category }: Props) {
  const router = useRouter();

  const handlePress = () => {
        router.push(`./categories/${category.slug}`)
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white/10 rounded-2xl p-4 m-2 items-center justify-center"
      style={{ flex: 1 }}
    >
      <Ionicons name={category.icon} size={28} color="white" />
      <Text className="text-white mt-2 font-semibold text-sm text-center">
        {category.name}
      </Text>
    </Pressable>
  );
}
