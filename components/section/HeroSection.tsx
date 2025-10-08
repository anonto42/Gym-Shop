"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[60vh] bg-[#F27D31] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 overflow-hidden max-w-[1540px] mx-auto">

      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 text-center md:text-left space-y-6 z-10 my-6"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
          Buy for your Pet <br />
          <span className="text-white">Whatever It Needs</span>
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
        className="relative flex-1 flex justify-center md:justify-end z-10"
      >
        <div className="relative w-[250px] md:w-[400px] lg:w-[480px]">
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
