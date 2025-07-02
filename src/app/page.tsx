"use client";

import { Products } from "@/components/Products";

export default function Home() {
  return (
    <main className="container p-4">
      <h1 className="text-2xl mb-4">Ürünler</h1>
      <Products />
    </main>
  );
}
