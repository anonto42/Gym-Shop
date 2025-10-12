"use client";
import React, { useState } from "react";

function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const trackOrder = () => {
    if (orderId === "12345") setStatus("Shipped and on the way 🚚");
    else if (orderId === "67890") setStatus("Delivered ✅");
    else setStatus("Order not found ❌");
  };

  return (
    <section className="w-full min-h-screen bg-white py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold text-[#F27D31] mb-6">
          Track Your Order
        </h1>
        <p className="text-gray-600 mb-10">
          Enter your order ID to check the current delivery status.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#F27D31] outline-none"
          />
          <button
            onClick={trackOrder}
            className="bg-[#F27D31] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#e66d1f] transition-all"
          >
            Track
          </button>
        </div>

        {status && (
          <div className="mt-8 bg-gray-50 py-4 px-6 rounded-xl shadow-sm text-gray-800">
            <p className="font-medium">Status: {status}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default TrackOrderPage;
