import { Ionicons } from "@expo/vector-icons";

export type CategorySlug =
  | "beauty"
  | "fragrances"
  | "furniture"
  | "groceries"
  | "home-decoration"
  | "kitchen-accessories"
  | "laptops"
  | "mens-shirts"
  | "mens-shoes"
  | "mens-watches"
  | "mobile-accessories"
  | "motorcycle"
  | "skin-care"
  | "smartphones"
  | "sports-accessories"
  | "sunglasses"
  | "tablets"
  | "tops"
  | "vehicle"
  | "womens-bags"
  | "womens-dresses"
  | "womens-jewellery"
  | "womens-shoes"
  | "womens-watches";

export interface Category {
  slug: CategorySlug;
  name: string;
  url: string;
}

export interface CategoryWithMeta extends Category {
  icon: keyof typeof Ionicons.glyphMap;
}
