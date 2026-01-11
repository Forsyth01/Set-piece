"use client";

import Link from "next/link";
import { Instagram, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <footer className="bg-neutral-900 text-white overflow-hidden">
      <motion.div 
        className="max-w-7xl mx-auto px-6 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-bold">
                <div className="flex items-center gap-2">
                  <motion.img 
                    src="/logo_icon_white.png" 
                    alt="" 
                    className="h-10"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.img 
                    src="/logo_white.png" 
                    alt="" 
                    className="h-10"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  />
                </div>
              </span>
            </div>

            <p
              className="text-gray-400 max-w-xs mb-6
              text-[clamp(0.8rem,1.3vw,0.95rem)]"
            >
              Premium soccer apparel for the modern football fan.
              Authentic quality, streetwear style.
            </p>

            <div className="flex gap-4">
              <motion.a
                href="#"
                aria-label="Instagram"
                className="border border-white/20 p-2 rounded-md
                hover:bg-white hover:text-black transition cursor-pointer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram size={18} />
              </motion.a>

              <motion.a
                href="#"
                aria-label="X"
                className="border border-white/20 p-2 rounded-md
                hover:bg-white hover:text-black transition cursor-pointer"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={18} />
              </motion.a>
            </div>
          </motion.div>

          {/* Shop */}
          <FooterColumn title="SHOP" variants={itemVariants}>
            <FooterLink href="/collections/jerseys">Jerseys</FooterLink>
            <FooterLink href="/collections/shorts">Shorts</FooterLink>
            <FooterLink href="/collections/hoodies">Hoodies</FooterLink>
            <FooterLink href="/collections/accessories">Accessories</FooterLink>
            <FooterLink href="/collections/the-vault">The Vault</FooterLink>
          </FooterColumn>

          {/* Support */}
          <FooterColumn title="SUPPORT" variants={itemVariants}>
            <FooterLink href="/fit-guide">Fit Guide</FooterLink>
            <FooterLink href="/shipping">Shipping & Returns</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterColumn>

          {/* Trust */}
          <FooterColumn title="TRUST & SAFETY" variants={itemVariants}>
            <FooterLink href="/authenticity">
              Authenticity Guarantee
            </FooterLink>
            <FooterLink href="/track-order">Track Item</FooterLink>
            <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
          </FooterColumn>
        </div>

        {/* Divider */}
        <motion.div 
          className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between gap-6"
          variants={itemVariants}
        >
          <p
            className="text-gray-500
            text-[clamp(0.7rem,1.2vw,0.85rem)]"
          >
            © {new Date().getFullYear()} SetPieces. All rights reserved.
          </p>

          <p
            className="text-gray-500
            text-[clamp(0.7rem,1.2vw,0.85rem)]"
          >
            US Shipping Only • Authenticity Verified
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}

/* ---------- Helpers ---------- */

function FooterColumn({ title, children, variants }) {
  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
      },
    }),
  };

  return (
    <motion.div variants={variants}>
      <h3
        className="mb-6 tracking-widest
        text-[clamp(0.75rem,1.2vw,0.85rem)]"
      >
        {title}
      </h3>
      <motion.ul 
        className="space-y-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {children}
      </motion.ul>
    </motion.div>
  );
}

function FooterLink({ href, children }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ x: 5 }}
    >
      <Link
        href={href}
        className="text-gray-400 hover:text-white transition
        cursor-pointer
        text-[clamp(0.8rem,1.3vw,0.95rem)]"
      >
        {children}
      </Link>
    </motion.li>
  );
}