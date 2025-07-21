// src/components/LoginModal.tsx
"use client";

import { useState, useContext, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import LoginModalContext from "@/contexts/LoginModalContext";
import { useUsers } from "@/contexts/UsersContext";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

type EmailForm = { email: string };
type CodeForm = { code: string };

export default function LoginModal() {
  const { isLoginOpen, closeLogin } = useContext(LoginModalContext);
  const { login } = useAuth();
  const { users, loading: usersLoading, error: usersError } = useUsers();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [devCode, setDevCode] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isValid: isEmailValid },
  } = useForm<EmailForm>({ mode: "onTouched", defaultValues: { email: "" } });

  const {
    register: registerCode,
    handleSubmit: handleCodeSubmit,
    formState: { errors: codeErrors, isValid: isCodeValid },
  } = useForm<CodeForm>({ mode: "onTouched", defaultValues: { code: "" } });

  const startTimer = () => {
    setTimeLeft(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((p) => (p <= 1 ? (clearInterval(timerRef.current!), 0) : p - 1));
    }, 1000);
  };

  useEffect(() => {
    if (step === 2) startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  if (!isLoginOpen || usersLoading) return null;
  if (usersError)
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded shadow">
          Kullanıcı verisi yüklenemedi
          <button
            onClick={closeLogin}
            className="ml-4 px-2 py-1 bg-gray-200 rounded"
          >
            Kapat
          </button>
        </div>
      </div>
    );

  const onEmailSubmit = async (data: EmailForm) => {
    const found = users?.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );
    if (!found) {
      toast.error("E-posta bulunamadı");
      return;
    }
    setEmail(data.email);
    const res = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email }),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      toast.error(json.error || "Kod gönderilemedi");
      return;
    }
    setDevCode(json.code);
    toast.success("Kod gönderildi (terminalde de görebilirsiniz)");
    setStep(2);
  };

  const onCodeSubmit = async (data: CodeForm) => {
    const res = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: data.code.trim() }),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      toast.error(json.error || "Kod geçersiz");
      return;
    }
    const user = users!.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    )!;
    login({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    toast.success("Giriş başarılı!");
    closeLogin();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <button
          onClick={closeLogin}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={18} />
        </button>

        {step === 1 ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">E-posta ile Giriş</h2>
            <div className="bg-amber-200 p-2 mb-2">
              <span className="text-sm"><span className="font-bold">E-posta:</span> emily.johnson@x.dummyjson.com</span>
            </div>
            <form
              onSubmit={handleEmailSubmit(onEmailSubmit)}
              className="space-y-4"
            >
              <label className="block text-sm font-medium">
                E-posta Adresi
              </label>
              <input
                name="email"
                type="email"
                {...registerEmail("email", {
                  required: "E-posta gerekli",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Geçerli e-posta girin",
                  },
                })}
                className={`w-full border rounded px-3 py-2 focus:ring ${
                  emailErrors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {emailErrors.email && (
                <p className="text-red-500 text-sm">
                  {emailErrors.email.message}
                </p>
              )}
              <button
                type="submit"
                disabled={!isEmailValid}
                className={`w-full py-2 rounded ${
                  isEmailValid ? "btn-primary" : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Kodu Gönder
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">Doğrulama Kodu</h2>
            {devCode && (
              <p className="text-sm text-gray-500 mb-2">
                🚧 Geliştirme kodu: <strong>{devCode}</strong>
              </p>
            )}
            {timeLeft > 0 ? (
              <p className="text-center text-sm text-gray-600 mb-2">
                Kalan süre: <span className="font-mono">{timeLeft}s</span>
              </p>
            ) : (
              <button
                onClick={() => setStep(1)}
                className="text-blue-600 hover:underline mb-2"
              >
                Yeniden Gönder
              </button>
            )}
  
            <form
              onSubmit={handleCodeSubmit(onCodeSubmit)}
              className="space-y-4"
            >
              <label className="block text-sm font-medium">6 Haneli Kod</label>
              <input
                type="text"
                maxLength={6}
                {...registerCode("code", {
                  required: "Kod gerekli",
                  pattern: { value: /^\d{6}$/, message: "6 haneli girin" },
                })}
                className={`w-full border rounded px-3 py-2 focus:ring ${
                  codeErrors.code ? "border-red-500" : "border-gray-300"
                }`}
              />
              {codeErrors.code && (
                <p className="text-red-500 text-sm">{codeErrors.code.message}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border py-2 rounded"
                >
                  Geri
                </button>
                <button
                  type="submit"
                  disabled={!isCodeValid}
                  className={`flex-1 py-2 rounded ${
                    isCodeValid ? "btn-primary" : "bg-gray-300 cursor-not-allowed"
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
