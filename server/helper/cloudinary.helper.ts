"use server";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})


export async function uploadMultipleToCloudinary(files: File[]): Promise<string[]> {
  try {
    if (!files || files.length === 0) {
      console.error("No files provided for upload");
      return [];
    }

    // Map over each file and upload using Cloudinary SDK
    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "gym-shop",
            resource_type: "auto",
            // transformation: [
            //   { width: 800, height: 800, crop: "limit" },
            // ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url || "");
          }
        );
        uploadStream.end(buffer);
      });
    });

    // Wait for all uploads to finish
    const uploadedUrls = await Promise.all(uploadPromises);

    // Filter out any empty strings (failed uploads)
    return uploadedUrls.filter((url) => url !== "");
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    return [];
  }
}