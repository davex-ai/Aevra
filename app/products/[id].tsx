import { View, Text, Image, ScrollView } from 'react-native';
import {  Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { getProduct } from '../../api/api';
import { Product } from '../../types/product';
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductDetail() {
  const params = useLocalSearchParams<{ id: string }>();
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      getProduct(Number(id)).then(res => setProduct(res.data ?? null));
    }
  }, [id]);

  const getStarColor = (rating: number) => {
  if (rating >= 4.5) return "#16a34a"; // green-600
  if (rating >= 3) return "#f59e0b";   // amber-500
  return "#dc2626";                    // red-600
};


  if (!product) return <Text className="text-center mt-10">Loading...</Text>;

  const discountedPrice = product.price - (product.price * product.discountPercentage) / 100;

  return ( 
    <>
     <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <SafeAreaView>

      
    <ScrollView className="p-4 bg-white" showsVerticalScrollIndicator={false}  >
      {/* Main Image */}
      <Image
        source={{ uri: product.thumbnail ?? product.images?.[0] }}
        className="w-full h-64 rounded-lg mb-4"
        resizeMode="cover"
      />

      {/* Title & Brand */}
      <Text className="text-2xl font-bold">{product.title}</Text>
      {product.brand && <Text className="text-gray-500 mt-1">Brand: {product.brand}</Text>}

      {/* Category & Tags */}
      <Text className="text-gray-400 mt-1">Category: {product.category}</Text>
      {product.tags && (
        <Text className="text-gray-400 mt-1">
          Tags: {product.tags.join(', ')}
        </Text>
      )}

      {/* Pricing */}
      <Text className="text-xl font-semibold mt-3 text-green-700">
        ${discountedPrice.toFixed(2)}{' '}
        <Text className="line-through text-gray-400 text-base">
          ${product.price.toFixed(2)}
        </Text>
      </Text>

      {/* Stock & Availability */}
      <Text className="mt-2 text-gray-600">
        {product.availabilityStatus} • {product.stock} in stock
      </Text>

      {/* Description */}
      <Text className="mt-4 text-gray-700">{product.description}</Text>

      {/* Reviews */}
      {Array.isArray(product.reviews) && product.reviews.length > 0 && (
  <View className="mt-6">
    <Text className="text-lg font-bold mb-3">Reviews</Text>

    {product.reviews.map((review, idx) => (
      <View
        key={idx}
        className="mb-3 p-3 rounded-xl border border-gray-200 bg-gray-50"
      >
        {/* Reviewer */}
        <Text className="font-semibold text-gray-800">
          {review.reviewerName}
        </Text>

        {/* Rating */}
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

        {/* Comment */}
        <Text className="mt-2 text-gray-600 text-sm">
          {review.comment}
        </Text>
      </View>
    ))}
  </View>
)}

      {/* Shipping & Warranty */}
      <View className="mt-6">
        {product.shippingInformation && (
          <Text className="text-gray-500">Shipping: {product.shippingInformation}</Text>
        )}
        {product.warrantyInformation && (
          <Text className="text-gray-500">Warranty: {product.warrantyInformation}</Text>
        )}
      </View>
    </ScrollView>
    </SafeAreaView>
    </>
  );
}
