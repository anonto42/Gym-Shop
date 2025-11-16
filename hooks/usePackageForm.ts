import React, { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { IPackage } from "@/server/models/package/package.interface";
import {
    createPackageServerSide,
    updatePackageServerSide
} from "@/server/functions/package.fun";
import { uploadMultipleToCloudinary } from "@/server/helper/cloudinary.helper";
import {convertToPlainObject, hasToJSON} from "@/lib/packageUtils";

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

interface UsePackageFormProps {
    loadPackages: () => Promise<void>;
}

export const usePackageForm = ({ loadPackages }: UsePackageFormProps) => {
    const [formData, setFormData] = useState<FormData>(getInitialFormData());
    const [editingPackage, setEditingPackage] = useState<IPackage | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddNew = useCallback(() => {
        setEditingPackage(null);
        setFormData(getInitialFormData());
        clearImageSelection();
        setIsModalOpen(true);
    }, []);

    const handleEdit = useCallback((pkg: IPackage) => {
        const plainPackage = hasToJSON(pkg)
            ? convertToPlainObject(pkg.toJSON())
            : convertToPlainObject(pkg);

        const imageUrlArray = Array.isArray(((plainPackage as IPackage) as IPackage).imageUrl)
            ? (plainPackage as IPackage).imageUrl.filter((url: unknown): url is string => typeof url === 'string')
            : ((plainPackage as IPackage).imageUrl && typeof (plainPackage as IPackage).imageUrl === 'string' ? (plainPackage as IPackage).imageUrl : []);

        setEditingPackage((plainPackage as IPackage) as IPackage);
        setFormData({
            title: (plainPackage as IPackage).title || "",
            description: (plainPackage as IPackage).description || "",
            price: (plainPackage as IPackage).price?.toString() || "0",
            originalPrice: (plainPackage as IPackage).originalPrice?.toString() || "",
            features: Array.isArray((plainPackage as IPackage).features) && (plainPackage as IPackage).features.length > 0 ? (plainPackage as IPackage).features : [""],
            imageUrl: imageUrlArray,
            rating: (plainPackage as IPackage).rating || 5,
            isActive: (plainPackage as IPackage).isActive ?? true,
            isFeatured: (plainPackage as IPackage).isFeatured ?? false,
            category: (plainPackage as IPackage).category || ""
        });
        clearImageSelection();
        setIsModalOpen(true);
    }, []);

    // ... rest of your code remains the same
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const packageData = normalizeFormData(formData);

            let response;
            if (editingPackage) {
                response = await updatePackageServerSide(editingPackage._id.toString(), packageData);
                if (!response.isError) {
                    // Update local state for immediate feedback
                    // loadPackages will be called by parent component if needed
                }
            } else {
                response = await createPackageServerSide(packageData);
                if (!response.isError) {
                    await loadPackages();
                }
            }

            if (!response.isError) {
                closeModal();
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
    }, [formData, editingPackage, loadPackages]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newFiles = Array.from(files);

        // Validate files
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
        const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...newPreviewUrls]);
        toast.success(`${newFiles.length} image(s) selected`);
    }, []);

    const handleImageUpload = useCallback(async () => {
        if (selectedFiles.length === 0) {
            toast.error("Please select images first");
            return;
        }

        try {
            setImageUploading(true);
            const uploadedUrls = await uploadMultipleToCloudinary(selectedFiles);

            if (uploadedUrls?.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    imageUrl: [...prev.imageUrl, ...uploadedUrls]
                }));
                toast.success(`Successfully uploaded ${uploadedUrls.length} image(s)`);
                clearImageSelection();
            } else {
                toast.error("Failed to upload images");
            }
        } catch (error) {
            console.error("Error uploading images:", error);
            toast.error("Failed to upload images");
        } finally {
            setImageUploading(false);
        }
    }, [selectedFiles]);

    const clearImageSelection = useCallback(() => {
        previewImages.forEach(url => URL.revokeObjectURL(url));
        setPreviewImages([]);
        setSelectedFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [previewImages]);

    const removeImage = useCallback((index: number) => {
        setFormData(prev => ({
            ...prev,
            imageUrl: prev.imageUrl.filter((_, i) => i !== index)
        }));
    }, []);

    const addFeature = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, ""]
        }));
    }, []);

    const removeFeature = useCallback((index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    }, []);

    const updateFeature = useCallback((index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.map((feature, i) => i === index ? value : feature)
        }));
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        clearImageSelection();
    }, [clearImageSelection]);

    return {
        formData,
        setFormData,
        editingPackage,
        isModalOpen,
        formLoading,
        imageUploading,
        previewImages,
        selectedFiles,
        fileInputRef,
        handleAddNew,
        handleEdit,
        handleSubmit,
        handleFileChange,
        handleImageUpload,
        clearImageSelection,
        removeImage,
        addFeature,
        removeFeature,
        updateFeature,
        closeModal
    };
};

const getInitialFormData = (): FormData => ({
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

const normalizeFormData = (formData: FormData) => ({
    title: formData.title,
    description: formData.description,
    price: parseFloat(formData.price) || 0,
    originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
    features: formData.features.filter(feature => feature.trim() !== ""),
    imageUrl: formData.imageUrl,
    rating: formData.rating,
    isActive: formData.isActive,
    isFeatured: formData.isFeatured,
    category: formData.category
});