"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Star, Upload, X } from "lucide-react";
import {
    getAllProductsServerSide,
    createProductServerSide,
    updateProductServerSide,
    deleteProductServerSide,
} from "@/server/functions/product.fun";
import { toast } from "sonner";
import { IProduct } from "@/server/models/product/product.interface";
import { uploadMultipleToCloudinary } from "@/server/helper/cloudinary.helper";
import Image from "next/image";

interface FormData {
    title: string;
    description: string;
    price: string;
    originalPrice: string;
    images: string[];
    category: string;
    brand: string;
    stock: string;
    rating: number;
    tags: string[];
    specifications: Record<string, string>;
    isActive: boolean;
    isFeatured: boolean;
}

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

export default function ProductManagement() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newSpecKey, setNewSpecKey] = useState("");
    const [newSpecValue, setNewSpecValue] = useState("");
    const [newTag, setNewTag] = useState("");

    // Pagination state
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        hasNext: true
    });

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        price: "",
        originalPrice: "",
        images: [],
        category: "",
        brand: "",
        stock: "",
        tags: [""],
        rating: 0,
        specifications: {},
        isActive: true,
        isFeatured: false
    });

    const loadProducts = useCallback(async (page: number, initialLoad: boolean = false) => {
        try {
            if (initialLoad) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const response = await getAllProductsServerSide({
                filter: {},
                page: page,
                limit: pagination.limit
            });

            if (!response.isError && response.data) {
                const { products: newProducts } = response.data as { products: IProduct[] };
                const plainProducts = newProducts.map(product => convertToPlainObject(product) as IProduct);

                if (page === 1) {
                    setProducts(plainProducts);
                } else {
                    setProducts(prev => [...prev, ...plainProducts]);
                }

                const hasMore = newProducts.length === pagination.limit;
                setPagination(prev => ({
                    ...prev,
                    page: page,
                    hasNext: hasMore
                }));
            } else {
                toast.error("Failed to load products");
            }
        } catch (error) {
            console.error("Error loading products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [pagination.limit]);

    useEffect(() => {
        setIsMounted(true);
        loadProducts(1, true);
    }, [loadProducts]);

    const handleAddNew = useCallback(() => {
        setEditingProduct(null);
        setFormData({
            title: "",
            description: "",
            price: "",
            originalPrice: "",
            images: [],
            category: "",
            rating: 0,
            brand: "",
            stock: "",
            tags: [""],
            specifications: {},
            isActive: true,
            isFeatured: false
        });
        setPreviewImages([]);
        setSelectedFiles([]);
        setIsModalOpen(true);
    }, []);

    const handleEdit = useCallback((product: IProduct) => {
        setEditingProduct(product);
        setFormData({
            title: product.title,
            description: product.description,
            price: product.price.toString(),
            originalPrice: product.originalPrice?.toString() || "",
            images: product.images,
            rating: product.rating || 0,
            category: product.category,
            brand: product.brand,
            stock: product.stock.toString(),
            tags: product.tags,
            specifications: product.specifications || {},
            isActive: product.isActive,
            isFeatured: product.isFeatured
        });
        setPreviewImages(product.images);
        setSelectedFiles([]);
        setIsModalOpen(true);
    }, []);

    const handleDelete = useCallback(async (productId: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await deleteProductServerSide(productId);

            if (!response.isError) {
                toast.success("Product deleted successfully");
                setProducts(prev => prev.filter(p => p._id.toString() !== productId));
            } else {
                toast.error("Failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        }
    }, []);

    const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        setSelectedFiles(prev => [...prev, ...newFiles]);

        // Create preview URLs
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...newPreviews]);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, []);

    const removeImage = useCallback((index: number) => {
        // Revoke the object URL to avoid memory leaks
        if (index < previewImages.length && !formData.images.includes(previewImages[index])) {
            URL.revokeObjectURL(previewImages[index]);
        }

        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    }, [previewImages, formData.images]);

    // Upload images to Cloudinary
    const uploadImagesToCloudinary = useCallback(async (): Promise<string[]> => {
        if (selectedFiles.length === 0) {
            return formData.images; // Return existing images if no new files
        }

        setImageUploading(true);
        try {
            const uploadedUrls = await uploadMultipleToCloudinary(selectedFiles);

            // Combine existing images with new uploaded images
            const allImages = [...formData.images, ...uploadedUrls];
            return allImages;
        } catch (error) {
            console.error("Error uploading images:", error);
            toast.error("Failed to upload images");
            throw error;
        } finally {
            setImageUploading(false);
        }
    }, [selectedFiles, formData.images]);

    const addSpecification = useCallback(() => {
        if (newSpecKey.trim() && newSpecValue.trim()) {
            setFormData(prev => ({
                ...prev,
                specifications: {
                    ...prev.specifications,
                    [newSpecKey.trim()]: newSpecValue.trim()
                }
            }));
            setNewSpecKey("");
            setNewSpecValue("");
        }
    }, [newSpecKey, newSpecValue]);

    const removeSpecification = useCallback((key: string) => {
        setFormData(prev => {
            const newSpecs = { ...prev.specifications };
            delete newSpecs[key];
            return { ...prev, specifications: newSpecs };
        });
    }, []);

    const addTag = useCallback(() => {
        if (newTag.trim()) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags.filter(tag => tag.trim()), newTag.trim()]
            }));
            setNewTag("");
        }
    }, [newTag]);

    const removeTag = useCallback((tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            // Upload images to Cloudinary first
            let finalImages: string[] = [];

            if (selectedFiles.length > 0) {
                finalImages = await uploadImagesToCloudinary();
            } else {
                finalImages = formData.images; // Use existing images if no new files
            }

            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
                stock: parseInt(formData.stock),
                rating: formData.rating,
                images: finalImages,
                tags: formData.tags.filter(tag => tag.trim())
            };

            let response;
            if (editingProduct) {
                response = await updateProductServerSide(editingProduct._id.toString(), productData);
            } else {
                response = await createProductServerSide(productData);
            }

            if (!response.isError) {
                toast.success(`Product ${editingProduct ? 'updated' : 'created'} successfully`);
                setIsModalOpen(false);

                // Clean up preview URLs
                previewImages.forEach(url => {
                    if (!formData.images.includes(url)) {
                        URL.revokeObjectURL(url);
                    }
                });

                loadProducts(1, true); // Reload products
            } else {
                toast.error(`Failed to ${editingProduct ? 'update' : 'create'} product`);
            }
        } catch (error) {
            console.error("Error saving product:", error);
            toast.error(`Failed to ${editingProduct ? 'update' : 'create'} product`);
        } finally {
            setFormLoading(false);
        }
    }, [
        formData,
        selectedFiles,
        uploadImagesToCloudinary,
        editingProduct,
        previewImages,
        loadProducts
    ]);

    const handleInputChange = useCallback((field: keyof FormData, value: string | boolean | number | string[] | Record<string, string>) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleRatingChange = useCallback((rating: number) => {
        setFormData(prev => ({ ...prev, rating }));
    }, []);

    const handleScroll = useCallback(() => {
        if (!scrollContainerRef.current || loadingMore || !pagination.hasNext) return;

        const container = scrollContainerRef.current;
        const { scrollTop, scrollHeight, clientHeight } = container;

        if (scrollHeight - scrollTop <= clientHeight + 100) {
            loadProducts(pagination.page + 1);
        }
    }, [loadingMore, pagination.hasNext, pagination.page, loadProducts]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, [handleScroll]);

    // Clean up preview URLs when component unmounts or modal closes
    useEffect(() => {
        return () => {
            previewImages.forEach(url => {
                if (!formData.images.includes(url)) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [previewImages, formData.images]);

    if (!isMounted) {
        return (
            <div className="w-full min-h-[88vh] p-4">
                <div className="w-full h-full bg-white border rounded-3xl flex items-center justify-center">
                    <div className="text-gray-500">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-[88vh] p-4">
            <div className="w-full h-full bg-white border rounded-3xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="w-full flex flex-col sm:flex-row justify-between items-center p-6 border-b">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
                        <p className="text-gray-600 mt-1">Manage your products</p>
                    </div>
                    <Button
                        onClick={handleAddNew}
                        className="bg-[#125BAC] hover:bg-[#0d4793] cursor-pointer flex items-center gap-2 mt-2 sm:mt-0"
                    >
                        <Plus size={20} />
                        Add New Product
                    </Button>
                </div>

                {/* Products Grid */}
                <div
                    ref={scrollContainerRef}
                    className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 overflow-auto"
                    onScroll={handleScroll}
                >
                    {loading ? (
                        // Loading skeleton
                        Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="w-full border-2 rounded-2xl p-4 animate-pulse">
                                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))
                    ) : products.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-lg">No products found</p>
                            <Button onClick={handleAddNew} className="mt-4">
                                Add Your First Product
                            </Button>
                        </div>
                    ) : (
                        <>
                            {products.map((product) => (
                                <div
                                    key={product._id.toString()}
                                    className="w-full border-2 rounded-2xl p-4 relative shadow-lg hover:shadow-xl transition-all duration-300 bg-white group"
                                >
                                    {/* Status Badges */}
                                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                                        {!product.isActive && (
                                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                                Inactive
                                            </span>
                                        )}
                                        {product.isFeatured && (
                                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                <Star size={12} />
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(product)}
                                            className="h-8 w-8 p-0 bg-white"
                                        >
                                            <Edit size={14} />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(product._id.toString())}
                                            className="h-8 w-8 p-0 bg-white text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>

                                    {/* Product Image */}
                                    <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 overflow-hidden">
                                        {product.images && product.images.length > 0 ? (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.title}
                                                width={300}
                                                height={192}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                                        {product.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {product.description}
                                    </p>

                                    {/* Price */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg font-bold text-gray-900">
                                            ${product.price}
                                        </span>
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <span className="text-sm text-gray-500 line-through">
                                                ${product.originalPrice}
                                            </span>
                                        )}
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-3">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={16}
                                                    className={`${
                                                        star <= (product.rating || 0)
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-300"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600 ml-1">
                                            ({product.rating || 0}/5)
                                        </span>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Stock: {product.stock}</span>
                                        <span>{product.category}</span>
                                    </div>

                                    {/* Tags */}
                                    {product.tags && product.tags.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1">
                                            {product.tags.slice(0, 3).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {product.tags.length > 3 && (
                                                <span className="text-gray-400 text-xs">
                                                    +{product.tags.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {loadingMore && (
                                Array.from({ length: 4 }).map((_, index) => (
                                    <div key={`loading-${index}`} className="w-full border-2 rounded-2xl p-4 animate-pulse">
                                        <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    </div>
                                ))
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Add/Edit Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold">
                                {editingProduct ? "Edit Product" : "Add New Product"}
                            </h2>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    // Clean up preview URLs
                                    previewImages.forEach(url => {
                                        if (!formData.images.includes(url)) {
                                            URL.revokeObjectURL(url);
                                        }
                                    });
                                }}
                                className="h-8 w-8 p-0"
                            >
                                <X size={20} />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-auto max-h-[70vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">Basic Information</h3>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Title *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => handleInputChange("title", e.target.value)}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Product title"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => handleInputChange("description", e.target.value)}
                                            rows={3}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Product description"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Price *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={formData.price}
                                                onChange={(e) => handleInputChange("price", e.target.value)}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Original Price</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.originalPrice}
                                                onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Category *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.category}
                                                onChange={(e) => handleInputChange("category", e.target.value)}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Category"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Brand</label>
                                            <input
                                                type="text"
                                                value={formData.brand}
                                                onChange={(e) => handleInputChange("brand", e.target.value)}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Brand"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Stock *</label>
                                            <input
                                                type="number"
                                                required
                                                value={formData.stock}
                                                onChange={(e) => handleInputChange("stock", e.target.value)}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Rating</label>
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => handleRatingChange(star)}
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
                                                <span className="text-sm text-gray-600">
                                                    ({formData.rating}/5)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Images & Settings */}
                                <div className="space-y-4">
                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Images</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileSelect}
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full flex items-center gap-2"
                                                disabled={imageUploading}
                                            >
                                                <Upload size={20} />
                                                {imageUploading ? "Uploading to Cloudinary..." : "Choose Images"}
                                            </Button>

                                            {/* Image Previews */}
                                            {(previewImages.length > 0) && (
                                                <div className="mt-4">
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {previewImages.length} image(s) selected
                                                        {selectedFiles.length > 0 && " - New images will be uploaded to Cloudinary"}
                                                    </p>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {previewImages.map((src, index) => (
                                                            <div key={index} className="relative group">
                                                                <Image
                                                                    src={src}
                                                                    alt={`Preview ${index + 1}`}
                                                                    width={100}
                                                                    height={80}
                                                                    className="w-full h-20 object-cover rounded"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() => removeImage(index)}
                                                                    className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <X size={12} />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Tags</label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Add tag"
                                            />
                                            <Button type="button" onClick={addTag} variant="outline">
                                                Add
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.tags.filter(tag => tag.trim()).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center gap-1"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="hover:text-blue-900"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Specifications */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Specifications</label>
                                        <div className="space-y-2 mb-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newSpecKey}
                                                    onChange={(e) => setNewSpecKey(e.target.value)}
                                                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Specification key"
                                                />
                                                <input
                                                    type="text"
                                                    value={newSpecValue}
                                                    onChange={(e) => setNewSpecValue(e.target.value)}
                                                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Specification value"
                                                />
                                                <Button type="button" onClick={addSpecification} variant="outline">
                                                    Add
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            {Object.entries(formData.specifications).map(([key, value]) => (
                                                <div key={key} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                                    <span className="font-medium">{key}:</span>
                                                    <span>{value}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSpecification(key)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Toggles */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium">Active Product</label>
                                            <button
                                                type="button"
                                                onClick={() => handleInputChange("isActive", !formData.isActive)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                                    formData.isActive ? "bg-blue-600" : "bg-gray-200"
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                                        formData.isActive ? "translate-x-6" : "translate-x-1"
                                                    }`}
                                                />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium">Featured Product</label>
                                            <button
                                                type="button"
                                                onClick={() => handleInputChange("isFeatured", !formData.isFeatured)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                                    formData.isFeatured ? "bg-yellow-600" : "bg-gray-200"
                                                }`}
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
                            <div className="flex gap-3 justify-end mt-6 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        // Clean up preview URLs
                                        previewImages.forEach(url => {
                                            if (!formData.images.includes(url)) {
                                                URL.revokeObjectURL(url);
                                            }
                                        });
                                    }}
                                    disabled={formLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={formLoading || imageUploading}
                                    className="bg-[#125BAC] hover:bg-[#0d4793]"
                                >
                                    {formLoading ? "Saving..." : imageUploading ? "Uploading Images..." : editingProduct ? "Update Product" : "Create Product"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}