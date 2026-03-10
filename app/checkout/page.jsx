"use client";

import { useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, proceedToCheckout, checkoutUrl, isInitialized } = useCart();

  // Auto-redirect to Shopify checkout when ready
  useEffect(() => {
    if (isInitialized && cart.length > 0 && checkoutUrl) {
      // Small delay to show the redirect message
      const timer = setTimeout(() => {
        proceedToCheckout();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, cart.length, checkoutUrl, proceedToCheckout]);

  // Empty cart state
  if (isInitialized && cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Add some items to your cart before checking out
            </p>
            <Link
              href="/collections/shorts"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all hover:scale-105 font-medium"
            >
              <ArrowLeft size={20} />
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Redirecting state
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="w-20 h-20 mx-auto mb-6 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={48} className="text-black" />
        </motion.div>
        <h1 className="text-2xl font-bold mb-4">Redirecting to Checkout</h1>
        <p className="text-gray-600 mb-6">
          You're being redirected to our secure checkout powered by Shopify.
        </p>

        {/* Manual checkout button as fallback */}
        <button
          onClick={proceedToCheckout}
          disabled={!checkoutUrl}
          className="w-full bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition disabled:bg-gray-400"
        >
          {checkoutUrl ? "Continue to Checkout" : "Loading..."}
        </button>

        <Link
          href="/cart"
          className="block mt-4 text-sm text-gray-600 hover:text-black underline"
        >
          Return to Cart
        </Link>
      </motion.div>
    </main>
  );
}
