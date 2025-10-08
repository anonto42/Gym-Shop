"use client";

import React from "react";
import { motion } from "framer-motion";

const messages = [
  "🥇 Best Butter in Bangladesh",
  "🚚 Only 80৳ Delivery Charge All Over BD",
  "💸 Best Price in the Market",
  "📦 Cash on Delivery Anywhere in Bangladesh",
  "🔥 100% Pure & Fresh Quality Guaranteed",
  "🌍 Delivery Available Anywhere in Bangladesh",
];

const AutoScrollBanner = () => {
  return (
    <div className="w-full overflow-hidden bg-[#ffffff] py-3">
      <motion.div
        className="flex gap-10 whitespace-nowrap text-black font-semibold text-sm md:text-base"
        animate={{ x: ["0%", "-100%"] }}
        transition={{
          ease: "linear",
          duration: 20, // control speed (lower = faster)
          repeat: Infinity,
        }}
      >
        {/* ✅ Duplicate content for seamless loop */}
        {[...messages, ...messages].map((msg, i) => (
          <span key={i} className="flex-shrink-0 px-6">
            {msg}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default AutoScrollBanner;
