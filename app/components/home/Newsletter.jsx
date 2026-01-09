"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | success | error

  function handleSubmit(e) {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }

    // Frontend-only for now
    // Later → Shopify Email / Klaviyo / API route
    setStatus("success");
    setEmail("");
  }

  return (
    <section className="w-full ">
      <div className="max-w-3xl mx-auto px-6 py-28 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-bold mb-4
            text-[clamp(1.4rem,3vw,2rem)]"
        >
          Subscribe
        </motion.h2>

        {/* Subtitle */}
        <p
          className="text-gray-500 mb-10
          text-[clamp(0.85rem,1.4vw,1rem)]"
        >
          Stay updated with the latest drops and exclusive offers.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <input
            type="email"
            placeholder="yourmail@setpiece.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-3 outline-none
              focus:ring-1 focus:ring-black
              text-[clamp(0.8rem,1.3vw,0.95rem)] rounded-sm"
          />

          <button
            type="submit"
            className="border px-8 py-3 cursor-pointer
              hover:bg-black bg-[#1E1E1E] text-white transition
              text-[clamp(0.75rem,1.2vw,0.9rem)] rounded-sm"
          >
            Subscribe
          </button>
        </form>

        {/* Feedback */}
        {status === "success" && (
          <p
            className="mt-6 text-green-600
            text-[clamp(0.75rem,1.2vw,0.9rem)]"
          >
            Thanks for subscribing!
          </p>
        )}

        {status === "error" && (
          <p
            className="mt-6 text-red-600
            text-[clamp(0.75rem,1.2vw,0.9rem)]"
          >
            Please enter a valid email address.
          </p>
        )}
      </div>
    </section>
  );
}
