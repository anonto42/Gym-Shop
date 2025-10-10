"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCart from "@/components/card/ProductCart";
import imageUrl from "@/const/imageUrl";

function ShopPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="w-full max-w-[1500px] mx-auto flex flex-col md:flex-row h-[100svh] overflow-hidden">

        {/* --- MOBILE TOP BAR --- */}
        <div className="flex md:hidden justify-between items-center p-4 bg-white border-b shadow-sm z-20">
          <input
            type="text"
            placeholder="Search products..."
            className="w-[75%] border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-amber-400 outline-none"
          />
          <Button
            onClick={() => setIsFilterOpen(true)}
            variant="outline"
            className="border-amber-400 text-amber-500 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {/* --- DESKTOP SIDEBAR --- */}
        <aside className="hidden md:block md:w-[350px] lg:w-[400px] h-full border-gray-200 p-5 overflow-y-auto">
          <FilterSidebar />
        </aside>

        {/* --- PRODUCT GRID --- */}
        <main className="w-full h-full bg-gray-100 overflow-y-scroll flex flex-wrap gap-4 justify-center p-4">
          {Array.from({ length: 50 }).map((_, i) => (
            <ProductCart key={i} image={imageUrl.product} />
          ))}
        </main>

        {/* --- MOBILE DRAWER FILTER --- */}
        <AnimatePresence>
          {isFilterOpen && (
            <>
              {/* Overlay */}
              <motion.div
                className="fixed inset-0 bg-black/40 z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterOpen(false)}
              />

              {/* Sidebar Drawer */}
              <motion.aside
                className="fixed top-0 right-0 w-[85%] sm:w-[60%] h-full bg-white shadow-lg z-40 p-5 overflow-y-auto"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    ✕
                  </button>
                </div>

                <FilterSidebar />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ShopPage;

/* --- REUSABLE FILTER SIDEBAR --- */
const FilterSidebar = () => (
  <div className="space-y-4 md:border md:rounded-sm overflow-hidden">

    {/* Filter by Price */}
    <div className="bg-gray-50 md:bg-white rounded-md shadow-sm md:rounded-none md:shadow-none p-4 md:border-b">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">
        Filter by Price
      </h2>
      <div className="w-[90%] h-[4px] bg-amber-400 mx-auto mb-2 rounded"></div>
      <div className="flex justify-between items-center text-sm text-gray-700 mb-2">
        <span>0</span>
        <span>1000</span>
      </div>
      <div className="flex justify-between items-center">
        <input type="range" min="0" max="1000" className="w-[70%]" />
        <button className="bg-amber-400 text-white px-3 py-1 rounded text-sm hover:bg-amber-500 transition">
          Filter
        </button>
      </div>
    </div>

    {/* Filter by Brand */}
    <div className="bg-gray-50 md:bg-white shadow-sm rounded-md md:rounded-none md:shadow-none p-4 md:border-b">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">
        Filter by Brand
      </h2>
      <div className="flex gap-2 mb-3 flex-col">
        <input
          type="text"
          placeholder="Search brand..."
          className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
        />
        <button className="bg-amber-400 text-white px-3 py-1 rounded text-sm hover:bg-amber-500 transition">
          Search
        </button>
      </div>
      <div className="space-y-2 text-sm text-gray-700">
        <label className="flex items-center gap-2">
          <input type="checkbox" /> In Stock
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" /> Out of Stock
        </label>
      </div>
    </div>

    {/* Filter by Stock */}
    <div className="bg-gray-50 md:bg-white rounded-md shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">
        Stock Status
      </h2>
      <div className="flex flex-col justify-between text-sm text-gray-700">
        <label className="flex items-center gap-2">
          <input type="checkbox" /> In Stock
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" /> Out of Stock
        </label>
      </div>
    </div>

  </div>
);
