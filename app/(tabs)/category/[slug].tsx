import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  TextInput,
  Image
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCategories } from "../api/dummyJson";

// Category icons mapping
const CATEGORY_ICONS = {
  beauty: "sparkles",
  fragrances: "flower",
  furniture: "bed",
  groceries: "cart",
  "home-decoration": "home",
  "kitchen-accessories": "restaurant",
  laptops: "laptop",
  "mens-shirts": "shirt",
  "mens-shoes": "footsteps",
  "mens-watches": "watch",
  "mobile-accessories": "phone-portrait",
  motorcycle: "bicycle",
  "skin-care": "heart",
  smartphones: "phone-portrait",
  "sports-accessories": "basketball",
  sunglasses: "sunny",
  tablets: "tablet-portrait",
  tops: "shirt-outline",
  vehicle: "car",
  "womens-bags": "bag",
  "womens-dresses": "shirt",
  "womens-jewellery": "diamond",
  "womens-shoes": "footsteps",
  "womens-watches": "watch"
};

export default function CategoriesScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);

    const { data, error: err } = await getCategories();
    
    if (err) {
      setError(err);
    } else {
      // Transform categories array to objects with metadata
      const categoriesWithMeta = data.map(cat => ({
        slug: cat.slug,
        name: cat.name,
        icon: CATEGORY_ICONS[cat.slug] || "cube",
        url: cat.url
      }));
      setCategories(categoriesWithMeta);
      setFilteredCategories(categoriesWithMeta);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  const handleCategoryPress = (category) => {
    // Navigate to category products
    console.log('Category pressed:', category.name);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-light">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1E1E1E" />
          <Text className="text-dark mt-4 font-medium">Loading categories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-light">
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#DC2626" />
          <Text className="text-dark text-lg font-bold mt-4 text-center">
            Failed to load categories
          </Text>
          <Text className="text-gray-600 text-sm mt-2 text-center">
            {error}
          </Text>
          <TouchableOpacity 
            onPress={loadCategories}
            className="bg-dark px-6 py-3 rounded-lg mt-6"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-light">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-4">
        <Text className="text-dark font-bold text-2xl mb-4">Categories</Text>
        
        {/* Search Bar */}
        <View className="bg-light rounded-lg px-4 py-3 flex-row items-center">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-dark text-base"
            placeholder="Search categories..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories List */}
      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.slug}
        numColumns={2}
        contentContainerStyle={{ padding: 16 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-12">
            <Ionicons name="search-outline" size={64} color="#9CA3AF" />
            <Text className="text-gray-500 text-base mt-4">
              No categories found
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleCategoryPress(item)}
            className="bg-white rounded-lg p-6 mb-4 items-center justify-center border border-gray-100 shadow-sm"
            style={{ width: '48%', aspectRatio: 1 }}
            activeOpacity={0.7}
          >
            <View className="bg-light w-16 h-16 rounded-full items-center justify-center mb-3">
              <Ionicons name={item.icon} size={32} color="#1E1E1E" />
            </View>
            <Text 
              className="text-dark font-semibold text-sm text-center capitalize"
              numberOfLines={2}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
