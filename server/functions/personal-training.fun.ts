'use server';

import { revalidatePath } from 'next/cache';
import { PersonalTrainingModel } from '@/server/models/personal-training/personal-training.model';
import {IFeaturedVideo, IPersonalTraining} from '@/server/models/personal-training/personal-training.interface';
import {connectToDB} from "@/server/db";
import {SendResponse} from "@/server/helper/sendResponse.helper";
import {handleServerError} from "@/server/helper/ErrorHandler";
import {FeaturedVideoModel} from "@/server/models/personal-training/featured-video.model";

// Get all personal trainings with filtering and pagination
export async function getAllPersonalTrainings({
                                                  filter = {},
                                                  page = 1,
                                                  limit = 12,
                                                  sort = { createdAt: -1 }
                                              }: {
    filter?: Record<string, unknown>;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
}) {
    try {
        await connectToDB();

        const skip = (page - 1) * limit;

        const [trainings, total] = await Promise.all([
            PersonalTrainingModel.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
            PersonalTrainingModel.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return SendResponse({
            isError: false,
            status: 200,
            message: "Personal trainings fetched successfully",
            data: {
                trainings,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext,
                    hasPrev
                }
            }
        });

    } catch (error) {
        return handleServerError(error);
    }
}

// Get single personal training by ID
export async function getPersonalTrainingById(id: string) {
    try {
        await connectToDB();

        const training = await PersonalTrainingModel.findById(id).lean();

        if (!training) {
            return SendResponse({
                isError: true,
                status: 404,
                message: "Personal training not found"
            });
        }

        return SendResponse({
            isError: false,
            status: 200,
            message: "Personal training fetched successfully",
            data: { training }
        });

    } catch (error) {
        return handleServerError(error);
    }
}

// Create new personal training
export async function createPersonalTraining(trainingData: Omit<IPersonalTraining, '_id' | 'createdAt' | 'updatedAt'>) {
    try {
        await connectToDB();

        const newTraining = new PersonalTrainingModel(trainingData);
        await newTraining.save();

        revalidatePath('/personal-training');
        revalidatePath('/admin/personal-training');

        return SendResponse({
            isError: false,
            status: 201,
            message: "Personal training created successfully",
            data: { training: newTraining }
        });

    } catch (error) {
        return handleServerError(error);
    }
}

// Update personal training
export async function updatePersonalTraining(id: string, updateData: Partial<IPersonalTraining>) {
    try {
        await connectToDB();

        const updatedTraining = await PersonalTrainingModel.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedTraining) {
            return SendResponse({
                isError: true,
                status: 404,
                message: "Personal training not found"
            });
        }

        revalidatePath('/personal-training');
        revalidatePath('/admin/personal-training');
        revalidatePath(`/personal-training/${id}`);

        return SendResponse({
            isError: false,
            status: 200,
            message: "Personal training updated successfully",
            data: { training: updatedTraining }
        });

    } catch (error) {
        return handleServerError(error);
    }
}

// Delete personal training
export async function deletePersonalTraining(id: string) {
    try {
        await connectToDB();

        const deletedTraining = await PersonalTrainingModel.findByIdAndDelete(id).lean();

        if (!deletedTraining) {
            return SendResponse({
                isError: true,
                status: 404,
                message: "Personal training not found"
            });
        }

        revalidatePath('/personal-training');
        revalidatePath('/admin/personal-training');

        return SendResponse({
            isError: false,
            status: 200,
            message: "Personal training deleted successfully"
        });

    } catch (error) {
        return handleServerError(error);
    }
}

// Toggle training active status
export async function toggleTrainingStatus(id: string) {
    try {
        await connectToDB();

        const training = await PersonalTrainingModel.findById(id);

        if (!training) {
            return SendResponse({
                isError: true,
                status: 404,
                message: "Personal training not found"
            });
        }

        training.isActive = !training.isActive;
        await training.save();

        revalidatePath('/personal-training');
        revalidatePath('/admin/personal-training');

        return SendResponse({
            isError: false,
            status: 200,
            message: `Training ${training.isActive ? 'activated' : 'deactivated'} successfully`,
            data: { training }
        });

    } catch (error) {
        return handleServerError(error);
    }
}

