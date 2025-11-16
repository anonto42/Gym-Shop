"use client";

import React from "react";
import { IPackage } from "@/server/models/package/package.interface";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { X, Star, ImageIcon, Upload, Loader2, Plus } from "lucide-react";
import Image from "next/image";

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

interface PackageModalProps {
    editingPackage: IPackage | null;
    formData: FormData;
    setFormData: (formData: FormData) => void;
    previewImages: string[];
    selectedFiles: File[];
    imageUploading: boolean;
    formLoading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onImageUpload: () => void;
    onRemoveImage: (index: number) => void;
    onAddFeature: () => void;
    onRemoveFeature: (index: number) => void;
    onUpdateFeature: (index: number, value: string) => void;
}

const PackageModal = React.memo(({
                                     editingPackage,
                                     formData,
                                     setFormData,
                                     previewImages,
                                     selectedFiles,
                                     imageUploading,
                                     formLoading,
                                     fileInputRef,
                                     onClose,
                                     onSubmit,
                                     onFileChange,
                                     onImageUpload,
                                     onRemoveImage,
                                     onAddFeature,
                                     onRemoveFeature,
                                     onUpdateFeature,
                                 }: PackageModalProps) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold">
                        {editingPackage ? "Edit Package" : "Add New Package"}
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X size={20} />
                    </Button>
                </div>

                <form onSubmit={onSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-800">Basic Information</h3>

                            <div>
                                <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Package Title *
                                </Label>
                                <Input
                                    id="title"
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full"
                                    placeholder="Enter package title"
                                />
                            </div>

                            <div>
                                <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    rows={3}
                                    className="w-full"
                                    placeholder="Enter package description"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                        Price *
                                    </Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        className="w-full"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                        Original Price
                                    </Label>
                                    <Input
                                        id="originalPrice"
                                        type="number"
                                        step="0.01"
                                        value={formData.originalPrice}
                                        onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                                        className="w-full"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                </Label>
                                <Input
                                    id="category"
                                    type="text"
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    className="w-full"
                                    placeholder="Enter category"
                                />
                            </div>

                            <div>
                                <Label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rating
                                </Label>
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setFormData({...formData, rating: star})}
                                                className="p-1"
                                            >
                                                <Star
                                                    size={20}
                                                    className={`${
                                                        star <= formData.rating
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-300"
                                                    } hover:text-yellow-400 transition-colors`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">({formData.rating}/5)</span>
                                </div>
                            </div>
                        </div>

                        {/* Images & Features */}
                        <div className="space-y-4">
                            {/* Image Upload */}
                            <div>
                                <h3 className="font-semibold text-lg text-gray-800 mb-3">Images</h3>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={onFileChange}
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <div className="flex gap-2 mb-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-2"
                                        >
                                            <ImageIcon size={16} />
                                            Choose Images
                                        </Button>
                                        {selectedFiles.length > 0 && (
                                            <Button
                                                type="button"
                                                onClick={onImageUpload}
                                                disabled={imageUploading}
                                                className="flex items-center gap-2"
                                            >
                                                {imageUploading ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <Upload size={16} />
                                                )}
                                                {imageUploading ? "Uploading..." : "Upload Images"}
                                            </Button>
                                        )}
                                    </div>

                                    {selectedFiles.length > 0 && (
                                        <p className="text-sm text-gray-600 mb-2">
                                            {selectedFiles.length} image(s) selected for upload
                                        </p>
                                    )}

                                    {(formData.imageUrl.length > 0 || previewImages.length > 0) && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-600 mb-2">Package Images:</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {formData.imageUrl.map((url, index) => (
                                                    <div key={`saved-${index}`} className="relative group">
                                                        <Image
                                                            src={url}
                                                            alt={`Package ${index + 1}`}
                                                            width={100}
                                                            height={80}
                                                            className="w-full h-20 object-cover rounded"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => onRemoveImage(index)}
                                                            className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X size={12} />
                                                        </Button>
                                                    </div>
                                                ))}
                                                {previewImages.map((src, index) => (
                                                    <div key={`preview-${index}`} className="relative group">
                                                        <Image
                                                            src={src}
                                                            alt={`Preview ${index + 1}`}
                                                            width={100}
                                                            height={80}
                                                            className="w-full h-20 object-cover rounded border-2 border-blue-300"
                                                        />
                                                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                              <span className="text-white text-xs font-medium bg-blue-600 px-2 py-1 rounded">
                                New
                              </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Features */}
                            <div>
                                <h3 className="font-semibold text-lg text-gray-800 mb-3">Features</h3>
                                <div className="space-y-2">
                                    {formData.features.map((feature, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => onUpdateFeature(index, e.target.value)}
                                                placeholder={`Feature ${index + 1}`}
                                                className="flex-1"
                                            />
                                            {formData.features.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onRemoveFeature(index)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <X size={16} />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onAddFeature}
                                        className="w-full flex items-center gap-2"
                                    >
                                        <Plus size={16} />
                                        Add Feature
                                    </Button>
                                </div>
                            </div>

                            {/* Status Toggles */}
                            <div className="space-y-3 pt-4">
                                <h3 className="font-semibold text-lg text-gray-800">Status</h3>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                                        Active Package
                                    </Label>
                                    <button
                                        type="button"
                                        id="isActive"
                                        onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                            formData.isActive ? "bg-green-600" : "bg-gray-200"
                                        } transition-colors`}
                                    >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            formData.isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                                        Featured Package
                                    </Label>
                                    <button
                                        type="button"
                                        id="isFeatured"
                                        onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                            formData.isFeatured ? "bg-yellow-600" : "bg-gray-200"
                                        } transition-colors`}
                                    >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            formData.isFeatured ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3 justify-end mt-8 pt-6 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={formLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={formLoading || imageUploading}
                            className="bg-[#125BAC] hover:bg-[#0d4793]"
                        >
                            {formLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin mr-2" />
                                    {editingPackage ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                editingPackage ? "Update Package" : "Create Package"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
});

PackageModal.displayName = 'PackageModal';

export default PackageModal;