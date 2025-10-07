"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop Now", href: "/shop" },
    { name: "Personal Training", href: "/personal-training" },
    { name: "Offer Combo", href: "/offers" },
    { name: "About Me", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      <nav className="w-full bg-[#222222] py-3 px-6 shadow-md flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[#F27D31]">
          GymShop
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex items-center w-[35%] bg-white border rounded-full px-3 py-1">
          <Search size={18} className="text-[#F27D31]" />
          <input
            type="text"
            placeholder="Search for products..."
            className="ml-2 w-full outline-none text-sm text-gray-700"
          />
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative pb-1 transition duration-300 ${
                  isActive
                    ? "text-[#F27D31] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#F27D31]"
                    : "text-white hover:text-[#F27D31]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Cart + Mobile Menu */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative flex items-center justify-center bg-[#F27D31] text-white rounded-full w-8 h-8 hover:bg-[#e56f28] transition"
          >
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              2
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2 text-gray-200"
          >
            <Menu size={26} />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 90, damping: 15 }}
              className="fixed top-0 left-0 w-[80%] max-w-[280px] h-full bg-white shadow-lg flex flex-col p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-[#F27D31]">GymShop</h1>
                <button onClick={() => setIsOpen(false)}>
                  <X size={26} className="text-gray-700" />
                </button>
              </div>

              {/* Search */}
              <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 mb-6">
                <Search size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="ml-2 w-full outline-none text-sm bg-transparent"
                />
              </div>

              {/* Links */}
              <div className="flex flex-col gap-4 text-gray-800 font-medium">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`transition ${
                        isActive ? "text-[#F27D31]" : "hover:text-[#F27D31]"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              {/* Auth Links */}
              <div className="mt-auto border-t border-gray-200 pt-4">
                <Link
                  href="/auth/signin"
                  onClick={() => setIsOpen(false)}
                  className="block mb-2 text-sm text-gray-700 hover:text-[#F27D31]"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm text-gray-700 hover:text-[#F27D31]"
                >
                  Sign Up
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
