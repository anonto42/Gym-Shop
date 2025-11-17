"use server";

import { connectToDB } from "@/server/db";
import { SendResponse } from "@/server/helper/sendResponse.helper";
import { handleServerError } from "@/server/helper/ErrorHandler";
import { TrainingProgram } from "@/server/models/training-program/training-program.model";
import {uploadImageToCloudinary} from "@/server/helper/cloudinary.helper";
import {ITrainingProgram} from "@/server/models/training-program/training-program.interface";

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

export async function createTrainingProgramServerSide(programData: ITrainingProgram) {
    try {
        await connectToDB();

        const program = new TrainingProgram(programData);
        await program.save();

        const plainProgram = convertToPlainObject(program);

        return SendResponse({
            isError: false,
            status: 201,
            message: "Training program created successfully",
            data: { program: plainProgram }
        });
    } catch (error) {
        return handleServerError(error);
    }
}

export async function updateTrainingProgramServerSide(programId: string, programData: ITrainingProgram) {
    try {
        await connectToDB();

        const program = await TrainingProgram.findByIdAndUpdate(
            programId,
            programData,
            { new: true, runValidators: true }
        );

        if (!program) {
            return SendResponse({
                isError: true,
                status: 404,
                message: "Training program not found"
            });
        }

        const plainProgram = convertToPlainObject(program);

        return SendResponse({
            isError: false,
            status: 200,
            message: "Training program updated successfully",
            data: { program: plainProgram }
        });
    } catch (error) {
        return handleServerError(error);
    }
}

export async function deleteTrainingProgramServerSide(programId: string) {
    try {
        await connectToDB();

        const program = await TrainingProgram.findByIdAndDelete(programId);

        if (!program) {
            return SendResponse({
                isError: true,
                status: 404,
                message: "Training program not found"
            });
        }

        return SendResponse({
            isError: false,
            status: 200,
            message: "Training program deleted successfully"
        });
    } catch (error) {
        return handleServerError(error);
    }
}

export async function getAllTrainingProgramsServerSide() {
    try {
        await connectToDB();

        const programs = await TrainingProgram.find({ isActive: true })
            .sort({ isFeatured: -1, createdAt: -1 });

        const plainPrograms = programs.map(program => convertToPlainObject(program));

        return SendResponse({
            isError: false,
            status: 200,
            message: "Training programs fetched successfully",
            data: { programs: plainPrograms }
        });
    } catch (error) {
        return handleServerError(error);
    }
}

export async function getFeaturedTrainingProgramsServerSide() {
    try {
        await connectToDB();

        const programs = await TrainingProgram.find({
            isActive: true,
            isFeatured: true
        }).sort({ createdAt: -1 }).limit(6);

        const plainPrograms = programs.map(program => convertToPlainObject(program));

        return SendResponse({
            isError: false,
            status: 200,
            message: "Featured training programs fetched successfully",
            data: { programs: plainPrograms }
        });
    } catch (error) {
        return handleServerError(error);
    }
}

export async function uploadTrainingImagesServerSide(formData: FormData) {
    try {
        await connectToDB();

        const imageFiles = formData.getAll('images') as File[];

        if (!imageFiles || imageFiles.length === 0) {
            return SendResponse({
                isError: true,
                status: 400,
                message: "No images provided"
            });
        }

        const uploadPromises = imageFiles.map(file =>
            uploadImageToCloudinary(file, "personal-training/programs")
        );

        const uploadResults = await Promise.all(uploadPromises);
        const imageUrls = uploadResults.map(result => result.url);

        return SendResponse({
            isError: false,
            status: 200,
            message: "Images uploaded successfully",
            data: { urls: imageUrls }
        });
    } catch (error) {
        return handleServerError(error);
    }
}
