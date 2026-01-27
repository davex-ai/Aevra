// React Native (Expo) + NativeWind
// Corporate theme using #D9D9D9 (light) and #1E1E1E (dark)
// Clean HomeScreen + CategoriesScreen with loading & error states

import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'

const COLORS = {
  bg: '#D9D9D9',
  card: '#FFFFFF',
  text: '#1E1E1E',
  muted: '#6B7280',
}

function ProductCard({ item }) {
  return (
    <View className="bg-white rounded-2xl p-3 w-[48%] mb-4 shadow-sm">
      <Image source={{ uri: item.thumbnail }} className="w-full h-28 rounded-xl mb-2" resizeMode="contain" />
      <Text className="text-[#1E1E1E] font-semibold text-sm" numberOfLines={2}>{item.title}</Text>
      <Text className="text-xs text-gray-500 mb-1">{item.category}</Text>
      <View className="flex-row justify-between items-center">
        <Text className="font-bold text-[#1E1E1E]">${item.price}</Text>
        <Text className="text-lg">♡</Text>
      </View>
    </View>
  )
}

export function Home() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('https://dummyjson.com/carts/1')
      .then(res => res.json())
      .then(json => {
        // inject fake category mapping for demo
        const enriched = json.products.map(p => ({
          ...p,
          category: p.thumbnail.split('/')[5] || 'general',
        }))
        setData(enriched)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#D9D9D9]">
        <ActivityIndicator size="large" color="#1E1E1E" />
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#D9D9D9]">
        <Text className="text-[#1E1E1E]">Failed to load products</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-[#D9D9D9] px-4 pt-14">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-2xl font-bold text-[#1E1E1E]">Dashboard</Text>
        <Text className="text-gray-600">Curated picks across categories</Text>
      </View>

      {/* Categories Preview */}
      <View className="mb-4">
        <Text className="font-semibold text-[#1E1E1E] mb-2">Top Categories</Text>
        <View className="flex-row gap-3">
          {['laptops', 'vehicle', 'womens-jewellery'].slice(0, 3).map(cat => (
            <TouchableOpacity key={cat} className="bg-white px-4 py-2 rounded-xl">
              <Text className="text-sm font-medium">{cat.replace('-', ' ')}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Products */}
      <FlatList
        data={data.slice(0, 8)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ProductCard item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export function CategoriesScreen() {
  const categories = ['laptops', 'vehicle', 'womens-jewellery', 'mobile-accessories']

  return (
    <View className="flex-1 bg-[#D9D9D9] px-4 pt-14">
      <Text className="text-2xl font-bold text-[#1E1E1E] mb-6">Categories</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity className="bg-white p-4 rounded-2xl mb-4">
            <Text className="text-lg font-medium text-[#1E1E1E]">{item.replace('-', ' ')}</Text>
            <Text className="text-sm text-gray-500">Explore products</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}
