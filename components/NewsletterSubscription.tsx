"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ReCAPTCHA from "react-google-recaptcha";

const subscriptionSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  interests: z.array(z.enum(["web", "oyun", "yapay_zeka"])).min(1, "En az bir ilgi alanı seçmelisiniz"),
  verificationCode: z.string().optional(),
});

type SubscriptionForm = z.infer<typeof subscriptionSchema>;

export function NewsletterSubscription() {
  const [step, setStep] = useState<"captcha" | "form" | "verification">("captcha");
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SubscriptionForm>({
    resolver: zodResolver(subscriptionSchema),
  });

  const onCaptchaChange = async (value: string | null) => {
    if (value) {
      setRecaptchaValue(value);
      setStep("form");
    }
  };

  const onSubmit = async (data: SubscriptionForm) => {
    if (step === "form") {
      try {
        const response = await fetch("/api/subscribe/send-verification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            recaptchaToken: recaptchaValue,
          }),
        });

        if (response.ok) {
          setStep("verification");
          setVerificationSent(true);
        } else {
          // Hata işleme
          console.error("Doğrulama kodu gönderilirken bir hata oluştu");
        }
      } catch (error) {
        console.error("Bir hata oluştu:", error);
      }
    } else if (step === "verification") {
      try {
        const response = await fetch("/api/subscribe/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          // Başarılı kayıt
          alert("Aboneliğiniz başarıyla tamamlandı!");
        } else {
          // Hata işleme
          alert("Doğrulama başarısız oldu. Lütfen tekrar deneyin.");
        }
      } catch (error) {
        console.error("Bir hata oluştu:", error);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        Bülten Aboneliği
      </h2>

      {step === "captcha" && (
        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
            onChange={onCaptchaChange}
          />
        </div>
      )}

      {(step === "form" || step === "verification") && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {step === "form" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ad
                </label>
                <input
                  type="text"
                  {...register("firstName")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Soyad
                </label>
                <input
                  type="text"
                  {...register("lastName")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  E-posta
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  İlgi Alanları
                </label>
                <div className="mt-2 space-y-2">
                  <div>
                    <input
                      type="checkbox"
                      {...register("interests")}
                      value="web"
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Web Geliştirme</span>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      {...register("interests")}
                      value="oyun"
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Oyun Geliştirme</span>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      {...register("interests")}
                      value="yapay_zeka"
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Yapay Zeka</span>
                  </div>
                </div>
                {errors.interests && (
                  <p className="mt-1 text-sm text-red-600">{errors.interests.message}</p>
                )}
              </div>
            </>
          )}

          {step === "verification" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Doğrulama Kodu
              </label>
              <input
                type="text"
                {...register("verificationCode")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="E-postanıza gönderilen kodu giriniz"
              />
              {errors.verificationCode && (
                <p className="mt-1 text-sm text-red-600">{errors.verificationCode.message}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {step === "form" ? "Doğrulama Kodu Gönder" : "Aboneliği Tamamla"}
          </button>
        </form>
      )}
    </div>
  );
} 