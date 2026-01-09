"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ChevronDown } from "lucide-react";

const categories = [
  { label: "New Arrivals", handle: "new-arrivals" },
  { label: "Shorts", handle: "soccer-shorts" },
  { label: "Hoodies", handle: "hoodies-joggers" },
  { label: "Accessories", handle: "accessories" },
];

const navItems = [
  { label: "SHORTS", handle: "soccer-shorts" },
  { label: "HOODIES", handle: "hoodies-joggers" },
  { label: "ACCESSORIES", handle: "accessories" },
  { label: "THE VAULT", handle: "the-vault" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div 
      className="border-t"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 hidden md:flex items-center justify-between">
        {/* Categories Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 font-medium cursor-pointer select-none"
            aria-expanded={open}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Menu size={20} />
            </motion.div>
            <span className="hidden sm:inline text-md font-bold">CATEGORIES</span>
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {open && (
              <motion.div
                className="absolute left-0 mt-3 w-56 bg-white border rounded-md shadow-lg z-50 overflow-hidden"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <ul className="py-2">
                  {categories.map((cat, index) => (
                    <motion.li
                      key={cat.handle}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={`/collections/${cat.handle}`}
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <motion.span
                          whileHover={{ x: 5 }}
                          className="inline-block"
                        >
                          {cat.label}
                        </motion.span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Nav */}
        <motion.nav 
          className="hidden md:flex items-center gap-8 text-md font-semibold uppercase"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {navItems.map((item, index) => (
            <Link
              key={item.handle}
              href={`/collections/${item.handle}`}
              className="relative cursor-pointer font-bold group"
            >
              <motion.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="inline-block"
                whileHover={{ y: -2 }}
              >
                {item.label}
              </motion.span>
              
              {/* Underline animation */}
              <motion.span
                className="absolute left-0 bottom-0 h-0.5 bg-black"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          ))}
        </motion.nav>

        {/* Featured */}
        <Link
          href="/collections/girls-collections"
          className="text-md font-bold uppercase cursor-pointer relative group"
        >
          <motion.span
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-block"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            GIRLS COLLECTION
          </motion.span>
          
          {/* Underline animation */}
          <motion.span
            className="absolute left-0 bottom-0 h-0.5 bg-black"
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </Link>
      </div>
    </motion.div>
  );
}