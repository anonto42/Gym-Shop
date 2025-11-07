"use client"; 
import React, { useEffect, useState, useRef } from 'react'
import { Input } from '../ui/input'
import { Label } from '@radix-ui/react-label'
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import ImageWithSkeleton from '../ui/ImageWIthSkeleton';
import Loader from '../loader/Loader';
import { toast } from 'sonner';
import { 
  getHeroSectionServerSide, 
  updateHeroSectionImageServerSide, 
  editeHeroSectionServerSide 
} from '@/server/functions/admin.fun';
import { 
  IUpdateHeroSectionImageInput, 
} from '@/server/interface/admin.interface';
import { IUpdateHeroSectionInput } from '@/server/interface/auth.interface';

function Hero() {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchHeroSection();
  }, []);

  const fetchHeroSection = async () => {
    try {
      const { data } = await getHeroSectionServerSide();
      if (data?.hero) {
        setTitle(data.hero.title || '');
        setDescription(data.hero.description || '');
        setImage(data.hero.imageUrl || '');
      }
    } catch (error) {
      console.log("Error fetching hero section:", error);
      toast.error("Failed to load hero section");
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      toast.success("Image selected. Click 'Update Image' to save.");
    }
  };

  // Update Title and Description
  const updateTitleDescription = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData() as FormData & IUpdateHeroSectionInput;
      formData.append("title", title);
      formData.append("description", description);
      
      const response = await editeHeroSectionServerSide(formData);
      
      if (response.isError) {
        toast.error(response.message);
      } else {
        toast.success("Title and description updated successfully!");
        await fetchHeroSection(); // Refresh data
      }
    } catch (error) {
      console.log("Error updating title/description:", error);
      toast.error("Failed to update title and description");
    } finally {
      setLoading(false);
    }
  }

  // Update Image
  const updateImage = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData() as FormData & IUpdateHeroSectionImageInput;
      formData.append("imageFile", selectedFile);
      
      const response = await updateHeroSectionImageServerSide(formData);
      
      if (response.isError) {
        toast.error(response.message);
      } else {
        toast.success("Image updated successfully!");
        
        if (response.data?.imageUrl) {
          setImage(response.data.imageUrl);
        }
        
        // Clear selection
        setPreviewImage(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        await fetchHeroSection(); 
      }
    } catch (error) {
      console.log("Error updating image:", error);
      toast.error("Failed to update image");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='w-full min-h-[88vh] p-4 flex items-center justify-between'>
      {loading && <Loader />}
      <div className='w-full h-full rounded-3xl bg-white p-7'>
        
        {/* Title and Description Section */}
        <div className='mb-8'>
          <h1 className='text-3xl font-semibold py-3 mb-6'>Hero Section Content</h1>
          
          {/* Title Input */}
          <div className='flex flex-col mb-6'>
            <Label className='text-lg font-semibold mb-3'>Title</Label>
            <Input 
              placeholder='Enter hero section title' 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className='p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors'
            />
          </div>
          
          {/* Description Input */}
          <div className='flex flex-col mb-6'>
            <Label className='text-lg font-semibold mb-3'>Description</Label>
            <Textarea 
              placeholder='Enter hero section description' 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className='min-h-[120px] p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors resize-vertical'
              rows={4}
            />
          </div>
          
          {/* Update Title & Description Button */}
          <div className='w-full flex items-center justify-center'>
            <Button 
              onClick={updateTitleDescription}
              className='bg-[#125BAC] hover:bg-[#0f4a8c] cursor-pointer px-8 py-3 text-lg font-semibold transition-colors'
              disabled={loading || !title.trim() || !description.trim()}
            >
              Update Text Content
            </Button>
          </div>
        </div>

        {/* Image Section */}
        <div className='border-t pt-8'>
          <h1 className='text-3xl font-semibold py-3 mb-6'>Hero Section Image</h1>
          
          {/* Current Image */}
          <div className='mb-8'>
            <Label className='text-lg font-semibold mb-4 block'>Current Image</Label>
            <div className='h-[270px] w-[400px] mx-auto bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl relative overflow-hidden'>
              {image ? (
                <ImageWithSkeleton 
                  src={image} 
                  alt="Current hero section image"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No image set
                </div>
              )}
            </div>
          </div>

          {/* New Image Selection */}
          <div className='mb-6'>
            <Label className='text-lg font-semibold mb-4 block'>Update Image</Label>
            
            {/* Preview of Selected Image */}
            {previewImage && (
              <div className='mb-6'>
                <Label className='text-md font-medium mb-3 block text-green-600'>New Image Preview</Label>
                <div className='h-[270px] w-[400px] mx-auto bg-gray-50 border-2 border-green-300 rounded-2xl relative overflow-hidden'>
                  <ImageWithSkeleton 
                    src={previewImage} 
                    alt="New image preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Clear Selection Button */}
                <div className='flex justify-center mt-3'>
                  <Button 
                    onClick={() => {
                      setPreviewImage(null);
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    variant="outline"
                    className='border-red-300 text-red-600 hover:bg-red-50'
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            )}

            {/* File Input Area */}
            <div className='h-[80px] w-[400px] mx-auto bg-blue-50 border-2 border-dashed border-blue-300 rounded-2xl relative flex items-center justify-center transition-colors hover:bg-blue-100 hover:border-blue-400'>
              <Input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                className='absolute w-full h-full top-0 opacity-0 cursor-pointer z-30'
                onChange={handleFileChange}
              />
              <div className='text-center p-4'>
                <p className='text-blue-600 font-medium text-lg'>
                  {previewImage ? '✅ Image Selected' : '📁 Click to select new image'}
                </p>
                <p className='text-sm text-gray-500 mt-1'>
                  {previewImage ? 'Ready to upload' : 'Supports: PNG, JPG, WEBP (Max 10MB)'}
                </p>
              </div>
            </div>
          </div>

          {/* Update Image Button */}
          <div className='w-full flex items-center justify-center mt-8'>
            <Button 
              onClick={updateImage} 
              className='bg-green-600 hover:bg-green-700 cursor-pointer px-8 py-3 text-lg font-semibold transition-colors'
              disabled={loading || !selectedFile}
              size="lg"
            >
              {loading ? '📤 Uploading...' : '🖼️ Update Image'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero