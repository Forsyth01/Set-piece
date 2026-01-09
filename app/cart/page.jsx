"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } =
    useCart();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleClearCart = () => {
    clearCart();
    setShowConfirmModal(false);
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Looks like you haven't added anything to your cart yet
            </p>
            <Link
              href="/collections/new-arrivals"
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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4 transition"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
              <p className="text-gray-600">
                {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="flex items-center gap-2 text-red-600 hover:text-white hover:bg-red-600 border border-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              <Trash2 size={16} />
              Remove All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="bg-gray-100 px-3 py-1 rounded-full">
                          Size: {item.size}
                        </span>
                        <span className="font-semibold text-black text-lg">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-full transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Item Total */}
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-gray-600">Item Total</span>
                  <span className="font-bold text-xl">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span className="font-semibold text-black">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-b py-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-3xl font-bold">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>

              <button className="w-full bg-black text-white py-4 rounded-full hover:bg-gray-800 transition-all hover:scale-105 font-semibold text-lg mb-4 shadow-lg">
                Proceed to Checkout
              </button>

              <Link
                href="/collections/new-arrivals"
                className="block text-center text-sm text-gray-600 hover:text-black transition"
              >
                or Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    🔒
                  </div>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    ↩
                  </div>
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                {/* Close Button */}
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={24} />
                </button>

                {/* Icon */}
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 size={32} className="text-red-600" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center mb-3">
                  Remove All Items?
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-center mb-8">
                  Are you sure you want to remove all {getTotalItems()} items from your cart? This action cannot be undone.
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearCart}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    Remove All
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}