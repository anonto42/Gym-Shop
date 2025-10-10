"use client";
import imageUrl from "@/const/imageUrl";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

function PersonalTrainingPage() {
  const trainings = [
    {
      title: "Core Stability & Flexibility Training",
      image: imageUrl.product,
    },
    {
      title: "Strength & Conditioning Workout",
      image: imageUrl.product,
    },
    {
      title: "HIIT Fat Burning Program",
      image: imageUrl.product,
    },
    {
      title: "Core Stability & Flexibility Training",
      image: imageUrl.product,
    },
    {
      title: "Strength & Conditioning Workout",
      image: imageUrl.product,
    },
    {
      title: "HIIT Fat Burning Program",
      image: imageUrl.product,
    },
    {
      title: "Core Stability & Flexibility Training",
      image: imageUrl.product,
    },
    {
      title: "Strength & Conditioning Workout",
      image: imageUrl.product,
    },
    {
      title: "HIIT Fat Burning Program",
      image: imageUrl.product,
    },
    {
      title: "Core Stability & Flexibility Training",
      image: imageUrl.product,
    },
    {
      title: "Strength & Conditioning Workout",
      image: imageUrl.product,
    },
    {
      title: "HIIT Fat Burning Program",
      image: imageUrl.product,
    },
    {
      title: "Core Stability & Flexibility Training",
      image: imageUrl.product,
    },
    {
      title: "Strength & Conditioning Workout",
      image: imageUrl.product,
    },
    {
      title: "HIIT Fat Burning Program",
      image: imageUrl.product,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white text-[#242222]">
      {/* Hero / Live Training Section */}
      <section className="w-full flex flex-col items-center justify-center text-center py-12 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-[#F27D31] mb-6"
        >
          Our Daily Training <span className="text-[#000000]">on Live</span>
        </motion.h1>

        <motion.video
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          controls
          className="rounded-sm w-full max-w-[1400px] md:h-[500px] shadow-md border border-gray-200"
          poster={imageUrl.heroImage || ""}
        >
          <source src="/videos/training.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </motion.video>
      </section>

      {/* Personal Training Programs */}
      <section className="py-16 px-6 md:px-12 lg:px-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center text-[#F27D31] mb-12"
        >
          <span className="text-[#000000]">Our Personal </span>
          Training Programs
        </motion.h1>

        <div className="flex flex-wrap justify-center items-center gap-10">
          {trainings.map((training, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.1,
                delay: i * 0.1,
                ease: "easeOut",
              }}
              className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-lg transition w-full max-w-[420px] h-[420px] flex flex-col items-center relative"
            >
              <div className="relative w-full h-full">
                <Image
                  src={training.image}
                  alt={training.title}
                  fill
                  className="rounded-sm object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/10 backdrop-blur-sm flex justify-between items-center text-[#eeeeee]">
                <h3 className="text-lg font-semibold text-center mb-4 w-[70%]">
                  {training.title}
                </h3>
                <button className="bg-[#F27D31] text-white font-semibold py-2 px-4 md:text-base rounded-full hover:bg-[#e36e20] transition cursor-pointer">
                  Buy Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PersonalTrainingPage;
