"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | success | error

  function handleSubmit(e) {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    // Frontend-only for now
    // Later → Shopify Email / Klaviyo / API route
    setStatus("success");
    setTimeout(() => {
      setEmail("");
      setStatus("idle");
    }, 3000);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

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
    <section className="w-full">
      <motion.div
        className="max-w-3xl mx-auto px-6 py-28 text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Heading */}
        <motion.h2
          variants={itemVariants}
          className="font-bold mb-4 text-[clamp(1.4rem,3vw,2rem)]"
        >
          Subscribe
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-gray-500 mb-10 text-[clamp(0.85rem,1.4vw,1rem)]"
        >
          Stay updated with the latest drops and exclusive offers.
        </motion.p>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <motion.input
            type="email"
            placeholder="yourmail@setpiece.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-3 outline-none focus:ring-1 focus:ring-black text-[clamp(0.8rem,1.3vw,0.95rem)] rounded-sm"
            whileFocus={{ scale: 1.02, borderColor: "#000" }}
            transition={{ duration: 0.2 }}
          />

          <motion.button
            type="submit"
            className="border px-8 py-3 cursor-pointer hover:bg-black bg-[#1E1E1E] text-white transition text-[clamp(0.75rem,1.2vw,0.9rem)] rounded-sm whitespace-nowrap"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={
              status === "success"
                ? {
                    backgroundColor: "#16a34a",
                    scale: [1, 1.05, 1],
                  }
                : status === "error"
                ? {
                    x: [0, -10, 10, -10, 10, 0],
                  }
                : {}
            }
            transition={{ duration: 0.5 }}
          >
            {status === "success" ? "✓ Subscribed!" : "Subscribe"}
          </motion.button>
        </motion.form>

        {/* Feedback */}
        <AnimatePresence mode="wait">
          {status === "success" && (
            <motion.p
              key="success"
              className="mt-6 text-green-600 text-[clamp(0.75rem,1.2vw,0.9rem)] font-medium"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              🎉 Thanks for subscribing!
            </motion.p>
          )}

          {status === "error" && (
            <motion.p
              key="error"
              className="mt-6 text-red-600 text-[clamp(0.75rem,1.2vw,0.9rem)] font-medium"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
              }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              ⚠️ Please enter a valid email address.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Decorative elements */}
        <motion.div
          className="mt-12 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-gray-300"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}