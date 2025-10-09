"use client"
import React from 'react'
import { motion } from 'framer-motion'
import ProductCart from '../card/ProductCart'
import imageUrl from '@/const/imageUrl'

function SpecialProducts() {
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
                <span className="text-black">Our</span> Special Products List
            </h2>
            <p className="text-gray-600 mt-4 text-sm md:text-base">
                Experience year-round comfort with our Comport Zone, designed to keep your home warm in winter, cool in summer, and stylish every day.
            </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-3 max-w-[1540px]"
      >
        <ProductCart image={imageUrl.product} />
        <ProductCart image={imageUrl.product} />
        <ProductCart image={imageUrl.product} />
        <ProductCart image={imageUrl.product} />
        <ProductCart image={imageUrl.product} />
        <ProductCart image={imageUrl.product} />
        <ProductCart image={imageUrl.product} />
        <ProductCart image={imageUrl.product} />
        <ProductCart image={imageUrl.product} />
        <ProductCart image={imageUrl.product} />
        <ProductCart image={imageUrl.product} />
        <ProductCart image={imageUrl.product} />
        <ProductCart image={imageUrl.product} />
        <ProductCart image={imageUrl.product} />
        <ProductCart image={imageUrl.product} />
        <ProductCart image={imageUrl.product} />
        <ProductCart image={imageUrl.product} />
        <ProductCart image={imageUrl.product} />
        <ProductCart image={imageUrl.product} />
        <ProductCart image={imageUrl.product} />
        <ProductCart image={imageUrl.product} />
      </motion.div>
    </section>
  )
}

export default SpecialProducts