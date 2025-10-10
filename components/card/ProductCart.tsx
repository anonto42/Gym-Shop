"use client";
import Image from "next/image";
import { TbCurrencyTaka } from "react-icons/tb";
import React from "react";

interface ProductCartProps {
  name?: string;
  category?: string;
  price?: number;
  discount?: number;
  priceAfterDiscount?: number;
  image: string;
}

function ProductCart({
  name = "Product Name",
  category = "Category",
  price = 100,
  discount = 20,
  priceAfterDiscount = price - price * (discount / 100),
  image,
}: ProductCartProps) {
  return (
    <div className="w-full max-w-[280px] sm:max-w-[220px] md:max-w-[250px] lg:max-w-[300px] bg-white border border-gray-200 shadow-md rounded-md overflow-hidden flex flex-col relative transition-transform duration-300 hover:scale-[1.02]">
      {/* Discount Badge */}
      <div className="absolute top-2 left-2 bg-[#F27D31] text-white text-xs font-semibold w-[38px] h-[24px] rounded-full flex items-center justify-center z-10">
        -{discount}%
      </div>

      {/* Image Section */}
      <div className="relative w-full aspect-[1/1.1] z-0">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover rounded-t-md"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col items-center text-center p-3 flex-grow">
        <h1 className="text-sm sm:text-base font-semibold truncate w-full">
          {name}
        </h1>
        <h3 className="text-xs sm:text-sm text-gray-500">{category}</h3>
        <h2 className="text-sm sm:text-base font-semibold mt-1 flex items-center">
          <TbCurrencyTaka />
          {priceAfterDiscount}{" /"}
          <span className="text-red-500 line-through text-xs sm:text-sm flex items-center ml-1">
            <TbCurrencyTaka />
            {price}
          </span>
        </h2>
      </div>

      {/* Button */}
      <div className="p-3 pt-0">
        <button className="w-full bg-black text-white text-xs sm:text-sm py-2 rounded-md hover:bg-gray-800 transition">
          View Details
        </button>
      </div>
    </div>
  );
}

export default ProductCart;
