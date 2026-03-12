"use client";

import { useState } from "react";

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
    setStatus("success");
    setTimeout(() => {
      setEmail("");
      setStatus("idle");
    }, 3000);
  }

  return (
    <section className="w-full">
      <div className="max-w-3xl mx-auto px-6 py-28 text-center">
        <h2 className="font-bold mb-4 text-[clamp(1.4rem,3vw,2rem)]">
          Subscribe
        </h2>

        <p className="text-gray-500 mb-10 text-[clamp(0.85rem,1.4vw,1rem)]">
          Stay updated with the latest drops and exclusive offers.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <input
            type="email"
            placeholder="yourmail@setpiece.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-3 outline-none focus:ring-1 focus:ring-black text-[clamp(0.8rem,1.3vw,0.95rem)] rounded-sm transition"
          />

          <button
            type="submit"
            className={`border px-8 py-3 cursor-pointer text-white transition text-[clamp(0.75rem,1.2vw,0.9rem)] rounded-sm whitespace-nowrap hover:scale-105 active:scale-95 ${
              status === "success"
                ? "bg-green-600"
                : "bg-[#1E1E1E] hover:bg-black"
            }`}
          >
            {status === "success" ? "Subscribed!" : "Subscribe"}
          </button>
        </form>

        {status === "success" && (
          <p className="mt-6 text-green-600 text-[clamp(0.75rem,1.2vw,0.9rem)] font-medium">
            Thanks for subscribing!
          </p>
        )}

        {status === "error" && (
          <p className="mt-6 text-red-600 text-[clamp(0.75rem,1.2vw,0.9rem)] font-medium">
            Please enter a valid email address.
          </p>
        )}
      </div>
    </section>
  );
}
