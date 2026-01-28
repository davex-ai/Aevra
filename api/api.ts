import axios from "axios";
import { ApiResponse } from "../types/api";
import { Product } from "../types/product";
import { Category } from "../types/category";

const API_BASE_URL = "https://dummyjson.com";

async function fetchData<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await axios.get<T>(`${API_BASE_URL}${endpoint}`);
    return { data: response.data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error:
        err?.response?.data?.message ??
        err?.message ??
        "Something went wrong",
    };
  }
}

export const getCategories = () =>
  fetchData<Category[]>("/products/categories");

export const getProductsByCategory = (category: string, limit: number) =>
  fetchData<{ products: Product[] }>(
    `/products/category/${category}?limit=${limit}`
  );

export const getProducts = (limit = 20, skip = 0) =>
  fetchData<{ products: Product[] }>(`/products?limit=${limit}&skip=${skip}`);

export const getProduct = (id: number) =>
  fetchData<Product>(`/products/${id}`);
// api/api.ts
export async function searchProducts({
  q,
  sortBy,
  order,
  select,
  limit = 10,
  skip = 0,
}: {
  q: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  select?: string[]; // array of field names
  limit?: number;
  skip?: number;
}) {
  const params = new URLSearchParams();

  params.append('q', q);
  if (sortBy) params.append('sortBy', sortBy);
  if (order) params.append('order', order);
  if (select && select.length > 0) params.append('select', select.join(','));
  params.append('limit', limit.toString());
  params.append('skip', skip.toString());

  const url = `https://dummyjson.com/products/search?${params.toString()}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}
