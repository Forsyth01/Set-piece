"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ChevronDown, ArrowRight } from "lucide-react";

const categories = [
  { label: "Shorts", handle: "shorts" },
  { label: "Jerseys", handle: "jerseys" },
  { label: "Caps", handle: "caps" },
  { label: "Hoodie", handle: "hoodie" },
  { label: "Sweatshirts", handle: "sweatshirts" },
  { label: "Sweatpants", handle: "sweatpants" },
];

const navItems = [
  { label: "SHORTS", handle: "shorts" },
  { label: "JERSEYS", handle: "jerseys" },
  { label: "CAPS", handle: "caps" },
  { label: "HOODIE", handle: "hoodie" },
  { label: "SWEATSHIRTS", handle: "sweatshirts" },
  { label: "SWEATPANTS", handle: "sweatpants" },
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
      className="border-t border-gray-300"
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
            {/* <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Menu size={20} />
            </motion.div> */}
            <span className="hidden sm:inline text-md tracking-[0.5rem] font-light">CATEGORIES</span>
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* <ChevronDown size={16} /> */}
              <ArrowRight size={16}/>
            </motion.div>
          </motion.button>

          
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

      </div>
    </motion.div>
  );
}