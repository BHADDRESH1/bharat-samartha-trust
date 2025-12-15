"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  CheckCircle,
  AlertCircle,
  Phone,
  Building,
  Key,
  Clock,
  RefreshCw,
} from "lucide-react";

import { safeFetch } from "@/lib/fetchUtils";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// API Configuration (use relative paths; safeFetch will prefix if needed)
const API_BASE_URL = "/api";

// API service functions
const apiService = {
  login: async (email: string, password: string) => {
    try {
      const res = await safeFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return res;
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  },

  register: async (userData: any) => {
    try {
      const res = await safeFetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
        body: JSON.stringify(userData),
      });
      return res;
    } catch (error) {
      console.error("Register API error:", error);
      throw error;
    }
  },

  verifyOtp: async (email: string, otp: string) => {
    try {
      const res = await safeFetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      return res;
    } catch (error) {
      console.error("Verify OTP API error:", error);
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const res = await safeFetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return res;
    } catch (error) {
      console.error("Forgot password API error:", error);
      throw error;
    }
  },

  resendOtp: async (email: string) => {
    try {
      const res = await safeFetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return res;
    } catch (error) {
      console.error("Resend OTP API error:", error);
      throw error;
    }
  },
};

const AdminAuthSystem = () => {
  const [currentView, setCurrentView] = useState("login"); // login, register, otp, forgot, reset
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    organization: "",
    otp: ["", "", "", "", "", ""],
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);

  const otpRefs = useRef<any>([]);
  const router = useRouter();

  // Floating particles positions (generate on client only to avoid SSR/client hydration mismatch)
  const [particles, setParticles] = useState<any>([]);
  useEffect(() => {
    const p = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
    setParticles(p);
  }, []);

  // OTP Timer Effect
  useEffect(() => {
    let interval: any;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0 && currentView === "otp") {
      setCanResendOtp(true);
    }
    return () => clearInterval(interval);
  }, [otpTimer, currentView]);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData((prev: any) => ({ ...prev, otp: newOtp }));

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index: number, e: any) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Validation functions
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validatePhone = (phone: string) => {
    const re = /^[+]?[\d\s-()]{10,}$/;
    return re.test(phone);
  };

  // Handle Login
  const handleLogin = async (e: any) => {
    e.preventDefault();
    const newErrors: any = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiService.login(formData.email, formData.password);

      if (result.success) {
        if (result.data?.requiresOtp) {
          // Redirect to central verify-otp page with context
          router.push(
            `/admin/verify-otp?email=${encodeURIComponent(
              formData.email
            )}&type=login`
          );
        } else {
          // Store token and redirect to dashboard
          localStorage.setItem("adminToken", result.data?.token);
          alert("Login successful!");
          router.push("/admin");
        }
      } else {
        setErrors({
          general: result.data?.message || result.error || "Login failed",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrors({
        general: error.message || "Network error. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Register done;
  const handleRegister = async (e: any) => {
    e.preventDefault();
    const newErrors: any = {};

    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!validatePhone(formData.phone))
      newErrors.phone = "Invalid phone number";
    if (!formData.organization)
      newErrors.organization = "Organization is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (!validatePassword(formData.password))
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization,
        password: formData.password,
      };

      const result = await apiService.register(userData);

      if (result.success) {
        // Redirect to central verify-otp page for registration
        router.push(
          `/admin/verify-otp?email=${encodeURIComponent(
            formData.email
          )}&type=registration`
        );
      } else {
        setErrors({
          general:
            result.data?.message || result.error || "Registration failed",
        });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setErrors({
        general: error.message || "Network error. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Verification -cool
  const handleOtpVerify = async (e: any) => {
    e.preventDefault();
    const otpString = formData.otp.join("");

    if (otpString.length !== 6) {
      setErrors({ otp: "Please enter complete OTP" });
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiService.verifyOtp(formData.email, otpString);

      if (result.success) {
        // Store token and redirect
        localStorage.setItem("adminToken", result.data?.token);
        alert("Verification successful!");
        router.push("/admin");
      } else {
        setErrors({
          otp: result.data?.message || result.error || "Invalid OTP",
        });
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      setErrors({ otp: error.message || "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: any) => {
    e.preventDefault();
    if (!formData.email) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (!validateEmail(formData.email)) {
      setErrors({ email: "Invalid email format" });
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiService.forgotPassword(formData.email);

      if (result.success) {
        setCurrentView("otp");
        setOtpTimer(60);
        setCanResendOtp(false);
      } else {
        setErrors({
          email:
            result.data?.message || result.error || "Failed to send reset code",
        });
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      setErrors({ email: error.message || "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    try {
      const result = await apiService.resendOtp(formData.email);

      if (result.success) {
        setOtpTimer(60);
        setCanResendOtp(false);
        setFormData((prev: any) => ({ ...prev, otp: ["", "", "", "", "", ""] }));
      } else {
        setErrors({
          general:
            result.data?.message || result.error || "Failed to resend OTP",
        });
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      setErrors({
        general: error.message || "Network error. Please try again.",
      });
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

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } },
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 -right-5 w-32 h-32 bg-purple-500/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-pink-500/20 rounded-full animate-pulse"></div>
        </div>

        <motion.div
          className="w-full max-w-md relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
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
              <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
              <p className="text-white/70">
                {currentView === "login" && "Welcome back, please sign in"}
                {currentView === "register" && "Create your admin account"}
                {currentView === "otp" && "Enter verification code"}
                {currentView === "forgot" && "Reset your password"}
              </p>
            </div>

            {/* Error display */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                {errors.general}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {/* Login Form */}
              {currentView === "login" && (
                <motion.form
                  key="login"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleLogin}
                  className="space-y-6"
                >
                  <div>
                    <motion.div
                      className="relative"
                      variants={inputVariants}
                      whileFocus="focus"
                    >
                      <Mail className="absolute left-4 top-4 w-5 h-5 text-white/50" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </motion.div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-sm mt-1 flex items-center"
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <motion.div
                      className="relative"
                      variants={inputVariants}
                      whileFocus="focus"
                    >
                      <Lock className="absolute left-4 top-4 w-5 h-5 text-white/50" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        minLength={8}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </motion.div>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-sm mt-1 flex items-center"
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.password}
                      </motion.p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="sr-only" />
                      <div className="w-5 h-5 bg-white/10 border border-white/20 rounded flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-purple-400" />
                      </div>
                      <span className="ml-2 text-white/70 text-sm">
                        Remember me
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setCurrentView("forgot")}
                      className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl py-4 font-semibold flex items-center justify-center space-x-2 hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>

                  <div className="text-center">
                    <span className="text-white/70">Don't have an account? </span>
                    <button
                      type="button"
                      onClick={() => setCurrentView("register")}
                      className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                    >
                      Register here
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Register Form */}
              {currentView === "register" && (
                <motion.form
                  key="register"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleRegister}
                  className="space-y-4"
                >
                  <div>
                    <motion.div
                      className="relative"
                      variants={inputVariants}
                      whileFocus="focus"
                    >
                      <User className="absolute left-4 top-4 w-5 h-5 text-white/50" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </motion.div>
                    {errors.fullName && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <motion.div
                      className="relative"
                      variants={inputVariants}
                      whileFocus="focus"
                    >
                      <Mail className="absolute left-4 top-4 w-5 h-5 text-white/50" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </motion.div>
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <motion.div
                      className="relative"
                      variants={inputVariants}
                      whileFocus="focus"
                    >
                      <Phone className="absolute left-4 top-4 w-5 h-5 text-white/50" />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </motion.div>
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <motion.div
                      className="relative"
                      variants={inputVariants}
                      whileFocus="focus"
                    >
                      <Building className="absolute left-4 top-4 w-5 h-5 text-white/50" />
                      <input
                        type="text"
                        placeholder="Organization"
                        value={formData.organization}
                        onChange={(e) =>
                          handleInputChange("organization", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </motion.div>
                    {errors.organization && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.organization}
                      </p>
                    )}
                  </div>

                  <div>
                    <motion.div
                      className="relative"
                      variants={inputVariants}
                      whileFocus="focus"
                    >
                      <Lock className="absolute left-4 top-4 w-5 h-5 text-white/50" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </motion.div>
                    {errors.password && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <motion.div
                      className="relative"
                      variants={inputVariants}
                      whileFocus="focus"
                    >
                      <Key className="absolute left-4 top-4 w-5 h-5 text-white/50" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </motion.div>
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl py-4 font-semibold flex items-center justify-center space-x-2 hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 mt-6"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>

                  <div className="text-center">
                    <span className="text-white/70">
                      Already have an account?{" "}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentView("login")}
                      className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                    >
                      Sign in here
                    </button>
                  </div>
                </motion.form>
              )}

              {/* OTP Verification */}
              {currentView === "otp" && (
                <motion.form
                  key="otp"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleOtpVerify}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <p className="text-white/70 mb-4">
                      We've sent a 6-digit code to your email
                    </p>
                    <p className="text-purple-400 font-semibold">
                      {formData.email}
                    </p>
                  </div>

                  <div className="flex justify-center space-x-3">
                    {formData.otp.map((digit, index) => (
                      <motion.input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl text-center text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        whileFocus={{ scale: 1.1 }}
                      />
                    ))}
                  </div>

                  {errors.otp && (
                    <p className="text-red-400 text-sm text-center flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.otp}
                    </p>
                  )}

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
                        disabled={!canResendOtp}
                        className="text-purple-400 hover:text-purple-300 font-semibold transition-colors disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl py-4 font-semibold flex items-center justify-center space-x-2 hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setCurrentView("login")}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Forgot Password */}
              {currentView === "forgot" && (
                <motion.form
                  key="forgot"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleForgotPassword}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Reset Password
                    </h3>
                    <p className="text-white/70">
                      Enter your email address and we'll send you a code to reset
                      your password.
                    </p>
                  </div>

                  <div>
                    <motion.div
                      className="relative"
                      variants={inputVariants}
                      whileFocus="focus"
                    >
                      <Mail className="absolute left-4 top-4 w-5 h-5 text-white/50" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </motion.div>
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl py-4 font-semibold flex items-center justify-center space-x-2 hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Send Reset Code</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setCurrentView("login")}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-white/50 text-sm">
              © 2025 Charity Trust Admin Portal. All rights reserved.
            </p>
          </div>
        </motion.div>

        {/* Floating particles animation (rendered client-side only) */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.length > 0 &&
            particles.map((p: any) => (
              <motion.div
                key={p.id}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{ left: p.left, top: p.top }}
                animate={{ y: [0, -100, 0], opacity: [0, 1, 0] }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                }}
              />
            ))}
        </div>
        
        {/* Loading overlay */}
        {isLoading && (
          <LoadingSpinner 
            fullscreen={true} 
            size="lg" 
            color="purple" 
            message="Processing..." 
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AdminAuthSystem;