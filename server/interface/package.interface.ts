import { IPackage } from "../models/package/package.interface";


export interface ICreatePackageInput {
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    features: string[];
    imageUrl?: string[];
    rating?: number;
    isActive?: boolean;
    isFeatured?: boolean;
    category: string;
}

export interface IUpdatePackageInput {
    title?: string;
    description?: string;
    price?: number;
    originalPrice?: number;
    features?: string[];
    imageUrl?: string[];
    rating?: number;
    isActive?: boolean;
    isFeatured?: boolean;
    category?: string;
}

export interface IPackageResponse<T = unknown> {
    isError: boolean;
    status: number;
    message: string;
    data?:  T | null;
}