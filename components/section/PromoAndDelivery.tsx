"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { BiSolidOffer } from 'react-icons/bi'
import { Gift, Tag } from 'lucide-react';

function PromoAndDelivery() {
  return (
    <section className='bg-white pb-20 px-6 md:px-12 lg:px-20 flex flex-col items-center gap-12'>
        <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl"
        >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#F27D31] leading-tight drop-shadow-lg">
                Promo & Delivery <span className="text-black">Process</span>
            </h2>
            <p className="text-gray-600 mt-4 text-sm md:text-base">
                Experience year-round comfort with our Comport Zone, designed to keep your home warm in winter, cool in summer, and stylish every day.
            </p>
      </motion.div>

      <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full justify-items-center max-w-[1200px] mx-auto px-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* 🟧 Offer Box 1 */}
      <motion.div
        className="w-full h-[240px] md:h-[260px] rounded-xl bg-[#F27D31] text-white shadow-md shadow-black/25 p-6 flex flex-col justify-between"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-start">
          <div className="text-4xl opacity-90">
            <BiSolidOffer />
          </div>
          <p className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-md">
            Limited Time
          </p>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-2xl md:text-3xl font-bold leading-snug">
            Get <span className="text-yellow-300">50TK OFF</span> on First Order
          </h3>
          <p className="text-sm md:text-base">
            Use Promo Code:{" "}
            <span className="font-bold px-3 py-1 bg-white/25 rounded-md">
              SAVE50
            </span>
          </p>
          <p className="text-xs opacity-85">
            *Only for new customers. Limited stock available.
          </p>
        </div>
      </motion.div>

      {/* Offer Box 2 (Different Layout) */}
      <motion.div
        className="w-full h-[240px] md:h-[260px] rounded-xl bg-[#020100] text-white shadow-md shadow-black/25 p-6 flex flex-col justify-center items-center gap-3 text-center relative overflow-hidden"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute top-3 right-3 text-3xl text-[#F27D31] opacity-80">
          <Tag />
        </div>

        <Gift className="text-[#F27D31] text-5xl mb-2" />
        <h3 className="text-2xl md:text-3xl font-bold">Free Gift Pack</h3>
        <p className="text-sm md:text-base">
          Get a <span className="text-[#F27D31] font-semibold">free grooming kit</span> with orders over 500TK
        </p>
        <p className="text-xs opacity-80 mt-2">
          *Offer valid till this weekend only.
        </p>
      </motion.div>
    </motion.div>
    </section>
  )
}

export default PromoAndDelivery