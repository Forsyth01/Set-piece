"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  User,
  Package,
  LogOut,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AccountPage() {
  const { customer, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/account/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (!isAuthenticated || !customer) {
    return null;
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "fulfilled":
        return <CheckCircle2 size={16} className="text-green-500" />;
      case "pending":
      case "unfulfilled":
        return <Clock size={16} className="text-yellow-500" />;
      case "in_transit":
      case "partially_fulfilled":
        return <Truck size={16} className="text-blue-500" />;
      case "refunded":
      case "voided":
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Package size={16} className="text-gray-400" />;
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Processing";
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-black font-medium">My Account</span>
        </nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white text-xl font-bold">
                {customer.firstName?.[0]?.toUpperCase() || "U"}
                {customer.lastName?.[0]?.toUpperCase() || ""}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {customer.firstName} {customer.lastName}
                </h1>
                <p className="text-gray-500">{customer.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline font-medium">Sign Out</span>
            </button>
          </div>
        </motion.div>

        {/* Orders Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Package size={20} />
              Order History
            </h2>
            <span className="text-sm text-gray-500">
              {customer.orders?.length || 0} order(s)
            </span>
          </div>

          {customer.orders?.length > 0 ? (
            <div className="space-y-4">
              {customer.orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-4 sm:p-6 border-b border-gray-100">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Order {order.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.processedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          {getStatusIcon(order.fulfillmentStatus)}
                          <span className="text-gray-600">
                            {formatStatus(order.fulfillmentStatus)}
                          </span>
                        </div>
                        <span className="font-bold text-gray-900">
                          ${order.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {order.lineItems.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex gap-4">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg bg-gray-100"
                            />
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                              <ShoppingBag size={24} className="text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {item.title}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {item.options?.map((opt, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                >
                                  {opt.value}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm text-gray-500">
                                Qty: {item.quantity}
                              </span>
                              <span className="font-medium text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-sm p-12 text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={28} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-500 mb-6">
                When you place an order, it will appear here.
              </p>
              <Link
                href="/collections/shorts"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
              >
                Start Shopping
                <ChevronRight size={18} />
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <Link
            href="/wishlist"
            className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition group"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
              <User size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Wishlist</h3>
              <p className="text-sm text-gray-500">View saved items</p>
            </div>
            <ChevronRight size={20} className="ml-auto text-gray-400" />
          </Link>
          <Link
            href="/contact"
            className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition group"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
              <Package size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Need Help?</h3>
              <p className="text-sm text-gray-500">Contact our support</p>
            </div>
            <ChevronRight size={20} className="ml-auto text-gray-400" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
