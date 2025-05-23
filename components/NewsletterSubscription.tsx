"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ReCAPTCHA from "react-google-recaptcha";
import type { Dictionary } from "@/lib/i18n/dictionaries";

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

export function NewsletterSubscription({ dictionary }: { dictionary: Dictionary }) {
  const [step, setStep] = useState<"recaptcha" | "form" | "verification" | "success">("recaptcha");
  const [verificationSent, setVerificationSent] = useState(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCodeExpired, setIsCodeExpired] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isMaxAttemptsReached, setIsMaxAttemptsReached] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    interests: [],
    language: "tr",
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

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
    setIsCodeExpired(false);
    setIsRateLimited(false);
    setIsMaxAttemptsReached(false);
    setRemainingAttempts(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      interests: [],
      language: "tr",
    });
    setVerificationCode('');
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

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/subscribe/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          verificationCode: verificationCode,
          language: formData.language,
          interests: formData.interests,
        }),
      });

      const result = await response.json();
      console.log("Doğrulama sonucu:", result);

      if (!response.ok) {
        // Kodun süresi dolmuşsa, isCodeExpired'ı true yap
        if (result.expired) {
          setIsCodeExpired(true);
          // Timer'ı durdur
          if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
          }
          setTimeRemaining(null);
        }
        
        // Maksimum başarısız deneme sayısı aşıldıysa
        if (result.maxAttemptsReached) {
          setIsMaxAttemptsReached(true);
        }
        
        // Kalan deneme sayısını göster
        if (result.remainingAttempts !== undefined) {
          setRemainingAttempts(result.remainingAttempts);
        }
        
        throw new Error(result.error || "Doğrulama başarısız oldu. Lütfen kodu kontrol edip tekrar deneyin.");
      }

      setStep("success");
      resetSubscription();
      resetVerification();
      
      // Timer'ı durdur
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      setTimeRemaining(null);
    } catch (error) {
      console.error("Hata:", error);
      setError(error instanceof Error ? error.message : "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setLoading(true);
    setIsCodeExpired(false);
    setIsMaxAttemptsReached(false);
    setRemainingAttempts(null);

    try {
      const response = await fetch("/api/subscribe/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          interests: formData.interests,
          language: formData.language
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Rate limit aşıldıysa
        if (result.rateLimited) {
          setIsRateLimited(true);
        }
        
        throw new Error(result.error || "Doğrulama kodu gönderilirken bir hata oluştu.");
      }

      // Başarılı mesajı göster
      setSuccess(formData.language === "tr" 
        ? "Yeni doğrulama kodu e-posta adresinize gönderildi."
        : "A new verification code has been sent to your email.");
      
      // 5 saniye sonra başarı mesajını temizle
      setTimeout(() => {
        setSuccess("");
      }, 5000);
      
      // Geri sayımı başlat
      startTimer();
      
    } catch (error) {
      console.error("Hata:", error);
      setError(error instanceof Error ? error.message : "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };
  
  // Geri sayım işlevi
  const startTimer = () => {
    // Önceki timer'ı temizle
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    // 3 dakika = 180 saniye
    const codeExpirationSeconds = 3 * 60;
    setTimeRemaining(codeExpirationSeconds);
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setIsCodeExpired(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimerInterval(interval);
  };
  
  // Doğrulama kodu gönderildiğinde geri sayımı başlat
  useEffect(() => {
    if (verificationSent) {
      startTimer();
    }
    
    // Component unmount olduğunda timer'ı temizle
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [verificationSent]);
  
  // Saniyeyi dakika:saniye formatına dönüştür
  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleRecaptchaSuccess = (token: string | null) => {
    if (token) {
      // Form adımına geç
      setStep("form");
      
      // Hata veya önceki durumları sıfırla
      setError(null);
      setVerificationSent(false);
      setIsCodeExpired(false);
      setIsRateLimited(false);
      setIsMaxAttemptsReached(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {step === "form" ? dictionary.newsletter.subscription : 
           step === "verification" ? dictionary.newsletter.verificationCode : 
           step === "recaptcha" ? dictionary.newsletter.subscription :
           dictionary.newsletter.success}
        </h2>
        {step !== "success" && (
          <button
            type="button"
            onClick={resetForm}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {dictionary.newsletter.restart}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {step === "success" ? (
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
            {dictionary.newsletter.subscriptionComplete}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {dictionary.newsletter.welcomeMessage}
          </p>
        </div>
      ) : (
        <>
          {step === "recaptcha" ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {dictionary.newsletter.verifyNotRobot}
              </p>
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                onChange={handleRecaptchaSuccess}
                className="flex justify-center"
              />
            </div>
          ) : step === "form" ? (
            <form onSubmit={handleSubmitSubscription(onSubmitSubscription)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {dictionary.newsletter.firstName}
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
                    {dictionary.newsletter.lastName}
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
                  {dictionary.newsletter.email}
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
                  {dictionary.newsletter.languageSelection}
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
                    <span className="ml-2">{dictionary.newsletter.turkish}</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="en"
                      {...registerSubscription("language")}
                      className="form-radio text-blue-600"
                    />
                    <span className="ml-2">{dictionary.newsletter.english}</span>
                  </label>
                </div>
                {subscriptionErrors.language && (
                  <p className="mt-1 text-sm text-red-600">{subscriptionErrors.language.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dictionary.newsletter.interests}
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
                        {interest === "web" ? dictionary.newsletter.webDevelopment : 
                         interest === "oyun" ? dictionary.newsletter.gameDevelopment : 
                         dictionary.newsletter.artificialIntelligence}
                      </span>
                    </label>
                  ))}
                  {subscriptionErrors.interests && (
                    <p className="mt-1 text-sm text-red-600">{subscriptionErrors.interests.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading 
                    ? dictionary.newsletter.processing 
                    : dictionary.newsletter.sendVerificationCode}
                </button>
                
                <button
                  type="button"
                  onClick={() => setStep("recaptcha")}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {dictionary.newsletter.back}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="mt-4">
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {dictionary.newsletter.verificationCode}
                </label>
                <div className="mt-1">
                  <input
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={dictionary.newsletter.enterVerificationCode}
                    disabled={loading || isCodeExpired || isMaxAttemptsReached || isRateLimited}
                  />
                </div>
                <div className="mt-2">
                  {remainingAttempts !== null && remainingAttempts > 0 && (
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      {dictionary.newsletter.remainingAttempts.replace("{count}", remainingAttempts.toString())}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    {dictionary.newsletter.verificationCodeSent}
                  </p>
                  <p className="text-sm text-gray-500">
                    {dictionary.newsletter.checkSpamFolder}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    {dictionary.newsletter.codeExpiresIn}
                  </p>
                  {timeRemaining !== null && (
                    <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                      {dictionary.newsletter.timeRemaining.replace("{time}", formatTime(timeRemaining))}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || isCodeExpired || isMaxAttemptsReached || isRateLimited}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading 
                  ? dictionary.newsletter.processing 
                  : dictionary.newsletter.completeSubscription}
              </button>

              <button
                type="button"
                onClick={() => setStep("form")}
                className="w-full mt-2 text-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {dictionary.newsletter.back}
              </button>

              {isCodeExpired && (
                <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-md dark:bg-yellow-800 dark:text-yellow-100">
                  <p className="text-sm font-medium">
                    {dictionary.newsletter.codeExpired}
                  </p>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading || isRateLimited}
                    className="mt-2 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading 
                      ? dictionary.newsletter.processing 
                      : dictionary.newsletter.sendNewCode}
                  </button>
                </div>
              )}

              {isMaxAttemptsReached && (
                <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md dark:bg-red-800 dark:text-red-100">
                  <p className="text-sm font-medium">
                    {dictionary.newsletter.tooManyFailedAttempts}
                  </p>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading || isRateLimited}
                    className="mt-2 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading 
                      ? dictionary.newsletter.processing 
                      : dictionary.newsletter.sendNewCode}
                  </button>
                </div>
              )}

              {isRateLimited && (
                <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md dark:bg-red-800 dark:text-red-100">
                  <p className="text-sm font-medium">
                    {dictionary.newsletter.tooManyRequests}
                  </p>
                </div>
              )}

              {!isCodeExpired && !isMaxAttemptsReached && !isRateLimited && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {dictionary.newsletter.sendNewCode}
                  </button>
                </div>
              )}
            </form>
          )}
        </>
      )}
    </div>
  );
} 