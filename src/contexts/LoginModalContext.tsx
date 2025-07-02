"use client";

import { createContext, useState, ReactNode, useContext } from "react";

export interface LoginModalContextType {
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  toggleLogin: () => void;
}

const LoginModalContext = createContext<LoginModalContextType>({
  isLoginOpen: false,
  openLogin: () => {},
  closeLogin: () => {},
  toggleLogin: () => {},
});

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);
  const toggleLogin = () => setIsLoginOpen(prev => !prev);

  return (
    <LoginModalContext.Provider value={{ isLoginOpen, openLogin, closeLogin, toggleLogin }}>
      {children}
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  return useContext(LoginModalContext);
}

export default LoginModalContext;
