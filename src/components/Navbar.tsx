// src/components/Navbar.tsx
"use client";

import { useState } from "react";
import logo from "@/assets/images/logo.webp";
import Image from "next/image";
import Link from "next/link";
import { FaRegHeart, FaBars, FaTimes } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { useLoginModal } from "@/contexts/LoginModalContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { cart } = useCart();
  const { openLogin } = useLoginModal();
  const favCount = favorites.length;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/">
          <Image src={logo} alt="logo" className="w-[140px]" />
        </Link>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/favorites" className="relative flex flex-col items-center gap-1">
            <FaRegHeart size={22} />
            Favoriler
            {favCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {favCount}
              </span>
            )}
          </Link>

          {user ? (
            <Link href="/cart" className="relative flex flex-col items-center gap-1">
              <FiShoppingCart size={22} />
              Sepet
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          ) : (
            <button onClick={openLogin} className="relative flex flex-col items-center gap-1 cursor-pointer">
              <FiShoppingCart size={22} />
              Sepet
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <span>Merhaba, {user.firstName}</span>
              <button onClick={logout} className="btn-outline-primary">
                Çıkış Yap
              </button>
            </div>
          ) : (
            <>
              <button onClick={openLogin} className="btn-primary">
                Giriş Yap
              </button>
              <Link href="/" className="btn-outline-primary">
                Kayıt Ol
              </Link>
            </>
          )}
        </nav>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden p-2 focus:outline-none"
          aria-label="Mobil menüyü aç/kapat"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`
          md:hidden
          overflow-hidden
          transition-max-height duration-300
          ${isMenuOpen ? "max-h-[300px] py-4" : "max-h-0"}
          bg-white
        `}
      >
        <div className="flex flex-col gap-4 container mx-auto px-4">
          <Link href="/favorites" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 cursor-pointer">
            <FaRegHeart /> Favoriler ({favCount})
          </Link>

          {user ? (
            <Link href="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 cursor-pointer">
              <FiShoppingCart /> Sepet ({cartCount})
            </Link>
          ) : (
            <button
              onClick={() => {
                openLogin();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 text-left cursor-pointer"
            >
              <FiShoppingCart /> Sepet
            </button>
          )}

          <hr />

          {user ? (
            <>
              <span>Merhaba, {user.firstName}</span>
              <button onClick={logout} className="btn-outline-primary text-left">
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  openLogin();
                  setMenuOpen(false);
                }}
                className="btn-primary text-left"
              >
                Giriş Yap
              </button>
              <Link href="/" onClick={() => setMenuOpen(false)} className="btn-outline-primary text-left">
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
