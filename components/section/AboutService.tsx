"use client";
import imageUrl from "@/const/imageUrl";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const cardVariants: any = {
    hidden: { opacity: 0, y: 50 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
};

function AboutService() {
  const services = [
    {
      image: imageUrl.aboutServiceImages.delivery,
      title: "Fast Delivery",
      description:
        "We provide standard and express delivery service through our logistics partners.",
    },
    {
      image: imageUrl.aboutServiceImages.customerCear,
      title: "24/7 Days Service",
      description:
        "Our customer care team is available 24/7 to assist you with any queries or issues.",
    },
    {
      image: imageUrl.aboutServiceImages.product,
      title: "Best Quality",
      description:
        "We ensure top-notch product quality with careful inspection and trusted brands.",
    },
  ];

  return (
    <section className="w-full py-16 px-6 md:px-12 lg:px-20 bg-[#FFFAF7]">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-[#F27D31]">
          Why Choose Us
        </h2>
        <p className="text-gray-500 text-sm md:text-base mt-2">
          Experience quality service, quick delivery, and reliable support.
        </p>
      </motion.div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center max-w-[1000px] mx-auto">
        {services.map((service, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center bg-gray-50 rounded-2xl shadow-sm hover:shadow-lg transition-all p-6 max-w-[320px] cursor-default"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={index}
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative w-20 h-20 mb-4">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-lg font-bold text-[#F27D31] mb-2">
              {service.title}
            </h3>
            <p className="text-sm text-gray-500">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default AboutService;
