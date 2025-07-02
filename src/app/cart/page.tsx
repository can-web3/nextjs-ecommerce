// src/app/cart/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const { cart, addToCart, decreaseQuantity, removeFromCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="container p-4">
        <h1 className="text-2xl font-semibold mb-4">Sepetim</h1>
        <p>Sepetinizde henüz ürün yok.</p>
      </main>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleDecrease = (itemId: number, title: string) => {
    decreaseQuantity(itemId);
    toast.info(`"${title}" adeti azaltıldı`);
  };

  const handleRemove = (itemId: number, title: string) => {
    removeFromCart(itemId);
    toast.error(`"${title}" sepetten çıkarıldı`);
  };

  return (
    <main className="container p-4">
      <h1 className="text-2xl font-semibold mb-4">Sepetim</h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border border-gray-300 rounded p-4"
          >
            <Link href={`/product/${item.id}`} className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover rounded"
              />
            </Link>
            <div className="flex-1">
              <Link href={`/product/${item.id}`}>
                <h2 className="text-lg font-medium hover:underline">{item.title}</h2>
              </Link>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => handleDecrease(item.id, item.title)}
                  className="p-1 rounded border border-gray-400 hover:bg-gray-100 cursor-pointer"
                >
                  <FaMinus />
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  onClick={() => {
                    addToCart({
                      id: item.id,
                      title: item.title,
                      price: item.price,
                      image: item.image,
                    });
                    toast.success(`"${item.title}" adeti artırıldı`);
                  }}
                  className="p-1 rounded border border-gray-400 hover:bg-gray-100 cursor-pointer"
                >
                  <FaPlus />
                </button>
              </div>
              <p className="text-gray-800 mt-2">
                Fiyat: <strong>{(item.price * item.quantity).toFixed(2)} ₺</strong>
              </p>
            </div>
            <button
              onClick={() => handleRemove(item.id, item.title)}
              className="text-red-600 hover:text-red-800 cursor-pointer"
              title="Ürünü sepetten çıkar"
            >
              <FaTrash size={20} />
            </button>
          </div>
        ))}

        <div className="flex justify-between items-center mt-4">
          <div className="text-xl font-semibold">
            Toplam Tutar: {total.toFixed(2)} ₺
          </div>
          <button
            onClick={() => router.push("/checkout")}
            className="btn-primary cursor-pointer"
            type="button"
          >
            Ödeme Yap
          </button>
        </div>
      </div>
    </main>
  );
}
