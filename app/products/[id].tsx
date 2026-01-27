import { View, Text, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { getProduct } from '../../api/api';
import { Product } from '../../types/product';

export default function ProductDetail() {
  const params = useLocalSearchParams<{ id: string }>();
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      getProduct(Number(id)).then(res => setProduct(res.data ?? null));
    }
  }, [id]);

  if (!product) return <Text className="text-center mt-10">Loading...</Text>;

  const discountedPrice = product.price - (product.price * product.discountPercentage) / 100;

  return ( 
    <ScrollView className="p-4 bg-white">
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
      {product.reviews?.length > 0 && (//possibly undefined
        <View className="mt-6">
          <Text className="text-lg font-bold mb-2">Reviews</Text>
          {product.reviews.map((review, idx) => (//possibly undefined
            <View key={idx} className="mb-2 p-2 border rounded-lg border-gray-200">
              <Text className="font-semibold">{review.reviewerName}</Text>//doent exist on type string
              <Text className="text-yellow-500">Rating: {review.rating}⭐</Text>//doent exist on type string
              <Text className="text-gray-600">{review.comment}</Text>//doent exist on type string
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
  );
}
