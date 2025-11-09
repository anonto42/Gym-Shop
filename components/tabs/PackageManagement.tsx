"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../ui/textarea";
import { Plus, Edit, Trash2, Star, Package, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { 
  createPackageServerSide, 
  getAllPackagesServerSide, 
  updatePackageServerSide, 
  deletePackageServerSide,
  togglePackageFeaturedStatusServerSide,
} from "@/server/functions/package.fun";
import { toast } from "sonner";
import { IPackage } from "@/server/models/package/package.interface";
import ImageWithSkeleton from "../ui/ImageWIthSkeleton";
import { uploadMultipleToCloudinary } from "@/server/helper/cloudinary.helper";

interface FormData {
    title: string;
    description: string;
    price: string;
    originalPrice: string;
    features: string[];
    imageUrl: string[];
    rating: number;
    isActive: boolean;
    isFeatured: boolean;
    category: string;
}

const convertToPlainObject = (obj: any): any => {
    if (obj && typeof obj === 'object') {
        // Handle Mongoose documents
        if (obj.toJSON) {
            return obj.toJSON();
        }
        // Handle ObjectId
        if (obj._id && typeof obj._id.toString === 'function') {
            return {
                ...obj,
                _id: obj._id.toString()
            };
        }
        // Handle arrays
        if (Array.isArray(obj)) {
            return obj.map(item => convertToPlainObject(item));
        }
        // Handle nested objects
        const plainObj: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                plainObj[key] = convertToPlainObject(obj[key]);
            }
        }
        return plainObj;
    }
    return obj;
};

