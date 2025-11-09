"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

interface ICardProps {
  star?: number;
  title?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  image: string;
  features?: string[];
  category?: string;
  delay?: number;
  isFeatured?: boolean;
}

const PackageCart: React.FC<ICardProps> = ({
  star = 5,
  title = "Best Creatine in Budget",
  description,
  price = 0,
  originalPrice,
  image,
  features = [],
  category,
  delay = 0,
  isFeatured = false,
}) => {
  // Format price to display with 2 decimal places
  const formattedPrice = price.toFixed(2);
  const formattedOriginalPrice = originalPrice?.toFixed(2);

  console.log("log from the package cart: _->> ",image)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03 }}
      className="w-full max-w-[350px] bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-transform duration-300 border border-gray-200"
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-[#F27D31] to-[#FF6B35] text-white px-3 py-1 rounded-full text-xs font-bold z-10">
          Featured
        </div>
      )}

      {/* Category Badge */}
      {category && (
        <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs z-10">
          {category}
        </div>
      )}

      {/* Image */}
      <div className="relative w-full h-[200px] bg-gray-100">
        <Image
          src={image || "/placeholder-image.jpg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 280px"
          onError={(e) => {
            // Fallback for broken images
            e.currentTarget.src = "/placeholder-image.jpg";
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({star})</span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-800 line-clamp-2">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        )}

        {/* Features */}
        {features.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-700">Includes:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              {features.slice(0, 2).map((feature, index) => (
                <li key={index} className="line-clamp-1">• {feature}</li>
              ))}
              {features.length > 2 && (
                <li className="text-gray-400">+{features.length - 2} more</li>
              )}
            </ul>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#F27D31]">${formattedPrice}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-500 line-through">${formattedOriginalPrice}</span>
            )}
          </div>
          
          {/* View Details Button */}
          <button className="bg-[#F27D31] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#e06d21] transition-colors">
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageCart;