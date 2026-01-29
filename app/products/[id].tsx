import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getProduct } from '../../api/api';
import { Product } from '../../types/product';
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function ProductDetail() {
  const params = useLocalSearchParams<{ id: string }>();
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { requireAuth } = useRequireAuth();
  
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (id) {
      getProduct(Number(id)).then(res => setProduct(res.data ?? null));
    }
  }, [id]);

  const getStarColor = (rating: number) => {
    if (rating >= 4.5) return "#16a34a";
    if (rating >= 3) return "#f59e0b";
    return "#dc2626";
  };

  const handleAddToCart = () => {
    if (!product) return;
    requireAuth(() => {
      addToCart(product, quantity);
      router.push('/cart');
    });
  };

  const toggleWishlist = () => {
    if (!product) return;
    requireAuth(() => {
      isInWishlist(product.id) 
        ? removeFromWishlist(product.id) 
        : addToWishlist(product);
    });
  };

  if (!product) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-center mt-10">Loading...</Text>
      </SafeAreaView>
    );
  }

  const discountedPrice = product.price - (product.price * (product.discountPercentage || 0)) / 100;
  const inWishlist = isInWishlist(product.id);
  const inCart = isInCart(product.id);
  const stock = product.stock ?? 0;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white">
        {/* Custom Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
          </TouchableOpacity>
          
          <Text className="text-lg font-bold">Product Details</Text>
          
          <TouchableOpacity onPress={toggleWishlist} activeOpacity={0.7}>
            <Ionicons
              name={inWishlist ? "heart" : "heart-outline"}
              size={24}
              color={inWishlist ? "#DC2626" : "#1E1E1E"}
            />
          </TouchableOpacity>
        </View>

        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Main Image */}
          <Image
            source={{ uri: product.thumbnail ?? product.images?.[0] }}
            className="w-full h-80 bg-gray-100"
            resizeMode="cover"
          />

          <View className="p-4">
            {/* Title & Brand */}
            <Text className="text-2xl font-bold text-dark">{product.title}</Text>
            {product.brand && (
              <Text className="text-gray-500 mt-1 text-base">
                Brand: {product.brand}
              </Text>
            )}

            {/* Category & Tags */}
            <Text className="text-gray-400 mt-2 capitalize">
              Category: {product.category}
            </Text>
            {product.tags && (
              <Text className="text-gray-400 mt-1">
                Tags: {product.tags.join(', ')}
              </Text>
            )}

            {/* Pricing */}
            <View className="mt-4 bg-gray-50 p-4 rounded-lg">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl font-bold text-green-700">
                    ${discountedPrice.toFixed(2)}
                  </Text>
                  {product.discountPercentage > 0 && (
                    <Text className="line-through text-gray-400 text-base mt-1">
                      ${product.price.toFixed(2)}
                    </Text>
                  )}
                </View>
                
                {product.discountPercentage > 0 && (
                  <View className="bg-red-500 px-3 py-1 rounded-full">
                    <Text className="text-white font-bold">
                      {Math.round(product.discountPercentage)}% OFF
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Stock & Availability */}
            <View className="flex-row items-center mt-3">
              <Ionicons 
                name={stock > 0 ? "checkmark-circle" : "close-circle"}
                size={20} 
                color={stock > 0 ? "#16a34a" : "#DC2626"} 
              />
              <Text className="ml-2 text-gray-600">
                {product.availabilityStatus} • {stock} in stock
              </Text>
            </View>

            {/* Rating */}
            {product.rating && (
              <View className="flex-row items-center mt-2">
                <Ionicons name="star" size={20} color="#FFA500" />
                <Text className="ml-2 text-gray-700 font-semibold">
                  {product.rating.toFixed(1)} / 5.0
                </Text>
              </View>
            )}

            {/* Description */}
            <View className="mt-6">
              <Text className="text-lg font-bold text-dark mb-2">Description</Text>
              <Text className="text-gray-700 leading-6">{product.description}</Text>
            </View>

            {/* Quantity Selector */}
            <View className="mt-6">
              <Text className="text-lg font-bold text-dark mb-3">Quantity</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg self-start">
                <TouchableOpacity
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3"
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={20} color="#1E1E1E" />
                </TouchableOpacity>

                <Text className="px-6 text-dark font-bold text-lg">
                  {quantity}
                </Text>

                <TouchableOpacity
                  onPress={() => setQuantity(Math.min(stock, quantity + 1))}
                  className="px-4 py-3"
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={20} color="#1E1E1E" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Reviews */}
            {Array.isArray(product.reviews) && product.reviews.length > 0 && (
              <View className="mt-6">
                <Text className="text-lg font-bold mb-3">Reviews</Text>

                {product.reviews.map((review, idx) => (
                  <View
                    key={idx}
                    className="mb-3 p-4 rounded-xl border border-gray-200 bg-gray-50"
                  >
                    <Text className="font-semibold text-gray-800">
                      {review.reviewerName}
                    </Text>

                    <View className="flex-row items-center mt-1">
                      <Ionicons
                        name="star"
                        size={16}
                        color={getStarColor(review.rating)}
                      />
                      <Text className="ml-1 text-sm text-gray-700">
                        {review.rating.toFixed(1)}
                      </Text>
                    </View>

                    <Text className="mt-2 text-gray-600 text-sm">
                      {review.comment}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Shipping & Warranty */}
            <View className="mt-6 bg-gray-50 p-4 rounded-lg">
              {product.shippingInformation && (
                <View className="flex-row items-start mb-2">
                  <Ionicons name="car-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-700 ml-2 flex-1">
                    {product.shippingInformation}
                  </Text>
                </View>
              )}
              {product.warrantyInformation && (
                <View className="flex-row items-start">
                  <Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-700 ml-2 flex-1">
                    {product.warrantyInformation}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Add to Cart Footer */}
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <View className="flex-row items-center gap-3">
            <View className="flex-1">
              <Text className="text-gray-600 text-sm">Total Price</Text>
              <Text className="text-dark font-bold text-xl">
                ${(discountedPrice * quantity).toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleAddToCart}
              className={`flex-row items-center justify-center px-6 py-4 rounded-lg ${
                inCart ? "bg-green-600" : "bg-black"
              }`}
              activeOpacity={0.8}
            >
              <Ionicons
                name={inCart ? "checkmark-circle" : "cart"}
                size={20}
                color="white"
              />
              <Text className="text-white font-bold text-base ml-2">
                {inCart ? "Added to Cart" : "Add to Cart"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}