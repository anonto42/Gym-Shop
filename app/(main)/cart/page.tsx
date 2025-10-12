"use client";
import React, { useState } from "react";
import Image from "next/image";
import imageUrl from "@/const/imageUrl";
import { Check } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

function CartPage() {
  const [cartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Smart LED Lamp",
      price: 29,
      image: imageUrl.product,
      description: "Modern smart lamp with voice control and warm light.",
    },
    {
      id: 2,
      name: "Air Purifier Pro",
      price: 79,
      image: imageUrl.product,
      description: "Keep your room fresh and clean with smart filtering.",
    },
    {
      id: 3,
      name: "Mini Bluetooth Speaker",
      price: 39,
      image: imageUrl.product,
      description: "Crystal clear sound with long-lasting battery life.",
    },
    {
      id: 4,
      name: "Smart Thermostat",
      price: 59,
      image: imageUrl.product,
      description: "Automatically adjusts room temperature efficiently.",
    },
  ]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const toggleSelection = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedProducts = cartItems.filter((item) =>
    selectedItems.includes(item.id)
  );
  const total = selectedProducts.reduce((sum, item) => sum + item.price, 0);

  return (
    <section className="w-full min-h-screen bg-white py-16 px-6 md:px-12 lg:px-20">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Your Cart</h1>
        <p className="text-gray-600">
          Select one or more products to proceed with your purchase.
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* Product List */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          {cartItems.map((item) => {
            const selected = selectedItems.includes(item.id);
            return (
              <div
                key={item.id}
                className={`relative border rounded-2xl p-4 flex flex-col md:flex-row gap-5 items-center shadow-sm transition-all ${
                  selected ? "border-[#F27D31] bg-orange-50" : "border-gray-200"
                }`}
                onClick={() => toggleSelection(item.id)}
              >
                {/* Custom Checkbox */}
                <div
                  className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selected
                      ? "bg-[#F27D31] border-[#F27D31]"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {selected && <Check className="text-white w-4 h-4" />}
                </div>

                {/* Product Image */}
                <div className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="font-semibold text-gray-800 text-lg mb-1">
                    {item.name}
                  </h2>
                  <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-gray-900 font-semibold">${item.price}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="w-full lg:w-1/3 bg-gray-50 p-6 rounded-2xl shadow-md h-fit sticky top-20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Order Summary
          </h2>

          {selectedProducts.length > 0 ? (
            <>
              <div className="space-y-4">
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between text-gray-700"
                  >
                    <p>{product.name}</p>
                    <p>${product.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <hr className="my-5" />
              <div className="flex justify-between font-semibold text-gray-800 text-lg">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
              <button className="mt-6 w-full bg-[#F27D31] text-white font-semibold py-3 rounded-full hover:bg-[#e66d1f] transition-all">
                Proceed to Checkout
              </button>
            </>
          ) : (
            <p className="text-gray-600 text-center mt-10">
              Select products to view your summary.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default CartPage;
