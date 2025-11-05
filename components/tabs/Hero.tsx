"use client"; 
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '@radix-ui/react-label'
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import ImageWithSkeleton from '../ui/ImageWIthSkeleton';
import { uploadMultipleToCloudinary } from '@/server/helper/cloudinary.helper';
import Loader from '../loader/Loader';
import { toast } from 'sonner';

function Hero() {

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string>('https://res.cloudinary.com/ddsnont4o/image/upload/v1760026076/product_bbys1y.png');
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<File[] | null>(null);

  const uploadImage = async () => {
    
    if (!files) {
      setLoading(false);
      toast.error("No files selected");
      return;
    };
    setLoading(true);
    
    const response = await uploadMultipleToCloudinary(files);
    setUrls(response);
    console.log("response -->=>=>",response)
    setLoading(false);
  }

  const updatedTitleDescription = async () => {}

  return (
    <div className='w-full h-[88vh] p-4 flex items-center justify-between'>
      {loading && <Loader />}
      <div className='w-full h-full rounded-3xl bg-white p-7'>
        <div className='flex flex-col mb-2'>
          <Label className='text-lg font-semibold'>Title</Label>
          <Input placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className='flex flex-col mb-2'>
          <Label className='text-lg font-semibold'>Description</Label>
          <Textarea placeholder='Description' className='max-h-[200px]' value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className='w-full flex items-center justify-center my-3'>
          <Button onClick={() => updatedTitleDescription()} className='bg-[#125BAC] cursor-pointer'>Update</Button>
        </div>
        <div className='w-full'>
          <h1 className='text-3xl font-semibold py-3'>Herosection Image</h1>
          <div className='h-[270px] w-[400px] mx-auto bg-amber-50 border rounded-2xl relative'>
            <ImageWithSkeleton src={image} />
            <Input type="file" multiple className='absolute w-full h-full top-0 opacity-0 cursor-pointer z-30 bg-amber-300' onChange={(e) => setFiles(e.target.files as any)} />
          </div>
        </div>
        <div className='w-full flex items-center justify-center my-3'>
          <Button onClick={() => uploadImage()} className='bg-[#125BAC] cursor-pointer'>Update</Button>
        </div>
      </div>
    </div>
  )
}

export default Hero