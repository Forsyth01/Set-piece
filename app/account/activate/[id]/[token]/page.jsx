"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Lock, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { activateCustomer } from "@/app/lib/shopify/customer";

export default function ActivateAccountPage() {
  const router = useRouter();
  const params = useParams();
  const { id, token } = params;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isActivated, setIsActivated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    // Validation
    if (!password || !confirmPassword) {
      setErrors(["Please fill in all fields"]);
      return;
    }

    if (password.length < 5) {
      setErrors(["Password must be at least 5 characters"]);
      return;
    }

    if (password !== confirmPassword) {
      setErrors(["Passwords do not match"]);
      return;
    }

    setIsLoading(true);

    // Build the Shopify customer GID
    const customerId = `gid://shopify/Customer/${id}`;

    const result = await activateCustomer(customerId, token, password);

    if (result.success) {
      // Store the access token
      localStorage.setItem("shopify_customer_token", result.accessToken);
      localStorage.setItem("shopify_customer_token_expiry", result.expiresAt);
      setIsActivated(true);

      // Redirect to account page after a moment
      setTimeout(() => {
        router.push("/account");
      }, 2000);
    } else {
      setErrors(result.errors || ["Failed to activate account"]);
    }

    setIsLoading(false);
  };

  // Success state
  if (isActivated) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Account Activated!
            </h1>
            <p className="text-gray-500 mb-6">
              Your account has been successfully activated. Redirecting to your account...
            </p>
            <Loader2 className="animate-spin text-gray-400 mx-auto" size={24} />
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Activate Your Account
            </h1>
            <p className="text-gray-500">
              Create a password to complete your account setup
            </p>
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
            >
              {errors.map((error, index) => (
                <p key={index} className="text-red-600 text-sm flex items-center gap-2">
                  <XCircle size={16} />
                  {error}
                </p>
              ))}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition outline-none text-gray-900"
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition outline-none text-gray-900"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold text-base transition hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Activating...
                </>
              ) : (
                "Activate Account"
              )}
            </button>
          </form>
        </div>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link
            href="/account/login"
            className="text-sm text-gray-500 hover:text-black transition"
          >
            &larr; Back to Login
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
