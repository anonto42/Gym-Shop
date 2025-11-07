"use server";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

// Configuration
const configureCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRE;

  if (!cloudName || !apiKey || !apiSecret) throw new Error('Missing Cloudinary environment variables');

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
};

// Initialize configuration
configureCloudinary();

export async function uploadMultipleToCloudinary(files: File[]): Promise<string[]> {
  try {
    if (!files || files.length === 0) {
      console.error("No files provided for upload");
      return [];
    }

    // Verify configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRE) {
      throw new Error('Cloudinary configuration is missing');
    }

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "gym-shop",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result?.secure_url || "");
            }
          }
        );
        uploadStream.end(buffer);
      });
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls.filter((url) => url !== "");
    
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    throw error;
  }
}