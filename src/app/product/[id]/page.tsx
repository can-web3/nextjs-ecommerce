// src/app/product/[id]/page.tsx
import Image from "next/image";
import { Metadata } from "next";
import { ProductFavoriteToggle } from "@/components/ProductFavoriteToggle";
import { AddToCartButton } from "@/components/AddToCartButton";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const res = await fetch(`https://dummyjson.com/products/${params.id}`);
  const product = await res.json();
  return { title: product.title };
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const res = await fetch(`https://dummyjson.com/products/${params.id}`);
  if (!res.ok) throw new Error("Ürün bulunamadı");
  const product: Product = await res.json();

  return (
    <main className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full aspect-square overflow-hidden rounded-lg shadow">
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

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
          <p className="text-2xl font-semibold">{product.price} ₺</p>
          
          <AddToCartButton
            id={product.id}
            title={product.title}  
            price={product.price}
            image={product.images[0]}
          />
        </div>
      </div>
    </main>
  );
}
