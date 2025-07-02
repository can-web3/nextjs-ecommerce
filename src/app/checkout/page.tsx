// src/app/checkout/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { FormInput } from "@/components/FormInput";
import { FormControllerInput } from "@/components/FormControllerInput";

interface CheckoutForm {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { cart, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted && !authLoading && !user) router.replace("/");
  }, [mounted, authLoading, user, router]);
  useEffect(() => {
    if (mounted && !authLoading && user && cart.length === 0) router.replace("/cart");
  }, [mounted, authLoading, user, cart, router]);

  const { register, handleSubmit, control, formState } = useForm<CheckoutForm>({
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      city: "",
      zip: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
  });

  const { errors, isSubmitting } = formState;
  const onlyDigits = (s: string) => s.replace(/\D/g, "");

  const onSubmit = async (data: CheckoutForm) => {
    await new Promise((r) => setTimeout(r, 1000));
    toast.success(`Ödeme başarılı! Teşekkürler, ${data.fullName}.`);
    clearCart();
    router.replace("/");
  };

  if (!mounted || authLoading) return null;

  return (
    <main className="container p-4 max-w-lg">
      <h1 className="text-2xl font-semibold mb-6">Ödeme Bilgileri</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Ad Soyad"
          name="fullName"
          register={register}
          rules={{ required: "Bu alan zorunlu" }}
          error={errors.fullName}
        />
        <FormInput
          label="E-posta"
          name="email"
          register={register}
          rules={{
            required: "Bu alan zorunlu",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Geçerli e-posta girin",
            },
          }}
          error={errors.email}
          type="email"
        />
        <FormInput
          label="Adres"
          name="address"
          register={register}
          rules={{ required: "Bu alan zorunlu" }}
          error={errors.address}
          textarea
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Şehir"
            name="city"
            register={register}
            rules={{ required: "Bu alan zorunlu" }}
            error={errors.city}
          />
          <FormInput
            label="Posta Kodu"
            name="zip"
            register={register}
            rules={{
              required: "Bu alan zorunlu",
              pattern: { value: /^\d{5,6}$/, message: "5–6 hane girin" },
            }}
            error={errors.zip}
          />
        </div>

        <FormControllerInput
          label="Kart Numarası"
          name="cardNumber"
          control={control}
          rules={{
            required: "Bu alan zorunlu",
            validate: (v) =>
              onlyDigits(v).length === 16 || "16 haneli girin",
          }}
          error={errors.cardNumber}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          mask={(val) => {
            const d = onlyDigits(val).slice(0, 16);
            return (d.match(/.{1,4}/g) || []).join(" ");
          }}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormControllerInput
            label="Son Kullanma (MM/YY)"
            name="expiry"
            control={control}
            rules={{
              required: "Bu alan zorunlu",
              pattern: {
                value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                message: "MM/YY formatı",
              },
            }}
            error={errors.expiry}
            placeholder="MM/YY"
            maxLength={5}
            mask={(val) => {
              const d = onlyDigits(val).slice(0, 4);
              const m = d.slice(0, 2);
              const y = d.slice(2);
              return y ? `${m}/${y}` : m;
            }}
          />
          <FormControllerInput
            label="CVV"
            name="cvv"
            control={control}
            rules={{
              required: "Bu alan zorunlu",
              pattern: { value: /^\d{3,4}$/, message: "3–4 hane girin" },
            }}
            error={errors.cvv}
            placeholder="123"
            maxLength={4}
            mask={(val) => onlyDigits(val).slice(0, 4)}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="button-primary"
        >
          {isSubmitting ? "Ödeme Yapılıyor..." : "Ödemeyi Tamamla"}
        </button>
      </form>
    </main>
  );
}
