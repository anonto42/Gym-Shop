import Image from 'next/image';
import React from 'react';
import Link from "next/link";
import { getHeroSectionServerSide } from '@/server/functions/admin.fun';
import { ISite } from '@/server/models/site/site.interface';

async function HeroSection() {

  const res = await getHeroSectionServerSide();
  const data = res.data as ISite;

  return (
    <div className='w-full h-[45svh] md:min-h-[70svh] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 overflow-hidden max-w-[1540px] mx-auto py-10 md:py-16 relative text-white '>

      <div className='text-center md:text-left space-y-4 z-10 md:mb-20 md:w-[500px]'>
        <h1 className='text-xl sm:text-3xl md:text-4xl xl:text-6xl font-bold'>
          {data?.hero.title}
        </h1>
        <p className='text-sm md:text-base xl:text-xl'>
          {data?.hero.description}
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
            src={!data?.hero.imageUrl? "": data?.hero.imageUrl }
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