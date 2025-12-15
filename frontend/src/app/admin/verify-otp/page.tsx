"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  AlertCircle,
  Clock,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function AdminOTPVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const type = searchParams.get("type") || "registration"; // 'register', 'login', or 'forgot'

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const otpRefs = useRef([]);

  // OTP Timer Effect
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResendOtp(true);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      router.push("/admin/login");
    }
  }, [email, router]);

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear errors when user starts typing
    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: "" }));
    }

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const pasteDigits = pasteData.replace(/\D/g, "").slice(0, 6);

    if (pasteDigits.length === 6) {
      const newOtp = pasteDigits.split("");
      setOtp(newOtp);
      otpRefs.current[5]?.focus();
    }
  };

  // Handle OTP Verification
  // const handleOtpVerify = async (e) => {
  //   e.preventDefault();
  //   const otpString = otp.join('');

  //   if (otpString.length !== 6) {
  //     setErrors({ otp: 'Please enter complete 6-digit OTP' });
  //     return;
  //   }

  //   if (!/^\d{6}$/.test(otpString)) {
  //     setErrors({ otp: 'OTP must contain only numbers' });
  //     return;
  //   }

  //   setIsLoading(true);
  //   setErrors({});

  //   try {
  //     // Simulate API call
  //     await new Promise(resolve => setTimeout(resolve, 2000));

  //     // Simulate successful verification
  //     setIsSuccess(true);

  //     // Wait a bit to show success state
  //     setTimeout(() => {
  //       // Redirect based on type
  //       if (type === 'forgot') {
  //         router.push(`/admin/reset-password?email=${encodeURIComponent(email)}&token=${otpString}`);
  //       } else {
  //         // For login/register, redirect to dashboard or success page
  //         router.push('/admin/dashboard');
  //       }
  //     }, 1500);

  //   } catch (error) {
  //     setErrors({ otp: 'Invalid OTP. Please try again.' });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = Array.isArray(otp) ? otp.join("") : String(otp || "");

    if (otpString.length !== 6) {
      setErrors({ otp: "Please enter complete 6-digit OTP" });
      return;
    }
    if (!/^[0-9]{6}$/.test(otpString)) {
      setErrors({ otp: "OTP must contain only numbers" });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || "", otp: otpString, type }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);

        // short delay to show success UI, then navigate
        setTimeout(() => {
          if (type === "forgot") {
            // backend may return a reset token; if provided, include it
            const token = data?.resetToken
              ? `&token=${encodeURIComponent(data.resetToken)}`
              : "";
            router.push(
              `/admin/reset-password?email=${encodeURIComponent(email)}${token}`
            );
          } else {
            router.push("/admin");
          }
        }, 1200);
      } else {
        setErrors({
          otp: data.error || data.message || "OTP verification failed",
        });
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      setErrors({ otp: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResendOtp) return;

    setIsLoading(true);
    setCanResendOtp(false);
    setOtpTimer(60);
    setOtp(["", "", "", "", "", ""]);
    setErrors({});

    try {
      const resp = await fetch(`${API_BASE}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || "", type }),
      });

      const result = await resp.json();
      if (!resp.ok) {
        throw new Error(
          result.error || result.message || "Failed to resend OTP"
        );
      }

      // Focus first input after resend
      otpRefs.current[0]?.focus();
    } catch (err) {
      console.error("Resend OTP error:", err);
      setErrors({ general: "Failed to resend OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const successVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  // Get page title and description based on type
  const getPageContent = () => {
    switch (type) {
      case "login":
        return {
          title: "Verify Login",
          description:
            "Enter the verification code sent to your email to complete login",
        };
      case "forgot":
        return {
          title: "Verify Reset Code",
          description: "Enter the verification code to reset your password",
        };
      default:
        return {
          title: "Verify Your Account",
          description:
            "Enter the verification code sent to your email to activate your account",
        };
    }
  };

  const pageContent = getPageContent();

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 -right-5 w-32 h-32 bg-purple-500/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-pink-500/20 rounded-full animate-pulse"></div>
        </div>

        <motion.div
          className="w-full max-w-md relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
            <motion.div
              variants={successVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-2xl font-bold text-white mb-4">
              Verification Successful!
            </h1>

            <p className="text-white/70 mb-6">
              {type === "forgot"
                ? "Redirecting to password reset..."
                : "Welcome to your admin dashboard!"}
            </p>

            <div className="flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-purple-400 animate-spin mr-2" />
              <span className="text-purple-400">Redirecting...</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 -right-5 w-32 h-32 bg-purple-500/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-pink-500/20 rounded-full animate-pulse"></div>
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Glassmorphism Card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {pageContent.title}
            </h1>
            <p className="text-white/70 mb-4">{pageContent.description}</p>
            <p className="text-purple-400 font-semibold text-sm bg-white/5 rounded-lg px-3 py-2 inline-block">
              {email}
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleOtpVerify} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-center"
              >
                <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                <p className="text-red-400 text-sm">{errors.general}</p>
              </motion.div>
            )}

            {/* OTP Input Fields */}
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength="1"
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(index, e.target.value.replace(/\D/g, ""))
                  }
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  className={`w-12 h-12 bg-white/10 border rounded-xl text-center text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    errors.otp ? "border-red-500/50" : "border-white/20"
                  }`}
                  whileFocus={{ scale: 1.1 }}
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* OTP Error */}
            {errors.otp && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center flex items-center justify-center"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.otp}
              </motion.p>
            )}

            {/* Timer and Resend */}
            <div className="text-center">
              {otpTimer > 0 ? (
                <div className="flex items-center justify-center text-white/70">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Resend code in {otpTimer}s</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResendOtp || isLoading}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Resend OTP"}
                </button>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || otp.join("").length !== 6}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl py-4 font-semibold flex items-center justify-center space-x-2 hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Verify & Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {/* Back Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  if (type === "forgot") {
                    router.push("/admin/forgot-password");
                  } else if (type === "login") {
                    router.push("/admin/login");
                  } else {
                    router.push("/admin/register");
                  }
                }}
                className="text-white/70 hover:text-white transition-colors"
                disabled={isLoading}
              >
                ← Back to{" "}
                {type === "login"
                  ? "Login"
                  : type === "forgot"
                  ? "Forgot Password"
                  : "Register"}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/50 text-sm">
            © 2025 Charity Trust Admin Portal. All rights reserved.
          </p>
        </div>
      </motion.div>

      {/* Floating particles animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
