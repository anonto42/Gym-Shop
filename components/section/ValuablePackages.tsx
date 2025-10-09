"use client";

import React from "react";
import PackageCart from "../card/PackageCart";
import imageUrl from "@/const/imageUrl";
import { motion } from "framer-motion";

const ValuablePackages = () => {
  return (
    <section className="w-full bg-white py-20 px-6 md:px-12 lg:px-20 flex flex-col items-center gap-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#F27D31] leading-tight drop-shadow-lg">
          Our Valuable <span className="text-black">Packages</span>
        </h2>
        <p className="text-gray-600 mt-4 text-sm md:text-base">
          Experience year-round comfort with our Comfort Zone packages — designed
          to keep your home warm in winter, cool in summer, and stylish every day.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4 justify-items-center max-w-[1200px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <PackageCart
          star={5}
          title="Healthy Dog Food Pack"
          image={imageUrl.packageImage.image1}
          delay={0.1}
        />
        <PackageCart
          star={4}
          title="Premium Cat Essentials"
          image={imageUrl.packageImage.image2}
          delay={0.2}
        />
        <PackageCart
          star={5}
          title="Luxury Pet Grooming Kit"
          image={imageUrl.packageImage.image3}
          delay={0.3}
        />
      </motion.div>
    </section>
  );
};

export default ValuablePackages;
