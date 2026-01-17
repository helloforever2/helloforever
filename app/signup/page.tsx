"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Heart, Eye, EyeOff, ArrowRight, Shield, Clock, Star, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.terms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    setIsLoading(true);

    try {
      // Create account
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      // Auto sign in after successful signup
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Account created but sign in failed - redirect to login
        router.push("/login");
        return;
      }

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HelloForever
            </span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-slate-600">
              Start preserving your most precious messages today.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  minLength={8}
                  placeholder="Create a password (min. 8 characters)"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  minLength={8}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                disabled={isLoading}
                required
                className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-200 group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center mt-8 text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Gradient Background with Testimonial */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 p-12 items-center justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-lg text-white">
          {/* Main message */}
          <div className="mb-12">
            <Heart className="w-16 h-16 mb-6 text-orange-300" />
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Your words are your legacy.
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Create messages that will touch the hearts of your loved ones for years to come. Because some things are too important to leave unsaid.
            </p>
          </div>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-5 h-5 fill-orange-400 text-orange-400"
                />
              ))}
            </div>
            <p className="text-lg text-blue-50 mb-4 leading-relaxed">
              &quot;I recorded birthday messages for my grandchildren for the next 20 years. Knowing they&apos;ll hear my voice on their special days brings me such peace.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center font-bold text-white">
                MR
              </div>
              <div>
                <p className="font-semibold">Margaret R.</p>
                <p className="text-sm text-blue-200">HelloForever member since 2024</p>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap gap-6 text-blue-100">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Bank-level security</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm">Guaranteed delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
