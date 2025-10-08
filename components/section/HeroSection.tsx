"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="w-full min-h-[90vh] bg-[#F27D31] px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
      {/* Decorative Gradient Circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 blur-3xl rounded-full translate-x-1/3 translate-y-1/3"></div>

      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 text-center md:text-left space-y-6 z-10"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
          Buy for your Pet <br />
          <span className="text-black">Whatever It’s Need</span>
        </h1>

        <p className="text-gray-100 text-sm md:text-base max-w-lg mx-auto md:mx-0 leading-relaxed">
          Discover everything your furry friend needs! From daily essentials to
          premium accessories, we bring comfort, style, and care together for
          your pet’s happiness.
        </p>

        <Button className="bg-white text-black font-semibold px-6 py-3 text-sm md:text-base rounded-full hover:bg-transparent hover:text-white hover:border hover:border-white transition duration-200 ease-in-out">
          Browse All Products
        </Button>
      </motion.div>

      {/* Right Image */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex-1 flex justify-center md:justify-end"
      >
        <div className="relative w-[90%] md:w-[400px] lg:w-[480px]">
          <Image
            src="https://res.cloudinary.com/ddsnont4o/image/upload/v1759886589/Screenshot_2025-10-08_072004_qdenqt.png"
            alt="Pet Product"
            width={500}
            height={500}
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
