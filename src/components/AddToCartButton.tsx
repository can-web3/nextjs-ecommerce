// src/components/AddToCartButton.tsx
"use client";

import { useCart } from "@/contexts/CartContext";
import { toast } from "react-toastify";
import React from "react";

interface Props {
  id: number;
  title: string;
  price: number;
  image: string;
}

export function AddToCartButton({ id, title, price, image }: Props) {
  const { addToCart } = useCart();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({ id, title, price, image });
    toast.success(`"${title}" sepete eklendi`);
  };

  return (
    <button
      onClick={handleClick}
      className="btn-primary mt-4 cursor-pointer"
      type="button"
    >
      Sepete Ekle
    </button>
  );
}
