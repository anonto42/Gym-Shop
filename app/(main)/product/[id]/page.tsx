"use client";

import ProductCart from "@/components/card/ProductCart";
import imageUrl from "@/const/imageUrl";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import React from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

function ProductViewPage() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* --- Title Section --- */}
      <section className="w-full text-center p-5 max-w-[800px] mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#F27D31] mb-3">
          View Details
        </h1>
        <p className="text-gray-700 text-sm md:text-base font-light leading-relaxed">
          Experience year-round comfort with our Comfort Zone, designed to keep
          your home warm in winter, cool in summer, and stylish every day.
        </p>
      </section>

      {/* --- Product Section --- */}
      <section className="w-full flex flex-col md:flex-row justify-center items-start gap-10 px-5 lg:px-20 py-6">
        {/* --- Left: Image Gallery --- */}
        <div className="flex flex-col items-center md:items-start gap-4 mx-auto">
          {/* Main Image */}
          <div className="relative w-[280px] sm:w-[350px] md:w-[400px] xl:w-[500px] aspect-square bg-gray-100 rounded-md overflow-hidden shadow-md">
            <Image
              src={imageUrl.packageImage.image1}
              alt="Product"
              fill
              className="object-cover"
              priority
              quality={90}
            />
          </div>

          {/* Sub Images */}
          <div className="flex gap-3 justify-center md:justify-start">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative w-[80px] sm:w-[100px] aspect-square rounded-md overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80 transition"
              >
                <Image
                  src={imageUrl.packageImage.image1}
                  alt="Sub Product"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* --- Right: Product Info --- */}
        <div className="flex-1 max-w-[500px] space-y-5 mx-auto">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1 text-xl text-[#F27D31]">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStarHalfAlt />
            </div>
            <p className="text-gray-700 text-sm font-light">(200 Reviews)</p>
          </div>

          {/* Product Name */}
          <h1 className="text-2xl md:text-3xl font-semibold text-[#F27D31]">
            Comfort Zone
          </h1>

          {/* Price */}
          <p className="text-xl font-semibold text-[#242222]">
            ৳ 1000{" "}
            <span className="text-sm font-light line-through text-[#F27D31] ml-1">
              ৳ 1200
            </span>
          </p>

          {/* Quantity + Buttons */}
          <div className="space-y-4 mt-6">
            {/* Quantity Selector */}
            <div className="flex items-center justify-center md:justify-start gap-4">
              <button className="p-2 border rounded hover:bg-gray-100 transition">
                <Minus />
              </button>
              <input
                type="number"
                value={1}
                readOnly
                className="w-12 text-center border rounded-sm focus:outline-none"
              />
              <button className="p-2 border rounded hover:bg-gray-100 transition">
                <Plus />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="w-full bg-[#F27D31] text-white text-lg font-semibold py-3 rounded-md hover:bg-[#e36e20] transition">
                Add to Cart
              </button>
              <button className="w-full bg-transparent border border-[#F27D31] text-[#F27D31] text-lg font-semibold py-3 rounded-md hover:bg-[#F27D31] hover:text-white transition">
                Buy Now
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* --- Related Products --- */}
      <section className="w-full text-center p-5 md:py-10 max-w-[1200px] mx-auto">
        <h2 className="text-2xl font-semibold text-[#F27D31] mb-6">
          Related Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProductCart
              key={i}
              image={imageUrl.packageImage.image1}
              name="Comfort Zone"
              price={1000}
              discount={10}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProductViewPage;
