// src/app/favorites/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useProducts } from "@/contexts/ProductContext";
import { ProductFavoriteToggle } from "@/components/ProductFavoriteToggle";

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const { favorites } = useFavorites();
  const { products, loading: prodLoading } = useProducts();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  if (authLoading || prodLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const favProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <main className="container p-4">
      <h1 className="text-2xl font-semibold mb-4">Favorilerim</h1>

      {favProducts.length === 0 ? (
        <p>Henüz favori eklenmiş ürün yok.</p>
      ) : (
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-4">
          {favProducts.map((product) => (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="relative flex flex-col gap-2 border border-gray-300 p-2"
            >
              <div className="relative w-full aspect-square overflow-hidden rounded-lg">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                <ProductFavoriteToggle
                  productId={product.id}
                  title={product.title}
                />
              </div>
              <h2 className="text-lg font-medium">{product.title}</h2>
              <p className="line-clamp-2 text-gray-600">
                {product.description}
              </p>
              <p className="font-semibold">{product.price} ₺</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
