import imageUrl from '@/const/imageUrl';
import Image from 'next/image';
import React from 'react';
import Link from "next/link";

function HeroSection() {
  return (
    <div className='w-full h-[45svh] md:min-h-[70svh] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 overflow-hidden max-w-[1540px] mx-auto py-10 md:py-16 relative text-white '>

      <div className='text-center md:text-left space-y-4 z-10 md:mb-20 md:w-[500px]'>
        <h1 className='text-xl sm:text-3xl md:text-4xl xl:text-6xl font-bold'>
          Buy for your Pet Whatever It’s Need
        </h1>
        <p className='text-sm md:text-base xl:text-xl'>
          typically refers to a project or assignment where a consulting firm or an independent consultant is hired to provide expert advice, guidance, or solutions for a specific business challenge,.
        </p>
        <Link href='/shop'>
            <button className='bg-[#ffffff] cursor-pointer text-black px-6 py-2 rounded-full hover:bg-[#FFD700] transition-colors duration-300 font-semibold'>
              Shop Now
            </button>
        </Link>
      </div>

      <div className='absolute bottom-4 md:right-0 md:bottom-0'>
        <div className='relative w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] xl:w-[800px] xl:h-[800px]'>
          <Image
            src={imageUrl.heroImage}
            alt="Hero Image"
            fill
            className='object-contain drop-shadow-2xl'
            priority
          />
        </div>
      </div>
        
    </div>
  )
}

export default HeroSection;