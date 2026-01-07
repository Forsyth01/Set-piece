"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function TrustBar() {
  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-6 sm:py-16 py-10 relative">
        
        {/* Value Props */}
        <div className="flex flex-row gap-12">
          <Value title="100%" subtitle="AUTHENTIC" />
          <Value title="XL–3XL" subtitle="SIZE RANGE" />
          <Value title="US" subtitle="SHIPPING" />
        </div>

        {/* Scroll Indicator – CENTERED */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="hidden md:flex flex-col items-center
                     absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                     text-gray-400 tracking-widest"
        >
          <span className="text-[clamp(0.6rem,1.2vw,0.75rem)]">
            SCROLL
          </span>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="mt-2"
          >
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Sub-component ---------- */

function Value({ title, subtitle }) {
  return (
    <div className="flex flex-col">
      <span
        className="font-bold leading-none
        text-[clamp(1.75rem,4vw,3rem)] black tracking-tight"
      >
        {title}
      </span>

      <span
        className="mt-2 tracking-widest text-gray-500
        text-[clamp(0.6rem,1.2vw,0.75rem)] inter"
      >
        {subtitle}
      </span>
    </div>
  );
}
