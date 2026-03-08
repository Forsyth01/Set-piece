"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ArrowLeft,
  Lock,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const router = useRouter();

  const [activeStep, setActiveStep] = useState("shipping");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: ""
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });

  const [errors, setErrors] = useState({});

  const validateShipping = () => {
    const newErrors = {};
    if (!shippingInfo.email) newErrors.email = "Email is required";
    if (!shippingInfo.firstName) newErrors.firstName = "First name is required";
    if (!shippingInfo.lastName) newErrors.lastName = "Last name is required";
    if (!shippingInfo.address) newErrors.address = "Address is required";
    if (!shippingInfo.city) newErrors.city = "City is required";
    if (!shippingInfo.state) newErrors.state = "State is required";
    if (!shippingInfo.zipCode) newErrors.zipCode = "ZIP code is required";
    if (!shippingInfo.phone) newErrors.phone = "Phone is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    if (!paymentInfo.cardNumber) newErrors.cardNumber = "Card number is required";
    if (!paymentInfo.cardName) newErrors.cardName = "Name on card is required";
    if (!paymentInfo.expiryDate) newErrors.expiryDate = "Expiry date is required";
    if (!paymentInfo.cvv) newErrors.cvv = "CVV is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    if (validateShipping()) {
      setActiveStep("payment");
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (validatePayment()) {
      setOrderPlaced(true);
      setTimeout(() => {
        clearCart();
        router.push("/");
      }, 3000);
    }
  };

  if (cart.length === 0 && !orderPlaced) {
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

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-4">Order Placed!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your order. You'll receive a confirmation email shortly.
          </p>
          <p className="text-sm text-gray-500">Redirecting to home page...</p>
        </motion.div>
      </main>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4 transition"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </Link>
          <h1 className="text-4xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  activeStep === "shipping" ? "bg-black text-white" : "bg-green-500 text-white"
                }`}>
                  {activeStep === "payment" ? "✓" : "1"}
                </div>
                <span className={`font-medium ${activeStep === "shipping" ? "text-black" : "text-gray-400"}`}>
                  Shipping
                </span>
              </div>

              <div className="flex-1 h-0.5 bg-gray-300" />

              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  activeStep === "payment" ? "bg-black text-white" : "bg-gray-300 text-gray-600"
                }`}>
                  2
                </div>
                <span className={`font-medium ${activeStep === "payment" ? "text-black" : "text-gray-400"}`}>
                  Payment
                </span>
              </div>
            </div>

            {/* Shipping Form */}
            <AnimatePresence mode="wait">
              {activeStep === "shipping" && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Truck size={24} />
                    <h2 className="text-2xl font-bold">Shipping Information</h2>
                  </div>

                  <form onSubmit={handleContinueToPayment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle size={14} /> {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <input
                          type="text"
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none ${
                            errors.firstName ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <input
                          type="text"
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none ${
                            errors.lastName ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Street Address</label>
                      <input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none ${
                          errors.address ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">City</label>
                        <input
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none ${
                            errors.city ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">State</label>
                        <input
                          type="text"
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none ${
                            errors.state ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">ZIP Code</label>
                        <input
                          type="text"
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none ${
                            errors.zipCode ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <input
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition mt-6"
                    >
                      Continue to Payment
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Payment Form */}
              {activeStep === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard size={24} />
                    <h2 className="text-2xl font-bold">Payment Information</h2>
                  </div>

                  <form onSubmit={handlePlaceOrder} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Card Number</label>
                      <input
                        type="text"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none ${
                          errors.cardNumber ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                      {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Name on Card</label>
                      <input
                        type="text"
                        value={paymentInfo.cardName}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none ${
                          errors.cardName ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Expiry Date</label>
                        <input
                          type="text"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none ${
                            errors.expiryDate ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                        {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">CVV</label>
                        <input
                          type="text"
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none ${
                            errors.cvv ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="123"
                          maxLength="4"
                        />
                        {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <button
                        type="button"
                        onClick={() => setActiveStep("shipping")}
                        className="flex-1 border-2 border-gray-300 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
                      >
                        <Lock size={20} />
                        Place Order
                      </button>
                    </div>
                  </form>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Lock size={16} />
                      <span>Your payment information is secure and encrypted</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 pb-4 border-b">
                    <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-gray-600">Size: {item.size}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-bold text-sm mt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-3xl font-bold">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3 pt-6 border-t">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span>Free shipping</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Lock size={16} />
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
    </main>
  );
}
