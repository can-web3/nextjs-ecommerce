// src/components/ProductFavoriteToggle.tsx
"use client";

import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "react-toastify";
import React from "react";

export function ProductFavoriteToggle({
  productId,
  title,
}: {
  productId: number;
  title: string;
}) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFav = favorites.includes(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(productId);
    toast[isFav ? "error" : "success"](
      `"${title}" ${isFav ? "favorilerden çıkarıldı" : "favorilere eklendi"}`
    );
  };

  return (
    <button
      aria-label={
        isFav 
        ? `${title} favorilerden çıkar` 
        : `${title} favorilere ekle`
      }
      onClick={handleClick}
      className="absolute top-2 right-2 focus-ring"
    >
      {isFav ? (
        <FaHeart size={22} className="text-red-600" />
      ) : (
        <FaRegHeart size={22} />
      )}
    </button>
  );
}
