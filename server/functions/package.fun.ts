"use server";

import { connectToDB } from "@/server/db";
import { SendResponse } from "../helper/sendResponse.helper";
import { handleServerError } from "../helper/ErrorHandler";
import { PackageModel } from "../models/package/package.model";
import { ICreatePackageInput, IPackageResponse, IUpdatePackageInput } from "../interface/package.interface";
import { IPackage } from "../models/package/package.interface";

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
    // Handle Mongoose documents
    const convertibleDoc = doc as ConvertibleObject;
    if (convertibleDoc.toJSON) {
      return convertibleDoc.toJSON();
    }
    // Handle ObjectId
    if (convertibleDoc._id && typeof convertibleDoc._id.toString === 'function') {
      return {
        ...convertibleDoc,
        _id: convertibleDoc._id.toString()
      };
    }
    // Handle arrays
    if (Array.isArray(doc)) {
      return doc.map(item => convertToPlainObject(item));
    }
    // Handle nested objects
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

export async function createPackageServerSide(body: ICreatePackageInput): Promise<IPackageResponse> {
    try {
        await connectToDB();

        const {
            title,
            description,
            price,
            originalPrice,
            features,
            imageUrl,
            rating = 5,
            isActive = true,
            isFeatured = false,
            category
        } = body;

        const existingPackage = await PackageModel.findOne({ 
            title: { $regex: new RegExp(`^${title}$`, 'i') } 
        });
        
        if (existingPackage) {
            return SendResponse({ 
                isError: true, 
                status: 409, 
                message: "Package with this title already exists" 
            });
        }

        const newPackage = await PackageModel.create({
            title,
            description,
            price,
            originalPrice,
            features: features.filter(f => f.trim() !== ""),
            imageUrl,
            rating,
            isActive,
            isFeatured,
            category
        });

        const plainPackage = convertToPlainObject(newPackage);

        return SendResponse({ 
            isError: false, 
            status: 201, 
            message: "Package created successfully",
            data: { package: plainPackage }
        });

    } catch (error) {
        return handleServerError(error);
    }
}


export async function getAPackageServerSide(id: unknown) {
    try {
        await connectToDB();

        const packageData = await PackageModel.findById(id).lean().exec();

        if (!packageData) {
            return {
                isError: true,
                status: 404,
                message: "Package not found."
            };
        }

        // Serialize for client component
        const serializedPackage = JSON.parse(JSON.stringify(packageData));

        return {
            isError: false,
            status: 200,
            message: "Package fetched successfully",
            data: serializedPackage
        };

    } catch (error) {
        return handleServerError(error);
    }
}

export async function getRelatedPackagesServerSide(
    category: string,
    excludePackageId: string
) {
    try {
        await connectToDB();

        const relatedPackages = await PackageModel.find({
            category: category,
            _id: { $ne: excludePackageId },
            isActive: true
        })
            .limit(8)
            .lean()
            .exec();

        // Serialize for client component
        const serializedPackages = JSON.parse(JSON.stringify(relatedPackages));

        return {
            isError: false,
            status: 200,
            message: "Related packages fetched successfully",
            data: serializedPackages
        };

    } catch (error) {
        return handleServerError(error);
    }
}

export async function getFeaturedPackagesServerSide() {
    try {
        await connectToDB();

        const featuredPackages = await PackageModel.findFeaturedPackages();

        // Serialize for client component
        const serializedPackages = JSON.parse(JSON.stringify(featuredPackages));

        return {
            isError: false,
            status: 200,
            message: "Featured packages fetched successfully",
            data: serializedPackages
        };

    } catch (error) {
        return handleServerError(error);
    }
}

