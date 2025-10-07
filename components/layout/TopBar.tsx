"use client";
import React from "react";
import Link from "next/link";
import { UserCircle } from "lucide-react";

const TopBar = () => {
  return (
    <div className="w-full bg-[#222222] text-white text-xs py-2 px-4 flex justify-end items-center">
      {/* Left links */}
      <div className="flex gap-4">
        <Link href="/contact-us" className="hover:underline border-r pr-3">
          Contact Us
        </Link>
        <Link href="/privacy-policy" className="hover:underline border-r pr-3">
          Privacy & Return Policy
        </Link>
        <Link href="/track-order" className="hover:underline border-r pr-3 mr-3">
          Track Order
        </Link>
      </div>

      {/* Right links */}
      <div className="flex gap-3">
        <UserCircle size={16} />
        <Link href="/auth/signin" className="hover:underline">
          Sign In
        </Link>
        <span>/</span>
        <Link href="/auth/signup" className="hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
