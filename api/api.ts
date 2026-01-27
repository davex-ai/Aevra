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

export const getProductsByCategory = (category: string, limit = 4) =>
  fetchData<{ products: Product[] }>(
    `/products/category/${category}?limit=${limit}`
  );

export const getProducts = (limit = 20, skip = 0) =>
  fetchData<{ products: Product[] }>(`/products?limit=${limit}&skip=${skip}`);

export const getProduct = (id: number) =>
  fetchData<Product>(`/products/${id}`);

export const searchProducts = (query: string) =>
  fetchData<{ products: Product[] }>(`/products/search?q=${query}`);
