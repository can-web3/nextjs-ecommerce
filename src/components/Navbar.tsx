// src/components/Navbar.tsx
"use client";

import logo from "@/assets/images/logo.webp";
import Image from "next/image";
import Link from "next/link";
import { FaRegHeart, FaBars } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";

export default function Navbar() {
  const { user, loading, logout, login } = useAuth();
  const { favorites } = useFavorites();
  const { cart } = useCart();
  const favCount = favorites.length;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const demoUser = {
    id: 1,
    email: "demo@site.com",
    firstName: "Demo",
    lastName: "User",
  };

  return (
    <header className="container relative flex justify-between items-center lg:px-0 px-2">
      <Link href="/">
        <Image src={logo} className="w-[140px]" alt="logo" />
      </Link>

      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
        </div>
      ) : (
        <nav className="md:inline-block hidden">
          <ul className="flex items-center gap-6">
            <li>
              <Link href="/favorites" className="relative inline-flex flex-col items-center gap-1">
                <FaRegHeart size={22} />
                Favoriler
                {favCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 mr-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {favCount}
                  </span>
                )}
              </Link>
            </li>
            <li>
              {user ? (
                <Link href="/cart" className="relative inline-flex flex-col items-center gap-1">
                  <FiShoppingCart size={22} />
                  Sepet
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              ) : (
                <button
                  onClick={() => login(demoUser)}
                  className="inline-flex flex-col items-center gap-1"
                >
                  <FiShoppingCart size={22} />
                  Sepet
                </button>
              )}
            </li>
            {user ? (
              <li className="flex items-center gap-2">
                <span>Merhaba, {user.firstName}</span>
                <button onClick={logout} className="btn-outline-primary" type="button">
                  Çıkış Yap
                </button>
              </li>
            ) : (
              <>
                <li>
                  <button onClick={() => login(demoUser)} type="button" className="btn-primary">
                    Giriş Yap
                  </button>
                </li>
                <li>
                  <Link href="/" className="btn-outline-primary">
                    Kayıt ol
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}

      <button type="button" className="btn-outline-primary md:hidden">
        <FaBars />
        Menü
      </button>
    </header>
  );
}
