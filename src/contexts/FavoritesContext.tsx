"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface FavoritesContextType {
  favorites: number[];
  toggleFavorite: (productId: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<number[]>([]);

  // Kullanıcı değişince localStorage'dan yükle
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`favorites_${user.id}`);
      setFavorites(stored ? JSON.parse(stored) : []);
    } else {
      setFavorites([]);
    }
  }, [user]);

  // favorites değişince localStorage'a yaz
  useEffect(() => {
    if (user) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const toggleFavorite = (productId: number) => {
    if (!user) return; // ya da burada openLoginModal()
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
