export interface Review {
  reviewerName: string;
  reviewerEmail?: string;
  rating: number;
  comment: string;
  date?: string;
}

export interface Product {
  id: number;
  title: string;
  description?: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating?: number;
  thumbnail?: string;
  images?: string[];
  brand?: string;
  tags?: string[];
  availabilityStatus?: string;
  stock?: number; 
  reviews?: Review[]; 
  shippingInformation?: string;
  warrantyInformation?: string;
}
