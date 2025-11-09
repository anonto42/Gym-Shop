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

export interface IPackageResponse {
    isError: boolean;
    status: number;
    message: string;
    data?: {
        package?: IPackage;
        packages?: IPackage[];
        total?: number;
    };
}