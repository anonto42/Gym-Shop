import React from 'react'
import { Button } from '../ui/button'

function Offer() {
  return (
    <div className='w-full h-[88vh] p-4 overflow-hidden'>
      <div className='w-full h-full bg-white border rounded-3xl'>
        <div className='w-full flex justify-between items-center p-4'>
          <h1 className='text-2xl font-semibold'>Offer Management</h1>
          <Button className='bg-[#125BAC] cursor-pointer'>Add Offer</Button>
        </div>
        <div className='w-full h-full flex justify-around'>
          <div className='w-[300px] h-[100px] border rounded-2xl text-center relative'>
            <h3 className='text-xl font-semibold'>Title</h3>
            <p className='text-sm'>Description</p>
            <text className='text-sm'>Promo code</text>
            <Button className='absolute cursor-pointer top-2 right-2 bg-[#125BAC] text-white p-2 rounded-full'>Edit</Button>
            <Button className='absolute cursor-pointer bottom-2 right-2 bg-[#ac1212] text-white p-2 rounded-full'>Delete</Button>
          </div>
          <div className='w-[300px] h-[100px] border rounded-2xl text-center relative'>
            <h3 className='text-xl font-semibold'>Title</h3>
            <p className='text-sm'>Description</p>
            <text className='text-sm'>Promo code</text>
            <Button className='absolute cursor-pointer top-2 right-2 bg-[#125BAC] text-white p-2 rounded-full'>Edit</Button>
            <Button className='absolute cursor-pointer bottom-2 right-2 bg-[#ac1212] text-white p-2 rounded-full'>Delete</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Offer