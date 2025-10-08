"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

interface ICardProps {
  star?: number;
  title?: string;
  image: string;
  delay?: number;
}

const PackageCart: React.FC<ICardProps> = ({
  star = 5,
  title = "Best Creatine in Budget",
  image,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03 }}
      className="w-full max-w-[350px] bg-[#F27D31] rounded-sm shadow-lg overflow-hidden cursor-pointer transition-transform duration-300"
    >
      {/* Image */}
      <div className="relative w-full h-[350px] bg-[#F27D31]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 280px"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Rating */}
        <div className="flex items-center gap-1 text-yellow-400">
          {Array.from({ length: star }).map((_, i) => (
            <Star key={i} size={16} fill="#FACC15" stroke="#FACC15" />
          ))}
          {Array.from({ length: 5 - star }).map((_, i) => (
            <Star key={i} size={16} className="text-gray-300" />
          ))}
        </div>

        {/* Title */}
        <h2 className="text-base md:text-lg font-semibold text-white line-clamp-2">
          {title}
        </h2>
      </div>
    </motion.div>
  );
};

export default PackageCart;
