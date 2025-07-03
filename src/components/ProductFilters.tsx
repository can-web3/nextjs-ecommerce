// src/components/ProductFilters.tsx
"use client";

import React from "react";

interface Props {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  minPrice: number;
  maxPrice: number;
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  minPrice,
  maxPrice,
}: Props) {
  const formatLabel = (cat: string) =>
    cat.charAt(0).toUpperCase() + cat.slice(1);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
      {/* category */}
      <div role="radiogroup" aria-label="Kategori filtresi" className="flex flex-wrap gap-2">
        {categories.map((cat, i) => (
          <button
            key={cat}
            role="radio"
            aria-checked={selectedCategory === cat}
            tabIndex={selectedCategory === cat ? 0 : -1}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") onCategoryChange(categories[(i + 1) % categories.length]);
              if (e.key === "ArrowLeft")
                onCategoryChange(categories[(i - 1 + categories.length) % categories.length]);
            }}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm focus-ring-primary transition-colors duration-150 cursor-pointer ${
              selectedCategory === cat
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {formatLabel(cat)}
          </button>
        ))}
      </div>

      {/* price range */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Min ₺</span>
          <input
            type="number"
            min={minPrice}
            max={priceRange[1]}
            value={priceRange[0]}
            onChange={(e) =>
              onPriceChange([
                Math.min(Number(e.target.value), priceRange[1]),
                priceRange[1],
              ])
            }
            className="input-base bg-gray-50 text-right w-32 cursor-pointer"
            placeholder={`${minPrice}`}
          />
        </div>
        <div className="text-gray-400 select-none">—</div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Max ₺</span>
          <input
            type="number"
            min={priceRange[0]}
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) =>
              onPriceChange([
                priceRange[0],
                Math.max(Number(e.target.value), priceRange[0]),
              ])
            }
            className="input-base bg-gray-50 text-right w-32 cursor-pointer"
            placeholder={`${maxPrice}`}
          />
        </div>
      </div>
    </div>
  );
}