export default function PackageManagement() {
    const [packages, setPackages] = useState<IPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<IPackage | null>(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        price: "",
        originalPrice: "",
        features: [""],
        imageUrl: [],
        rating: 5,
        isActive: true,
        isFeatured: false,
        category: ""
    });

    useEffect(() => {
        setIsMounted(true);
        const initialize = async () => {
            try {
                setLoading(true);
                const response = await getAllPackagesServerSide();
                if (!response.isError && response.data?.packages) {
                    // Convert MongoDB objects to plain objects and ensure imageUrl is array
                    const plainPackages = response.data.packages.map(pkg => {
                        const plainPkg = convertToPlainObject(pkg);
                        // Ensure imageUrl is always an array of strings
                        if (plainPkg.imageUrl && !Array.isArray(plainPkg.imageUrl)) {
                            plainPkg.imageUrl = [plainPkg.imageUrl];
                        } else if (!plainPkg.imageUrl) {
                            plainPkg.imageUrl = [];
                        }
                        return plainPkg;
                    });
                    setPackages(plainPackages);
                } else {
                    toast.error("Failed to load packages");
                }
            } catch (error) {
                console.error("Error loading packages:", error);
                toast.error("Failed to load packages");
            } finally {
                setLoading(false);
            }
        };
        
        initialize();
    }, []);

    const clearImageSelection = () => {
        setPreviewImages([]);
        setSelectedFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files);
            
            // Validate each file
            for (const file of newFiles) {
                if (file.size > 10 * 1024 * 1024) {
                    toast.error(`File ${file.name} must be less than 10MB`);
                    return;
                }
                
                if (!file.type.startsWith('image/')) {
                    toast.error(`File ${file.name} must be an image`);
                    return;
                }
            }
            
            setSelectedFiles(prev => [...prev, ...newFiles]);
            
            // Create previews for new files
            const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
            setPreviewImages(prev => [...prev, ...newPreviewUrls]);
            
            toast.success(`${newFiles.length} image(s) selected. Click 'Upload Images' to save.`);
        }
    };

    const handleImageUpload = async () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            toast.error("Please select images first");
            return;
        }
        
        try {
            setImageUploading(true);
            
            // Call the server function with the selected files array
            const response = await uploadMultipleToCloudinary(selectedFiles);
            console.log("this is the response of the server function :-: ", response)
            
            // if (!response.isError && response.data?.imageUrls) {
            //     // Add all uploaded image URLs to formData
            //     setFormData(prev => ({ 
            //         ...prev, 
            //         imageUrl: [...prev.imageUrl, ...response.data!.imageUrls] 
            //     }));
            //     toast.success(`Successfully uploaded ${response.data.imageUrls.length} image(s)`);
                
            //     // Clear the selection after successful upload
            //     clearImageSelection();
            // } else {
            //     toast.error(response.message || "Failed to upload images");
            // }
        } catch (error) {
            console.error("Error uploading images:", error);
            toast.error("Failed to upload images");
        } finally {
            setImageUploading(false);
        }
    };

    // Remove individual image
    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            imageUrl: prev.imageUrl.filter((_, i) => i !== index)
        }));
    };

    // Open modal for adding new package
    const handleAddNew = () => {
        setEditingPackage(null);
        setFormData({
            title: "",
            description: "",
            price: "",
            originalPrice: "",
            features: [""],
            imageUrl: [],
            rating: 5,
            isActive: true,
            isFeatured: false,
            category: ""
        });
        clearImageSelection();
        setIsModalOpen(true);
    };

    // Open modal for editing package
    const handleEdit = (pkg: IPackage) => {
        // Ensure we're working with a plain object and imageUrl is array of strings
        const plainPackage = convertToPlainObject(pkg);
        const imageUrlArray: string[] = Array.isArray(plainPackage.imageUrl) 
            ? plainPackage.imageUrl.filter((url: any): url is string => typeof url === 'string')
            : (plainPackage.imageUrl && typeof plainPackage.imageUrl === 'string' ? [plainPackage.imageUrl] : []);
        
        setEditingPackage(plainPackage);
        setFormData({
            title: plainPackage.title,
            description: plainPackage.description,
            price: plainPackage.price.toString(),
            originalPrice: plainPackage.originalPrice?.toString() || "",
            features: plainPackage.features.length > 0 ? plainPackage.features : [""],
            imageUrl: imageUrlArray,
            rating: plainPackage.rating,
            isActive: plainPackage.isActive,
            isFeatured: plainPackage.isFeatured,
            category: plainPackage.category
        });
        clearImageSelection();
        setIsModalOpen(true);
    };

    // Handle delete package
    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this package?")) {
            return;
        }

        try {
            const response = await deletePackageServerSide(id);
            if (!response.isError) {
                setPackages(packages.filter((pkg) => pkg._id !== id));
                toast.success("Package deleted successfully");
            } else {
                toast.error(response.message || "Failed to delete package");
            }
        } catch (error) {
            console.error("Error deleting package:", error);
            toast.error("Failed to delete package");
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const packageData = {
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
                features: formData.features.filter(feature => feature.trim() !== ""),
                imageUrl: formData.imageUrl,
                rating: formData.rating,
                isActive: formData.isActive,
                isFeatured: formData.isFeatured,
                category: formData.category
            };

            let response;
            if (editingPackage) {
                response = await updatePackageServerSide(editingPackage._id.toString(), packageData);
            } else {
                response = await createPackageServerSide(packageData);
            }

            if (!response.isError) {
                // Reload packages to get updated data
                const reloadResponse = await getAllPackagesServerSide();
                if (!reloadResponse.isError && reloadResponse.data?.packages) {
                    const plainPackages = reloadResponse.data.packages.map(pkg => {
                        const plainPkg = convertToPlainObject(pkg);
                        // Ensure imageUrl is always an array of strings
                        if (plainPkg.imageUrl && !Array.isArray(plainPkg.imageUrl)) {
                            plainPkg.imageUrl = [plainPkg.imageUrl];
                        } else if (!plainPkg.imageUrl) {
                            plainPkg.imageUrl = [];
                        }
                        return plainPkg;
                    });
                    setPackages(plainPackages);
                }
                
                setIsModalOpen(false);
                setEditingPackage(null);
                clearImageSelection();
                toast.success(editingPackage ? "Package updated successfully" : "Package created successfully");
            } else {
                toast.error(response.message || `Failed to ${editingPackage ? 'update' : 'create'} package`);
            }
        } catch (error) {
            console.error("Error saving package:", error);
            toast.error(`Failed to ${editingPackage ? 'update' : 'create'} package`);
        } finally {
            setFormLoading(false);
        }
    };

    // Toggle featured status
    const handleToggleFeatured = async (pkg: IPackage) => {
        try {
            const response = await togglePackageFeaturedStatusServerSide(pkg._id.toString());
            if (!response.isError) {
                // Reload packages to get updated data
                const reloadResponse = await getAllPackagesServerSide();
                if (!reloadResponse.isError && reloadResponse.data?.packages) {
                    const plainPackages = reloadResponse.data.packages.map(pkg => {
                        const plainPkg = convertToPlainObject(pkg);
                        // Ensure imageUrl is always an array of strings
                        if (plainPkg.imageUrl && !Array.isArray(plainPkg.imageUrl)) {
                            plainPkg.imageUrl = [plainPkg.imageUrl];
                        } else if (!plainPkg.imageUrl) {
                            plainPkg.imageUrl = [];
                        }
                        return plainPkg;
                    });
                    setPackages(plainPackages);
                }
                toast.success(response.message || "Package status updated");
            } else {
                toast.error(response.message || "Failed to update package status");
            }
        } catch (error) {
            console.error("Error toggling featured status:", error);
            toast.error("Failed to update package status");
        }
    };

    // Add feature field
    const addFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, ""]
        }));
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    // Update feature value
    const updateFeature = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.map((feature, i) => i === index ? value : feature)
        }));
    };

    // Render star ratings
    const renderStars = (rating: number) => {
        return (
            <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                ))}
            </div>
        );
    };

    // Show loading until component is mounted
    if (!isMounted || loading) {
        return (
            <div className="w-full min-h-[88vh] p-4 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-[#125BAC]" />
                    <p className="text-gray-600">Loading packages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-[88vh] p-4">
            <div className="w-full h-full bg-white border rounded-3xl overflow-hidden">
                {/* Header */}
                <div className="w-full flex flex-col sm:flex-row justify-between items-center p-6 border-b">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Package Management</h1>
                        <p className="text-gray-600 mt-1">Manage your valuable packages</p>
                    </div>
                    <Button 
                        onClick={handleAddNew}
                        className="bg-[#125BAC] hover:bg-[#0d4793] cursor-pointer flex items-center gap-2 mt-2 sm:mt-0"
                    >
                        <Plus size={20} />
                        Add New Package
                    </Button>
                </div>

                {/* Packages Grid */}
                <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 overflow-auto">
                    {packages.map((pkg) => (
                        <div
                            key={pkg._id.toString()}
                            className="w-full border-2 rounded-2xl p-4 relative shadow-lg hover:shadow-xl transition-all duration-300 bg-white group"
                        >
                            {/* Featured Badge */}
                            {pkg.isFeatured && (
                                <div className="absolute -top-2 -left-2 bg-[#F27D31] text-white px-3 py-1 rounded-full text-xs font-bold">
                                    Featured
                                </div>
                            )}

                            {/* Inactive Badge */}
                            {!pkg.isActive && (
                                <div className="absolute -top-2 -left-2 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                    Inactive
                                </div>
                            )}

                            {/* Package Images */}
                            {pkg.imageUrl && pkg.imageUrl.length > 0 && (
                                <div className="w-full h-32 mb-3 rounded-lg overflow-hidden relative">
                                    <ImageWithSkeleton 
                                        src={pkg.imageUrl[0]}
                                        alt={pkg.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {pkg.imageUrl.length > 1 && (
                                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                                            +{pkg.imageUrl.length - 1} more
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Package Content */}
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{pkg.title}</h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{pkg.description}</p>
                                
                                {renderStars(pkg.rating)}
                                
                                <div className="mt-3 space-y-1">
                                    <p className="text-2xl font-bold text-[#125BAC]">${pkg.price}</p>
                                    {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                                        <p className="text-sm text-gray-500 line-through">${pkg.originalPrice}</p>
                                    )}
                                    <p className="text-xs text-gray-400 capitalize">{pkg.category}</p>
                                </div>

                                {/* Features */}
                                {pkg.features.length > 0 && (
                                    <div className="mt-3 text-left">
                                        <p className="text-xs font-semibold text-gray-700 mb-1">Features:</p>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            {pkg.features.slice(0, 3).map((feature, index) => (
                                                <li key={index} className="line-clamp-1">• {feature}</li>
                                            ))}
                                            {pkg.features.length > 3 && (
                                                <li className="text-gray-400">+{pkg.features.length - 3} more</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    onClick={() => handleToggleFeatured(pkg)}
                                    size="sm"
                                    className={`p-2 h-8 w-8 ${
                                        pkg.isFeatured 
                                            ? "bg-[#F27D31] hover:bg-[#e06d21]" 
                                            : "bg-gray-500 hover:bg-gray-600"
                                    } text-white`}
                                    title={pkg.isFeatured ? "Remove from featured" : "Mark as featured"}
                                >
                                    <Star size={14} fill={pkg.isFeatured ? "white" : "none"} />
                                </Button>
                                <Button
                                    onClick={() => handleEdit(pkg)}
                                    size="sm"
                                    className="bg-[#125BAC] hover:bg-[#0d4793] text-white p-2 h-8 w-8"
                                    title="Edit package"
                                >
                                    <Edit size={14} />
                                </Button>
                                <Button
                                    onClick={() => handleDelete(pkg._id.toString())}
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700 text-white p-2 h-8 w-8"
                                    title="Delete package"
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {packages.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Package size={64} className="mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No packages available</h3>
                            <p className="text-gray-500 mb-4">Get started by creating your first package</p>
                            <Button 
                                onClick={handleAddNew}
                                className="bg-[#125BAC] hover:bg-[#0d4793]"
                            >
                                <Plus size={20} className="mr-2" />
                                Add Your First Package
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Package Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                {editingPackage ? "Edit Package" : "Add New Package"}
                            </h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    clearImageSelection();
                                }}
                                className="h-8 w-8 p-0"
                            >
                                <X size={20} />
                            </Button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                                        Package Title *
                                    </Label>
                                    <Input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#125BAC]"
                                        placeholder="Enter package title"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </Label>
                                    <Textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#125BAC]"
                                        placeholder="Enter package description"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price ($) *
                                    </Label>
                                    <Input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#125BAC]"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                                        Original Price ($)
                                    </Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.originalPrice}
                                        onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#125BAC]"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category *
                                    </Label>
                                    <Input
                                        type="text"
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#125BAC]"
                                        placeholder="e.g. Dog Food, Cat Care, Bird Supplies"
                                    />
                                </div>
                            </div>

                            {/* Features Section */}
                            <div>
                                <Label className="block text-sm font-medium text-gray-700 mb-1">
                                    Features
                                </Label>
                                <div className="space-y-2">
                                    {formData.features.map((feature, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => updateFeature(index, e.target.value)}
                                                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#125BAC]"
                                                placeholder="Enter feature"
                                            />
                                            {formData.features.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeFeature(index)}
                                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                                >
                                                    <X size={16} />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addFeature}
                                        className="text-[#125BAC] border-[#125BAC] hover:bg-blue-50"
                                    >
                                        <Plus size={16} className="mr-1" />
                                        Add Feature
                                    </Button>
                                </div>
                            </div>

                            {/* Image Upload Section */}
                            <div>
                                <Label className="block text-sm font-medium text-gray-700 mb-1">
                                    Package Images
                                </Label>
                                
                                {/* Current Images */}
                                {formData.imageUrl.length > 0 && (
                                    <div className="mb-4">
                                        <Label className="text-sm font-medium mb-2 block text-green-600">
                                            Current Images ({formData.imageUrl.length})
                                        </Label>
                                        <div className="flex flex-wrap gap-4">
                                            {formData.imageUrl.map((url, index) => (
                                                <div key={index} className="relative">
                                                    <div className="h-32 w-32 bg-gray-50 border-2 border-gray-300 rounded-2xl overflow-hidden">
                                                        <ImageWithSkeleton 
                                                            src={url} 
                                                            alt={`Package image ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-600 text-white border-red-600 hover:bg-red-700"
                                                    >
                                                        <X size={12} />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New Image Previews */}
                                {previewImages.length > 0 && (
                                    <div className="mb-4">
                                        <Label className="text-sm font-medium mb-2 block text-green-600">
                                            New Image Previews ({previewImages.length})
                                        </Label>
                                        <div className="flex flex-wrap gap-4">
                                            {previewImages.map((previewUrl, index) => (
                                                <div key={index} className="relative">
                                                    <div className="h-32 w-32 bg-gray-50 border-2 border-green-300 rounded-2xl overflow-hidden">
                                                        <ImageWithSkeleton 
                                                            src={previewUrl} 
                                                            alt={`New image preview ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Clear Selection Button */}
                                        <div className="flex justify-center mt-2">
                                            <Button 
                                                onClick={clearImageSelection}
                                                variant="outline"
                                                className="border-red-300 text-red-600 hover:bg-red-50 text-sm"
                                            >
                                                Clear All Selections
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* File Input Area */}
                                <div className="h-20 w-full bg-blue-50 border-2 border-dashed border-blue-300 rounded-2xl relative flex items-center justify-center transition-colors hover:bg-blue-100 hover:border-blue-400">
                                    <Input 
                                        ref={fileInputRef}
                                        type="file" 
                                        accept="image/*"
                                        multiple
                                        className="absolute w-full h-full top-0 opacity-0 cursor-pointer z-30"
                                        onChange={handleFileChange}
                                    />
                                    <div className="text-center p-4">
                                        <p className="text-blue-600 font-medium text-sm">
                                            {previewImages.length > 0 
                                                ? `✅ ${previewImages.length} Image(s) Selected` 
                                                : '📁 Click to select images'
                                            }
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {previewImages.length > 0 
                                                ? 'Ready to upload' 
                                                : 'Supports: PNG, JPG, WEBP (Max 10MB each) - Select multiple'
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Upload Images Button */}
                                {selectedFiles.length > 0 && (
                                    <div className="flex justify-center mt-3">
                                        <Button 
                                            onClick={handleImageUpload}
                                            className="bg-green-600 hover:bg-green-700 cursor-pointer"
                                            disabled={imageUploading}
                                            size="sm"
                                        >
                                            {imageUploading ? (
                                                <Loader2 size={16} className="animate-spin mr-2" />
                                            ) : (
                                                <ImageIcon size={16} className="mr-2" />
                                            )}
                                            {imageUploading 
                                                ? `Uploading ${selectedFiles.length} Image(s)...` 
                                                : `Upload ${selectedFiles.length} Image(s)`
                                            }
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Rating and Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rating
                                    </Label>
                                    <select
                                        value={formData.rating}
                                        onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#125BAC]"
                                    >
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <option key={rating} value={rating}>
                                                {rating} Star{rating > 1 ? 's' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isFeatured}
                                            onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                                            className="rounded border-gray-300 text-[#125BAC] focus:ring-[#125BAC]"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Featured Package</span>
                                    </label>

                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                            className="rounded border-gray-300 text-[#125BAC] focus:ring-[#125BAC]"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Active</span>
                                    </label>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 pt-4 border-t">
                                <Button
                                    type="submit"
                                    className="flex-1 bg-[#125BAC] hover:bg-[#0d4793]"
                                    disabled={formLoading}
                                >
                                    {formLoading ? (
                                        <Loader2 size={16} className="animate-spin mr-2" />
                                    ) : null}
                                    {editingPackage ? "Update Package" : "Create Package"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        clearImageSelection();
                                    }}
                                    className="flex-1"
                                    disabled={formLoading}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}