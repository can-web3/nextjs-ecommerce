// contexts/AuthContext.tsx
"use client";

import { createContext, ReactNode, useContext, useState, useEffect } from "react";

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Başlangıçta LocalStorage'dan yükle
  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("auth_user");
      }
    }
    setLoading(false);
  }, []);

  // 2. login olunca hem state hem LocalStorage güncelle
  const login = (newUser: AuthUser) => {
    setUser(newUser);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
  };

  // 3. logout olunca hem state hem LocalStorage sil
  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