// Featured Video Management
export async function getFeaturedVideo() {
    try {
        await connectToDB();

        const featuredVideo = await FeaturedVideoModel.findOne({ isActive: true }).lean();

        return SendResponse({
            isError: false,
            status: 200,
            message: "Featured video fetched successfully",
            data: { featuredVideo }
        });

    } catch (error) {
        return handleServerError(error);
    }
}

export async function createFeaturedVideo(videoData: Omit<IFeaturedVideo, '_id' | 'createdAt' | 'updatedAt'>) {
    try {
        await connectToDB();

        // Deactivate any currently active featured video
        await FeaturedVideoModel.updateMany(
            { isActive: true },
            { isActive: false }
        );

        const newFeaturedVideo = new FeaturedVideoModel(videoData);
        await newFeaturedVideo.save();

        revalidatePath('/personal-training');
        revalidatePath('/');

        return SendResponse({
            isError: false,
            status: 201,
            message: "Featured video created successfully",
            data: { featuredVideo: newFeaturedVideo }
        });

    } catch (error) {
        return handleServerError(error);
    }
}

export async function updateFeaturedVideo(id: string, updateData: Partial<IFeaturedVideo>) {
    try {
        await connectToDB();

        // If setting this video as active, deactivate others
        if (updateData.isActive) {
            await FeaturedVideoModel.updateMany(
                { _id: { $ne: id }, isActive: true },
                { isActive: false }
            );
        }

        const updatedVideo = await FeaturedVideoModel.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedVideo) {
            return SendResponse({
                isError: true,
                status: 404,
                message: "Featured video not found"
            });
        }

        revalidatePath('/personal-training');
        revalidatePath('/');

        return SendResponse({
            isError: false,
            status: 200,
            message: "Featured video updated successfully",
            data: { featuredVideo: updatedVideo }
        });

    } catch (error) {
        return handleServerError(error);
    }
}

export async function deleteFeaturedVideo(id: string) {
    try {
        await connectToDB();

        const deletedVideo = await FeaturedVideoModel.findByIdAndDelete(id).lean();

        if (!deletedVideo) {
            return SendResponse({
                isError: true,
                status: 404,
                message: "Featured video not found"
            });
        }

        revalidatePath('/personal-training');
        revalidatePath('/');

        return SendResponse({
            isError: false,
            status: 200,
            message: "Featured video deleted successfully"
        });

    } catch (error) {
        return handleServerError(error);
    }
}

export async function getAllFeaturedVideos() {
    try {
        await connectToDB();

        const featuredVideos = await FeaturedVideoModel.find()
            .sort({ createdAt: -1 })
            .lean();

        return SendResponse({
            isError: false,
            status: 200,
            message: "Featured videos fetched successfully",
            data: { featuredVideos }
        });

    } catch (error) {
        return handleServerError(error);
    }
}

export async function setTrainingAsFeaturedVideo(trainingId: string) {
    try {
        await connectToDB();

        const training = await PersonalTrainingModel.findById(trainingId).lean();

        if (!training) {
            return SendResponse({
                isError: true,
                status: 404,
                message: "Training not found"
            });
        }

        if (!training.videoUrl) {
            return SendResponse({
                isError: true,
                status: 400,
                message: "Training does not have a video URL"
            });
        }

        // Deactivate any currently active featured video
        await FeaturedVideoModel.updateMany(
            { isActive: true },
            { isActive: false }
        );

        const featuredVideo = new FeaturedVideoModel({
            videoUrl: training.videoUrl,
            title: training.title,
            description: training.description,
            isActive: true,
            trainingId: training._id?.toString(),
        });

        await featuredVideo.save();

        revalidatePath('/personal-training');
        revalidatePath('/');

        return SendResponse({
            isError: false,
            status: 200,
            message: "Training set as featured video successfully",
            data: { featuredVideo }
        });

    } catch (error) {
        return handleServerError(error);
    }
}
