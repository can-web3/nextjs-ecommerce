// src/contexts/ProductContext.tsx
"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import axios from "axios";

export interface Product {
  id: number;
  title: string;
  images: string[];
  description: string;
  price: number;
  category: string;      // ← burayı ekledik
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: unknown;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  loading: true,
  error: null,
});

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    axios
      .get<{ products: Product[] }>(
        "https://dummyjson.com/products?select=id,title,images,description,price,category" // ← category’yi de select’ledik
      )
      .then((res) => setProducts(res.data.products))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
