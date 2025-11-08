"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getBannerMessagesServerSide } from "@/server/functions/banner.fun";

interface BannerMessage {
  _id: string;
  text: string;
  icon: string;
  isActive: boolean;
}

const AutoScrollBanner = () => {
  const [messages, setMessages] = useState<BannerMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBannerMessages();
  }, []);

  const fetchBannerMessages = async () => {
    try {
      const response = await getBannerMessagesServerSide();
      if (!response.isError && response.data) {
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error("Failed to fetch banner messages:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-[#ffffff] py-3">
        <div className="flex justify-center">
          <div className="animate-pulse text-gray-400">Loading messages...</div>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return null;
  }

  const displayMessages = [...messages, ...messages];

  return (
    <div className="w-full overflow-hidden bg-[#ffffff] border-b border-gray-100 py-3">
      <motion.div
        className="flex gap-8 whitespace-nowrap text-gray-800 font-semibold text-sm md:text-base"
        animate={{ x: ["0%", "-100%"] }}
        transition={{
          ease: "linear",
          duration: messages.length * 5, // Dynamic duration based on message count
          repeat: Infinity,
        }}
      >
        {displayMessages.map((msg, i) => (
          <span key={`${msg._id}-${i}`} className="flex items-center gap-2 flex-shrink-0 px-4">
            <span className="text-orange-500">{msg.icon}</span>
            {msg.text}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default AutoScrollBanner;