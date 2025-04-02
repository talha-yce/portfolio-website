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
  language: z.enum(["tr", "en"], {
    required_error: "Lütfen bir dil seçiniz",
  }),
  verificationCode: z.string().optional(),
});

const verificationSchema = z.object({
  verificationCode: z.string().min(6, "Doğrulama kodu 6 haneli olmalıdır").max(6, "Doğrulama kodu 6 haneli olmalıdır").regex(/^[0-9]{6}$/, "Doğrulama kodu sadece rakamlardan oluşmalıdır"),
});

type SubscriptionForm = z.infer<typeof subscriptionSchema>;
type VerificationForm = z.infer<typeof verificationSchema>;

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  interests: string[];
  language: string;
  verificationCode?: string;
};

export function NewsletterSubscription() {
  const [step, setStep] = useState<"recaptcha" | "form" | "verification" | "success">("recaptcha");
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    interests: [],
    language: "tr",
  });

  const {
    register: registerSubscription,
    handleSubmit: handleSubmitSubscription,
    formState: { errors: subscriptionErrors },
    reset: resetSubscription,
  } = useForm<SubscriptionForm>({
    resolver: zodResolver(subscriptionSchema),
    mode: "onChange",
  });

  const {
    register: registerVerification,
    handleSubmit: handleSubmitVerification,
    formState: { errors: verificationErrors },
    reset: resetVerification,
  } = useForm<VerificationForm>({
    resolver: zodResolver(verificationSchema),
    mode: "onChange",
  });

  const resetForm = () => {
    setStep("recaptcha");
    setVerificationSent(false);
    setError(null);
    setLoading(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      interests: [],
      language: "tr",
    });
    resetSubscription();
    resetVerification();
  };

  const onSubmitSubscription = async (data: SubscriptionForm) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch("/api/subscribe/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          interests: data.interests,
          language: data.language,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Doğrulama kodu gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }

      setStep("verification");
      setVerificationSent(true);
      setFormData(prev => ({
        ...prev,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        interests: data.interests,
        language: data.language,
      }));
      resetSubscription();
      resetVerification();
    } catch (error) {
      console.error("Hata:", error);
      setError(error instanceof Error ? error.message : "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitVerification = async (data: VerificationForm) => {
    try {
      setError(null);
      setLoading(true);

      console.log("Doğrulama isteği gönderiliyor:", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        verificationCode: data.verificationCode,
        language: formData.language,
        interests: formData.interests,
      });

      const response = await fetch("/api/subscribe/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          verificationCode: data.verificationCode,
          language: formData.language,
          interests: formData.interests,
        }),
      });

      console.log("Doğrulama yanıtı:", response);

      const result = await response.json();
      console.log("Doğrulama sonucu:", result);

      if (!response.ok) {
        throw new Error(result.error || "Doğrulama başarısız oldu. Lütfen kodu kontrol edip tekrar deneyin.");
      }

      setStep("success");
      resetSubscription();
      resetVerification();
    } catch (error) {
      console.error("Hata:", error);
      setError(error instanceof Error ? error.message : "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecaptchaSuccess = () => {
    setStep("form");
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {step === "recaptcha" ? "Güvenlik Doğrulaması" : 
           step === "form" ? "Bülten Aboneliği" : 
           step === "verification" ? "Doğrulama Kodu" : "Başarılı!"}
        </h2>
        {step !== "success" && step !== "recaptcha" && (
          <button
            type="button"
            onClick={resetForm}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Yeniden Başlat
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {step === "recaptcha" ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-gray-600 dark:text-gray-300 text-center">
            {formData.language === "tr" 
              ? "Lütfen robot olmadığınızı doğrulayın"
              : "Please verify that you are not a robot"}
          </p>
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
            onChange={handleRecaptchaSuccess}
            className="flex justify-center"
          />
        </div>
      ) : step === "success" ? (
        <div className="text-center">
          <div className="mb-4 text-green-500">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {formData.language === "tr" ? "Aboneliğiniz Başarıyla Tamamlandı!" : "Your Subscription is Complete!"}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {formData.language === "tr" 
              ? "Bültenimize hoş geldiniz. En kısa sürede size ulaşacağız."
              : "Welcome to our newsletter. We will contact you soon."}
          </p>
        </div>
      ) : (
        <>
          {step === "form" ? (
            <form onSubmit={handleSubmitSubscription(onSubmitSubscription)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ad
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    {...registerSubscription("firstName")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  {subscriptionErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{subscriptionErrors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Soyad
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    {...registerSubscription("lastName")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  {subscriptionErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{subscriptionErrors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  {...registerSubscription("email")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                {subscriptionErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{subscriptionErrors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dil Seçimi
                </label>
                <div className="space-y-2">
                  <label className="inline-flex items-center mr-4">
                    <input
                      type="radio"
                      value="tr"
                      {...registerSubscription("language")}
                      className="form-radio text-blue-600"
                      defaultChecked
                    />
                    <span className="ml-2">Türkçe</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="en"
                      {...registerSubscription("language")}
                      className="form-radio text-blue-600"
                    />
                    <span className="ml-2">English</span>
                  </label>
                </div>
                {subscriptionErrors.language && (
                  <p className="mt-1 text-sm text-red-600">{subscriptionErrors.language.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İlgi Alanları
                </label>
                <div className="space-y-2">
                  {["web", "oyun", "yapay_zeka"].map((interest) => (
                    <label key={interest} className="flex items-center">
                      <input
                        type="checkbox"
                        value={interest}
                        {...registerSubscription("interests")}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {interest === "web" ? "Web Geliştirme" : interest === "oyun" ? "Oyun Geliştirme" : "Yapay Zeka"}
                      </span>
                    </label>
                  ))}
                  {subscriptionErrors.interests && (
                    <p className="mt-1 text-sm text-red-600">{subscriptionErrors.interests.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading 
                  ? (formData.language === "tr" ? "İşleniyor..." : "Processing...") 
                  : (formData.language === "tr" ? "Doğrulama Kodu Gönder" : "Send Verification Code")}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitVerification(onSubmitVerification)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {formData.language === "tr" ? "Doğrulama Kodu" : "Verification Code"}
                </label>
                <input
                  type="text"
                  {...registerVerification("verificationCode")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder={formData.language === "tr" ? "E-postanıza gönderilen kodu giriniz" : "Enter the code sent to your email"}
                  maxLength={6}
                />
                {verificationErrors.verificationCode && (
                  <p className="mt-1 text-sm text-red-600">{verificationErrors.verificationCode.message}</p>
                )}
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>{formData.language === "tr" 
                    ? "E-posta adresinize gönderilen 6 haneli doğrulama kodunu giriniz."
                    : "Enter the 6-digit verification code sent to your email address."}</p>
                  <p>{formData.language === "tr"
                    ? "Eğer kodu almadıysanız, spam klasörünüzü kontrol edin."
                    : "If you haven't received the code, please check your spam folder."}</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading 
                  ? (formData.language === "tr" ? "İşleniyor..." : "Processing...") 
                  : (formData.language === "tr" ? "Aboneliği Tamamla" : "Complete Subscription")}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
} 