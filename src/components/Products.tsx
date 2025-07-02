// src/components/Products.tsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/contexts/ProductContext";
import { ProductFavoriteToggle } from "@/components/ProductFavoriteToggle";
import { ProductFilters } from "@/components/ProductFilters";

const PAGE_SIZE = 20;
const LOAD_DELAY = 1000;

export function Products() {
  const { products, loading } = useProducts();

  const prices = products.map((p) => p.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const allCategories = ["All", ...new Set(products.map((p) => p.category))];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  useEffect(() => {
    if (prices.length) setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice, prices.length]);

  const filtered = products.filter((p) => {
    const okCat =
      selectedCategory === "All" || p.category === selectedCategory;
    const okPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return okCat && okPrice;
  });

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const loader = useRef<HTMLDivElement>(null);

  const onIntersect: IntersectionObserverCallback = useCallback(
    (entries) => {
      if (
        entries[0].isIntersecting &&
        !loadingMore &&
        visibleCount < filtered.length
      ) {
        setLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((v) => Math.min(v + PAGE_SIZE, filtered.length));
          setLoadingMore(false);
        }, LOAD_DELAY);
      }
    },
    [filtered.length, loadingMore, visibleCount]
  );

  useEffect(() => {
    const obs = new IntersectionObserver(onIntersect, {
      rootMargin: "200px",
    });
    if (loader.current) obs.observe(loader.current);
    return () => {
      if (loader.current) obs.unobserve(loader.current);
    };
  }, [onIntersect]);

  if (loading) {
    return (
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-4 animate-pulse">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded" />
        ))}
      </div>
    );
  }

  return (
    <>
      <ProductFilters
        categories={allCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />

      <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-4">
        {filtered.slice(0, visibleCount).map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            className="relative flex flex-col gap-2 border border-gray-300 p-2 group focus-ring"
          >
            <div className="relative w-full aspect-square overflow-hidden rounded-lg">
              <Image
                src={p.images[0]}
                alt={p.title}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <ProductFavoriteToggle productId={p.id} title={p.title} />
            </div>
            <h2 className="text-lg font-medium">{p.title}</h2>
            <p className="text-gray-600 line-clamp-2">{p.description}</p>
            <p className="font-semibold">{p.price} ₺</p>
          </Link>
        ))}
      </div>

      {(loadingMore || visibleCount < filtered.length) && (
        <div
          ref={loader}
          role="status"
          aria-live="polite"
          className="mt-8 h-16 flex flex-col items-center justify-center"
        >
          {loadingMore ? (
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
          ) : (
            <span className="text-gray-500">Daha fazla yükleniyor...</span>
          )}
        </div>
      )}
    </>
  );
}
