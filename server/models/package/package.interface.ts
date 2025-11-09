import { Model } from "mongoose";

export interface IPackage {
    _id: string;
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    features: string[];
    imageUrl: string[];
    rating: number;
    isActive: boolean;
    isFeatured: boolean;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPackageModel extends Model<IPackage> {
    findActivePackages(): Promise<IPackage[]>;
    findFeaturedPackages(): Promise<IPackage[]>;
    findByCategory(category: string): Promise<IPackage[]>;
}