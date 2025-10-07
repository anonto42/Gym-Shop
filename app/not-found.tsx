"use client";
import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#222222] text-white px-6">
      <h1 className="text-6xl font-bold mb-4 text-[#F27D31]">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-gray-300 text-center mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#F27D31] rounded-md text-white font-semibold hover:bg-orange-600 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
