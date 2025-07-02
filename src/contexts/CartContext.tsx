// src/contexts/CartContext.tsx
"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  decreaseQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  decreaseQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`cart_${user.id}`);
      setCart(stored ? JSON.parse(stored) : []);
    } else {
      setCart([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (item: Omit<CartItem, "quantity">) =>
    setCart((prev) => {
      const ex = prev.find((i) => i.id === item.id);
      if (ex) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

  const decreaseQuantity = (id: number) =>
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
        )
        .filter((i) => i.quantity > 0)
    );

  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
