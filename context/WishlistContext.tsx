import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "../types/product";
import { useAuth } from "./AuthContext";

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = (uid: string) => `@wishlist:${uid}`;

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);

useEffect(() => {
  (async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    try {
      const json = await AsyncStorage.getItem(
        WISHLIST_STORAGE_KEY(user.uid)
      );
      if (json) setWishlist(JSON.parse(json));
    } catch (err) {
      console.error("Failed to load wishlist", err);
    }
  })();
}, [user]);

useEffect(() => {
  if (!user) return;

  AsyncStorage.setItem(
    WISHLIST_STORAGE_KEY(user.uid),
    JSON.stringify(wishlist)
  ).catch(console.error);
}, [wishlist, user]);


  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (!prev.some((p) => p.id === product.id)) return [...prev, product];
      return prev;
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some((p) => p.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};
