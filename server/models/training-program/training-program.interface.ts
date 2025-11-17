import { Document, Model } from "mongoose";

export interface ITrainingProgram extends Document {
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    duration: string;
    imageUrl: string[];
    features: string[];
    category: string;
    isActive: boolean;
    isFeatured: boolean;
    rating: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ITrainingProgramModel extends Model<ITrainingProgram> {
    findActivePrograms(): Promise<ITrainingProgram[]>;
    findFeaturedPrograms(): Promise<ITrainingProgram[]>;
    findByCategory(category: string): Promise<ITrainingProgram[]>;
}