export async function getAllPackagesServerSide({
                                                   filter = {},
                                                   page = 1,
                                                   limit = 12
                                               }: {
    filter?: Record<string, unknown>;
    page?: number;
    limit?: number;
}) {
    try {
        await connectToDB();

        // Calculate skip for pagination
        const skip = (page - 1) * limit;

        // Build the query
        let query = PackageModel.find().lean();

        // Apply filters
        if (Object.keys(filter).length > 0) {
            query = query.find(filter);
        }

        // Execute query with pagination and sorting
        const [packages, total] = await Promise.all([
            query
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
            PackageModel.countDocuments(query.getFilter()).lean()
        ]);

        // Calculate pagination info
        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        // Convert all packages to plain objects
        const plainPackages = packages.map(pkg => convertToPlainObject(pkg));

        return SendResponse({
            isError: false,
            status: 200,
            message: "Packages fetched successfully",
            data: {
                packages: plainPackages,
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

export async function getActivePackagesServerSide(): Promise<IPackageResponse> {
    try {
        await connectToDB();

        const packages = await PackageModel.find({ isActive: true }).sort({ createdAt: -1 }).exec();

        // Convert all packages to plain objects
        const plainPackages = packages.map(pkg => convertToPlainObject(pkg));

        return SendResponse({ 
            isError: false, 
            status: 200, 
            message: "Active packages fetched successfully",
            data: { packages: plainPackages }
        });

    } catch (error) {
        return handleServerError(error);
    }
}

export async function getPackagesByCategoryServerSide(category: string): Promise<IPackageResponse> {
    try {
        await connectToDB();

        const packages = await PackageModel.find({ category, isActive: true }).sort({ createdAt: -1 }).exec();

        // Convert all packages to plain objects
        const plainPackages = packages.map(pkg => convertToPlainObject(pkg));

        return SendResponse({ 
            isError: false, 
            status: 200, 
            message: `Packages for ${category} fetched successfully`,
            data: { packages: plainPackages }
        });

    } catch (error) {
        return handleServerError(error);
    }
}

export async function getPackageByIdServerSide(packageId: string): Promise<IPackageResponse> {
    try {
        await connectToDB();

        const packageData = await PackageModel.findById(packageId).lean().exec();

        if (!packageData) {
            return SendResponse({ 
                isError: true, 
                status: 404, 
                message: "Package not found" 
            });
        }

        // Convert to plain object (even though we used lean(), still ensure it's plain)
        const plainPackage = convertToPlainObject(packageData);

        return SendResponse({ 
            isError: false, 
            status: 200, 
            message: "Package fetched successfully",
            data: { package: plainPackage }
        });

    } catch (error) {
        return handleServerError(error);
    }
}

export async function updatePackageServerSide(packageId: string, body: IUpdatePackageInput): Promise<IPackageResponse> {
    try {
        await connectToDB();

        // Check if package exists
        const existingPackage = await PackageModel.findById(packageId).lean().exec();
        if (!existingPackage) {
            return SendResponse({ 
                isError: true, 
                status: 404, 
                message: "Package not found" 
            });
        }

        // Check if title is being updated and if it already exists
        if (body.title && body.title !== existingPackage.title) {
            const titleExists = await PackageModel.findOne({ 
                title: { $regex: new RegExp(`^${body.title}$`, 'i') },
                _id: { $ne: packageId }
            }).lean().exec();
            
            if (titleExists) {
                return SendResponse({ 
                    isError: true, 
                    status: 409, 
                    message: "Package with this title already exists" 
                });
            }
        }

        const updateData: Partial<IPackage> = {};
        if (body.title) updateData.title = body.title;
        if (body.description) updateData.description = body.description;
        if (body.price !== undefined) updateData.price = body.price;
        if (body.originalPrice !== undefined) updateData.originalPrice = body.originalPrice;
        if (body.features) updateData.features = body.features.filter(f => f.trim() !== "");
        if (body.imageUrl) updateData.imageUrl = body.imageUrl;
        if (body.rating !== undefined) updateData.rating = body.rating;
        if (typeof body.isActive === 'boolean') updateData.isActive = body.isActive;
        if (typeof body.isFeatured === 'boolean') updateData.isFeatured = body.isFeatured;
        if (body.category) updateData.category = body.category;

        const updatedPackage = await PackageModel.findByIdAndUpdate(
            packageId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).lean().exec();

        if (!updatedPackage) {
            return SendResponse({ 
                isError: true, 
                status: 404, 
                message: "Package not found during update" 
            });
        }

        // Convert to plain object
        const plainPackage = convertToPlainObject(updatedPackage);

        return SendResponse({ 
            isError: false, 
            status: 200, 
            message: "Package updated successfully",
            data: { package: plainPackage }
        });

    } catch (error) {
        return handleServerError(error);
    }
}

export async function deletePackageServerSide(packageId: string): Promise<IPackageResponse> {
    try {
        await connectToDB();

        const packageData = await PackageModel.findByIdAndDelete(packageId).lean().exec();

        if (!packageData) {
            return SendResponse({ 
                isError: true, 
                status: 404, 
                message: "Package not found" 
            });
        }

        return SendResponse({ 
            isError: false, 
            status: 200, 
            message: "Package deleted successfully" 
        });

    } catch (error) {
        return handleServerError(error);
    }
}

export async function togglePackageStatusServerSide(packageId: string): Promise<IPackageResponse> {
    try {
        await connectToDB();

        const packageData = await PackageModel.findById(packageId).lean().exec();

        if (!packageData) {
            return SendResponse({ 
                isError: true, 
                status: 404, 
                message: "Package not found" 
            });
        }

        const updatedPackage = await PackageModel.findByIdAndUpdate(
            packageId,
            { $set: { isActive: !packageData.isActive } },
            { new: true }
        ).lean().exec();

        if (!updatedPackage) {
            return SendResponse({ 
                isError: true, 
                status: 404, 
                message: "Package not found during status update" 
            });
        }

        // Convert to plain object
        const plainPackage = convertToPlainObject(updatedPackage);

        return SendResponse({ 
            isError: false, 
            status: 200, 
            message: `Package ${updatedPackage.isActive ? 'activated' : 'deactivated'} successfully`,
            data: { package: plainPackage }
        });

    } catch (error) {
        return handleServerError(error);
    }
}

export async function togglePackageFeaturedStatusServerSide(packageId: string): Promise<IPackageResponse> {
    try {
        await connectToDB();

        const packageData = await PackageModel.findById(packageId).lean().exec();

        if (!packageData) {
            return SendResponse({ 
                isError: true, 
                status: 404, 
                message: "Package not found" 
            });
        }

        const updatedPackage = await PackageModel.findByIdAndUpdate(
            packageId,
            { $set: { isFeatured: !packageData.isFeatured } },
            { new: true }
        ).lean().exec();

        if (!updatedPackage) {
            return SendResponse({ 
                isError: true, 
                status: 404, 
                message: "Package not found during featured status update" 
            });
        }

        // Convert to plain object
        const plainPackage = convertToPlainObject(updatedPackage);

        return SendResponse({ 
            isError: false, 
            status: 200, 
            message: `Package ${updatedPackage.isFeatured ? 'featured' : 'unfeatured'} successfully`,
            data: { package: plainPackage }
        });

    } catch (error) {
        return handleServerError(error);
    }
}