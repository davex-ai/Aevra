// app/search.tsx
import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ProductCard from "../../components/ProductCard";
import { searchProducts } from "../../api/api";
import debounce from "lodash.debounce";

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const limit = 10;

  // 🔄 Debounced search function
  const debouncedSearch = useCallback(
    debounce((q: string, sort: string | null, ord: "asc" | "desc") => {
      if (q.trim()) {
        performSearch(q, sort, ord, true); // reset pagination
      } else {
        setProducts([]);
        setHasMore(false);
      }
    }, 400),
    []
  );

  // 🔍 Main search logic
  const performSearch = async (
    q: string,
    sort: string | null,
    ord: "asc" | "desc",
    reset: boolean
  ) => {
    if (loading || (!reset && !hasMore)) return;

    const currentSkip = reset ? 0 : skip;
    setLoading(true);

    try {
      const res = await searchProducts({
        q: q.trim(),
        sortBy: sort || undefined,
        order: ord,
        limit,
        skip: currentSkip,
      });

      if (reset) {
        setProducts(res.products);
        setSkip(limit);
        setHasMore(res.products.length === limit);
      } else {
        setProducts((prev) => [...prev, ...res.products]);
        setSkip((prev) => prev + limit);
        setHasMore(res.products.length === limit);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Trigger search when query/sort/order changes
  useEffect(() => {
    debouncedSearch(query, sortBy, order);
  }, [query, sortBy, order, debouncedSearch]);

  // 📥 Load more on scroll
  const loadMore = () => {
    if (hasMore && !loading && query.trim()) {
      performSearch(query, sortBy, order, false);
    }
  };

  const handleProductPress = (product: any) => {
    router.push(`./product/${product.id}`);
  };

  const handleWishlist = (product: any) => {
    console.log("Add to wishlist:", product.id);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1E1E1E] p-4">
      {/* Search Input */}
      <View className="flex-row items-center mb-6">
        <TextInput
          className="flex-1 bg-[#2D2D2D] text-white rounded-lg px-4 py-3.5"
          placeholder="Search products..."
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery} // ✅ Now live!
          selectionColor="#FFFFFF"
        />
        {/* Optional: keep "Search" button for accessibility */}
        <TouchableOpacity
          onPress={() => debouncedSearch.flush()} // force immediate search
          className="ml-3 bg-blue-600 px-5 py-3.5 rounded-lg"
        >
          <Text className="text-white font-semibold">Go</Text>
        </TouchableOpacity>
      </View>

      {/* Sort Controls */}
      <View className="mb-5">
        <Text className="text-[#9CA3AF] text-sm mb-2">Sort by</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {["price", "rating", "discountPercentage", "stock", "id"].map((field) => (
            <TouchableOpacity
              key={field}
              onPress={() => setSortBy(sortBy === field ? null : field)}
              className={`px-4 py-2 mr-2 rounded-full border ${
                sortBy === field
                  ? "bg-blue-600 border-blue-600"
                  : "bg-[#2D2D2D] border-[#E5E7EB]/20"
              }`}
            >
              <Text className="text-white text-sm capitalize">{field}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="mt-4 flex-row items-center">
          <Text className="text-[#9CA3AF] text-sm mr-3">Order:</Text>
          <View className="flex-row bg-[#2D2D2D] rounded-full p-1 border border-[#E5E7EB]/20">
            <TouchableOpacity
              onPress={() => setOrder("asc")}
              className={`px-4 py-1.5 rounded-full ${
                order === "asc" ? "bg-blue-600" : ""
              }`}
            >
              <Text
                className={`text-sm ${
                  order === "asc" ? "text-white" : "text-[#9CA3AF]"
                }`}
              >
                Asc
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setOrder("desc")}
              className={`px-4 py-1.5 rounded-full ${
                order === "desc" ? "bg-blue-600" : ""
              }`}
            >
              <Text
                className={`text-sm ${
                  order === "desc" ? "text-white" : "text-[#9CA3AF]"
                }`}
              >
                Desc
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Results */}
      {products.length === 0 && !loading && query.trim() === "" ? (
        <Text className="text-[#9CA3AF] text-center mt-12">
          Enter a search term to find products.
        </Text>
      ) : products.length === 0 && !loading && query.trim() !== "" ? (
        <Text className="text-[#9CA3AF] text-center mt-12">
          No products found for "{query}".
        </Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 24 }}
          columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 14 }}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={handleProductPress}
              onWishlist={handleWishlist}
            />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && products.length > 0 ? (
              <ActivityIndicator size="small" color="#FFFFFF" className="my-4" />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}