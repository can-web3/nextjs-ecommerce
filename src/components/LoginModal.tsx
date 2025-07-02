// src/components/LoginModal.tsx
"use client";

import { useState, useContext, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import LoginModalContext from "@/contexts/LoginModalContext";
import { FaTimes } from "react-icons/fa";

type EmailForm = { email: string };
type CodeForm  = { code:  string };

export default function LoginModal() {
  const { isLoginOpen, closeLogin } = useContext(LoginModalContext);
  const [step, setStep]           = useState<1 | 2>(1);
  const [timeLeft, setTimeLeft]   = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();

  // 1. adım: email formu
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isValid: isEmailValid },
  } = useForm<EmailForm>({ mode: "onTouched", defaultValues: { email: "" } });

  // 2. adım: kod formu
  const {
    register: registerCode,
    handleSubmit: handleCodeSubmit,
    formState: { errors: codeErrors, isValid: isCodeValid },
  } = useForm<CodeForm>({ mode: "onTouched", defaultValues: { code: "" } });

  // Sayacı başlatan fonksiyon
  const startTimer = () => {
    setTimeLeft(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Adım 2'ye geçince sayacı başlat
  useEffect(() => {
    if (step === 2) {
      startTimer();
    }
    // Cleanup: unmount veya step değişirse interval'ı temizle
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  if (!isLoginOpen) return null;

  const onEmailSubmit = (data: EmailForm) => {
    // TODO: e-postayı API'ye gönder
    setStep(2);
  };

  const onCodeSubmit = (data: CodeForm) => {
    // TODO: kodu API'ye doğrulat
    closeLogin();
  };

  const handleResend = () => {
    // TODO: yeniden kod gönderme API'si
    startTimer();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <button
          onClick={closeLogin}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <FaTimes />
        </button>

        {step === 1 ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">E-posta ile Giriş</h2>
            <form
              onSubmit={handleEmailSubmit(onEmailSubmit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  {...registerEmail("email", {
                    required: "E-posta gerekli",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Geçerli bir e-posta girin",
                    },
                  })}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                    emailErrors.email
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
                />
                {emailErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {emailErrors.email.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={!isEmailValid}
                className={`w-full py-2 rounded transition ${
                  isEmailValid
                    ? "btn-primary"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                Devam Et
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">Doğrulama Kodu</h2>

            {/* Sayaç veya Yeniden Gönder */}
            {timeLeft > 0 ? (
              <p className="text-center text-sm text-gray-600 mb-2">
                Kod gönderildi. Kalan süre: <span className="font-mono">{timeLeft}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="block mx-auto mb-2 text-blue-600 hover:underline"
              >
                Kod yeniden gönder
              </button>
            )}

            <form
              onSubmit={handleCodeSubmit(onCodeSubmit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  6 Haneli Kod
                </label>
                <input
                  type="text"
                  maxLength={6}
                  {...registerCode("code", {
                    required: "Kod gerekli",
                    pattern: {
                      value: /^\d{6}$/,
                      message: "6 haneli sayı girin",
                    },
                  })}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                    codeErrors.code
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-green-200"
                  }`}
                />
                {codeErrors.code && (
                  <p className="text-red-500 text-sm mt-1">
                    {codeErrors.code.message}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-100 transition cursor-pointer"
                >
                  Geri
                </button>
                <button
                  type="submit"
                  disabled={!isCodeValid}
                  className={`flex-1 py-2 rounded transition ${
                    isCodeValid
                      ? "btn-primary"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Giriş Yap
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
