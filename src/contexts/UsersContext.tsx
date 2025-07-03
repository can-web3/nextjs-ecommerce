// src/contexts/UsersContext.tsx
"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  // gerekirse diğer alanlar
}

interface UsersContextType {
  users: User[] | null;
  loading: boolean;
  error: Error | null;
}

const UsersContext = createContext<UsersContextType>({
  users: null,
  loading: true,
  error: null,
});

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch("https://dummyjson.com/users")
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
        return res.json();
      })
      .then((data: { users: User[] }) => setUsers(data.users))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <UsersContext.Provider value={{ users, loading, error }}>
      {children}
    </UsersContext.Provider>
  );
}

// **BUNU EKLEYİN**:
export function useUsers() {
  return useContext(UsersContext);
}
