"use server";

import { connectToDB } from "@/server/db";
import { SendResponse } from "@/server/helper/sendResponse.helper";
import { handleServerError } from "@/server/helper/ErrorHandler";
import { Video } from "@/server/models/training-program/video.model";
import {deleteFromCloudinary, uploadVideoToCloudinary} from "@/server/helper/cloudinary.helper";

interface MongooseDocument {
    toJSON?: () => Record<string, unknown>;
}

interface ObjectIdLike {
    _id?: {
        toString?: () => string;
    };
}

type ConvertibleObject = Record<string, unknown> & MongooseDocument & ObjectIdLike;

const convertToPlainObject = (doc: unknown): unknown => {
    if (doc && typeof doc === 'object') {
        const convertibleDoc = doc as ConvertibleObject;
        if (convertibleDoc.toJSON) {
            return convertibleDoc.toJSON();
        }
        if (convertibleDoc._id && typeof convertibleDoc._id.toString === 'function') {
            return {
                ...convertibleDoc,
                _id: convertibleDoc._id.toString()
            };
        }
        if (Array.isArray(doc)) {
            return doc.map(item => convertToPlainObject(item));
        }
        const plainObj: Record<string, unknown> = {};
        for (const key in doc) {
            if (Object.prototype.hasOwnProperty.call(doc, key)) {
                plainObj[key] = convertToPlainObject((doc as Record<string, unknown>)[key]);
            }
        }
        return plainObj;
    }
    return doc;
};

export async function uploadVideoServerSide(formData: FormData) {
    try {
        await connectToDB();

        const videoFile = formData.get('video') as File;

        if (!videoFile) {
            return SendResponse({
                isError: true,
                status: 400,
                message: "No video file provided"
            });
        }

        // Upload to Cloudinary
        const uploadResult = await uploadVideoToCloudinary(videoFile);

        // Save to MongoDB
        const video = new Video({
            url: uploadResult.url,
            public_id: uploadResult.public_id,
            duration: uploadResult.duration,
            format: uploadResult.format,
            title: videoFile.name,
        });

        await video.save();

        const plainVideo = convertToPlainObject(video);

        return SendResponse({
            isError: false,
            status: 201,
            message: "Video uploaded successfully",
            data: { video: plainVideo }
        });
    } catch (error) {
        return handleServerError(error);
    }
}

export async function deleteVideoServerSide(videoId: string, publicId?: string) {
    try {
        await connectToDB();

        // Delete from Cloudinary if public_id exists
        if (publicId) {
            await deleteFromCloudinary(publicId, "video");
        }

        // Delete from MongoDB
        await Video.findByIdAndDelete(videoId);

        return SendResponse({
            isError: false,
            status: 200,
            message: "Video deleted successfully"
        });
    } catch (error) {
        return handleServerError(error);
    }
}

export async function getAllVideosServerSide() {
    try {
        await connectToDB();

        const videos = await Video.find().sort({ createdAt: -1 });
        const plainVideos = videos.map(video => convertToPlainObject(video));

        return SendResponse({
            isError: false,
            status: 200,
            message: "Videos fetched successfully",
            data: { videos: plainVideos }
        });
    } catch (error) {
        return handleServerError(error);
    }
}

export async function getFeaturedVideosServerSide() {
    try {
        await connectToDB();

        const videos = await Video.find().sort({ createdAt: -1 }).limit(1);
        const plainVideos = videos.map(video => convertToPlainObject(video));

        return SendResponse({
            isError: false,
            status: 200,
            message: "Featured videos fetched successfully",
            data: { videos: plainVideos }
        });
    } catch (error) {
        return handleServerError(error);
    }
}