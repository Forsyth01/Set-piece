"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function TrustBar() {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-6 sm:py-16 py-10 relative">
        
        {/* Value Props */}
        <motion.div
          className="flex flex-row gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Value title="100%" subtitle="AUTHENTIC" index={0} />
          <Value title="XL–3XL" subtitle="SIZE RANGE" index={1} />
          <Value title="US" subtitle="SHIPPING" index={2} />
        </motion.div>

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

function Value({ title, subtitle, index }) {
  // Individual value animation variants
  const valueVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smooth effect
      },
    },
  };

  return (
    <motion.div 
      className="flex flex-col group cursor-default"
      variants={valueVariants}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
    >
      <motion.span
        className="font-bold leading-none
        text-[clamp(1.75rem,4vw,3rem)] black tracking-tight
        transition-colors duration-300 group-hover:text-gray-700"
      >
        {title}
      </motion.span>

      <motion.span
        className="mt-2 tracking-widest text-gray-500
        text-[clamp(0.6rem,1.2vw,0.75rem)] inter
        transition-colors duration-300 group-hover:text-gray-700"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 + (index * 0.15) }}
      >
        {subtitle}
      </motion.span>
    </motion.div>
  );
}