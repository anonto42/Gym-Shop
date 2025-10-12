"use client";
import React, { useState } from "react";
import Image from "next/image";
import imageUrl from "@/const/imageUrl";

function ProfilePage() {
  const [user] = useState({
    name: "John Doe",
    email: "johndoe@email.com",
    image: imageUrl.product,
    joined: "March 2024",
  });

  const [orders] = useState([
    { id: "12345", product: "Smart Lamp", date: "Sep 5, 2025", status: "Delivered" },
    { id: "67890", product: "Air Purifier Pro", date: "Sep 12, 2025", status: "Shipped" },
  ]);

  return (
    <section className="w-full min-h-screen bg-white py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#F27D31]">
            <Image src={user.image} alt="profile" fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-gray-500 text-sm mt-2">Joined: {user.joined}</p>
          </div>
        </div>

        {/* User Orders */}
        <h2 className="text-2xl font-semibold text-[#F27D31] mb-6">
          Recent Orders
        </h2>
        <div className="bg-gray-50 rounded-xl shadow-sm divide-y">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4"
            >
              <div>
                <p className="font-medium text-gray-800">
                  Order #{order.id} — {order.product}
                </p>
                <p className="text-sm text-gray-500">Placed on {order.date}</p>
              </div>
              <span
                className={`mt-2 sm:mt-0 px-4 py-1 rounded-full text-sm font-semibold ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
