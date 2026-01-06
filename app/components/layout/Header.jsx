"use client";

import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/app/context/CartContext";

export default function Header() {
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 bg-white border-b"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          Headless
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/products" className="hover:text-gray-600">
            Products
          </Link>
          <Link href="/about" className="hover:text-gray-600">
            About
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative hover:text-gray-600"
          >
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu (later) */}
          <button className="md:hidden">
            <Menu size={22} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}