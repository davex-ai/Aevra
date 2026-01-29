import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "@/types/product";
import { useAuth } from "@/context/AuthContext";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (productId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);


const CART_STORAGE_KEY = (uid: string) => `@cart:${uid}`;


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
  (async () => {
    if (!user) {
      setCart([]);
      setIsLoaded(true);
      return;
    }

    try {
      const json = await AsyncStorage.getItem(CART_STORAGE_KEY(user.uid));
      if (json) setCart(JSON.parse(json));
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setIsLoaded(true);
    }
  })();
}, [user]);

useEffect(() => {
  if (!isLoaded || !user) return;

  AsyncStorage.setItem(
    CART_STORAGE_KEY(user.uid),
    JSON.stringify(cart)
  ).catch(console.error);
}, [cart, isLoaded, user]);


  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product.price;
      const discount = item.product.discountPercentage || 0;
      const discountedPrice = price - (price * discount) / 100;
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productId: number) => {
    return cart.some((item) => item.product.id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};