//app/products/[id].tsx
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

  
  
  if (!product) return <Text>Loading...</Text>;
  const discountedPrice = product.price - (product.price * product.discountPercentage) / 100

  return (
    <ScrollView className="p-4">
      <Image
        source={{ uri: product.thumbnail ?? product.images?.[0] }}
        className="w-full h-64 rounded-lg"
      />
      <Text className="text-xl font-bold mt-4">{product.title}</Text>
      <Text className="text-gray-500 mt-1">{product.category}</Text>
      <Text className="text-lg font-semibold mt-2">
         ${discountedPrice.toFixed(2)}
      </Text>
      <Text className="mt-3 text-gray-700">{product.description}</Text>
    </ScrollView>
  );
}
