"use server";

import { connectToDB } from "@/server/db";
import { UserModel } from "../models/user/user.model";
import { USER_ROLE } from "@/enum/user.enum";
import { SendResponse } from "../helper/sendResponse.helper";
import { ServerError } from "../interface/serverError.interface";
import { handleServerError } from "../helper/ErrorHandler";
import { IResponse } from "../interface/response.interface";
import { IUpdateHeroSectionInput } from "../interface/auth.interface";
import { SiteModle } from "../models/site/site.model";
import { ISite } from "../models/site/site.interface";
import { IUpdateHeroSectionImageInput } from "../interface/admin.interface";
import { uploadMultipleToCloudinary } from "../helper/cloudinary.helper";

let isAdminCreated = false;

export async function createAdminServerSide(){
    if(isAdminCreated) return SendResponse({ isError: true, status: 409, message: "Admin already exists!" });
    try {
        await connectToDB();

        const isAdminExist = await UserModel.exists({ role: USER_ROLE.ADMIN });
        if(isAdminExist) return SendResponse({ isError: true, status: 409, message: "Admin already exists!" });

        await UserModel.create({
            name: "Admin",
            email: "admin@admin.com",
            password: "admin123",
            isVerified: true,
            role: USER_ROLE.ADMIN
        });

        isAdminCreated = true;

        return SendResponse({ isError: false, status: 200, message: "Admin created successfully!" });

    } catch (error: ServerError) {
        return handleServerError(error);
    }
}

export async function editeHeroSectionServerSide ( body: IUpdateHeroSectionInput ): Promise<IResponse> {
    try {
        await connectToDB();

        const title = body.get("title") as string;
        const description = body.get("description") as string;

        let res = await SiteModle.findOneAndUpdate({},{ $set: {
            hero: {
                title,
                description
            }
        }}, { new: true}).lean().exec();

        if ( !res ) {
            res = await SiteModle.create({
                hero: {
                    title,
                    description
                }
            })
        }

        return SendResponse({ isError: false, status: 200, message: "Hero section updated successfully!" });

    } catch (error : ServerError ) {
        return handleServerError(error);
    }
}

export async function getHeroSectionServerSide (): Promise<IResponse<ISite>> {
    try {
        await connectToDB();
        let res = await SiteModle.findOne({}).lean().exec();
        return SendResponse({ isError: false, status: 200, message: "Get Hero section successfully!",data: res as ISite });

    } catch (error : ServerError ) {
        return handleServerError(error);
    }
}

export async function updateHeroSectionImageServerSide(body: IUpdateHeroSectionImageInput): Promise<IResponse> {
  try {
    await connectToDB();

    const imageFile = body.get("imageFile") as File;
    
    if (!imageFile) {
      return SendResponse({ 
        isError: true, 
        status: 400, 
        message: "No image file provided" 
      });
    }

    // Upload to Cloudinary
    const cloudinaryResponse = await uploadMultipleToCloudinary([imageFile]);
    
    if (!cloudinaryResponse || cloudinaryResponse.length === 0) {
      return SendResponse({ 
        isError: true, 
        status: 500, 
        message: "Failed to upload image to Cloudinary" 
      });
    }

    const imageUrl = cloudinaryResponse[0];

    // Update database
    await SiteModle.findOneAndUpdate(
      {},
      { $set: { hero: { imageUrl } } },
      { new: true, upsert: true }
    ).lean().exec();

    return SendResponse({ 
      isError: false, 
      status: 200, 
      message: "Hero section image updated successfully!",
      data: { imageUrl }
    });

  } catch (error: any) {
    console.error("Error in updateHeroSectionImageServerSide:", error);
    return handleServerError(error);
  }
}