"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function RouteChangeLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Her path değiştiğinde loader'ı göster
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 200); // minimum 200ms göster

    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/75 z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
    </div>
  );
}
