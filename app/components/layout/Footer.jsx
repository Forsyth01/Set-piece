"use client";

import Link from "next/link";
import { Instagram, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-black text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Join the SetPiece Club
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Get 10% off your first order, early access to drops, and exclusive offers.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 transition"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition flex items-center gap-2"
              >
                {subscribed ? "Subscribed!" : "Subscribe"}
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <img src="/logo_icon_white.png" alt="SetPiece" className="h-8" />
              <img src="/logo_white.png" alt="SetPiece" className="h-6" />
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Premium soccer apparel for the modern football fan. Authentic quality, streetwear style.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/setpiecesclothing?igsh=MWw3dnd4MTRhcmVrag=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-6">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/collections/shorts" className="text-gray-400 text-sm hover:text-white transition">
                  Shorts
                </Link>
              </li>
              <li>
                <Link href="/collections/jerseys" className="text-gray-400 text-sm hover:text-white transition">
                  Jerseys
                </Link>
              </li>
              <li>
                <Link href="/collections/caps" className="text-gray-400 text-sm hover:text-white transition">
                  Caps
                </Link>
              </li>
              <li>
                <Link href="/collections/hoodie" className="text-gray-400 text-sm hover:text-white transition">
                  Hoodies
                </Link>
              </li>
              <li>
                <Link href="/collections/sweatshirts" className="text-gray-400 text-sm hover:text-white transition">
                  Sweatshirts
                </Link>
              </li>
              <li>
                <Link href="/collections/sweatpants" className="text-gray-400 text-sm hover:text-white transition">
                  Sweatpants
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-6">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/fit-guide" className="text-gray-400 text-sm hover:text-white transition">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 text-sm hover:text-white transition">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 text-sm hover:text-white transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 text-sm hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-400 text-sm hover:text-white transition">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-6">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 text-sm hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 text-sm hover:text-white transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 text-sm hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 text-sm hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-gray-500 mt-0.5" />
                <span className="text-gray-400 text-sm">cs@setpiecesclothing.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-gray-500 mt-0.5" />
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-500 mt-0.5" />
                <span className="text-gray-400 text-sm">USA</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} SetPiece. All rights reserved.
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-xs mr-2">We accept</span>
              <div className="flex gap-2">
                {["Visa", "MC", "Amex", "PayPal"].map((method) => (
                  <div
                    key={method}
                    className="px-2 py-1 bg-white/5 rounded text-[10px] text-gray-400 font-medium"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
