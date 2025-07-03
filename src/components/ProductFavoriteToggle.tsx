// src/components/ProductFavoriteToggle.tsx
"use client";

import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "react-toastify";

export function ProductFavoriteToggle({
  productId,
  title,
}: {
  productId: number;
  title: string;
}) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFav = favorites.includes(productId);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(productId);
    toast[isFav ? "error" : "success"](
      `"${title}" ${isFav ? "favorilerden çıkarıldı" : "favorilere eklendi"}`
    );
  };

  return (
    <button
      type="button"
      aria-label={
        isFav 
          ? `${title} favorilerden çıkar` 
          : `${title} favorilere ekle`
      }
      onClick={handleClick}
      className="absolute top-2 right-2 focus-ring cursor-pointer"
    >
      {isFav ? (
        <FaHeart size={22} className="text-red-600" />
      ) : (
        <FaRegHeart size={22} />
      )}
    </button>
  );
}
