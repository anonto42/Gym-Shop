"use client";

import React, { useCallback } from "react";
import { Plus, Loader2, Star } from "lucide-react";
import {usePackageManagement} from "@/hooks/usePackageManagement";
import {usePackageForm} from "@/hooks/usePackageForm";
import PackageGrid from "@/components/ui/PackageGrid";
import PackageModal from "@/components/ui/PackageModal";

export default function PackageManagement() {
    const {
        packages,
        loading,
        isMounted,
        loadPackages,
        handleDelete,
        handleToggleFeatured
    } = usePackageManagement();

    const {
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
        removeImage,
        addFeature,
        removeFeature,
        updateFeature,
        closeModal
    } = usePackageForm({ loadPackages });

    const renderStars = useCallback((rating: number) => {
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
    }, []);

    if (!isMounted || loading) {
        return <LoadingState />;
    }

    return (
        <div className="w-full min-h-[88vh] p-4">
            <div className="w-full h-full bg-white border rounded-3xl overflow-hidden">
                <Header
                    packagesCount={packages.length}
                    onAddNew={handleAddNew}
                />

                <PackageGrid
                    packages={packages}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleFeatured={handleToggleFeatured}
                    renderStars={renderStars}
                />

                {isModalOpen && (
                    <PackageModal
                        editingPackage={editingPackage}
                        formData={formData}
                        setFormData={setFormData}
                        previewImages={previewImages}
                        selectedFiles={selectedFiles}
                        imageUploading={imageUploading}
                        formLoading={formLoading}
                        fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
                        onClose={closeModal}
                        onSubmit={handleSubmit}
                        onFileChange={handleFileChange}
                        onImageUpload={handleImageUpload}
                        onRemoveImage={removeImage}
                        onAddFeature={addFeature}
                        onRemoveFeature={removeFeature}
                        onUpdateFeature={updateFeature}
                    />
                )}
            </div>
        </div>
    );
}

// Header Component
const Header = React.memo(({
                               packagesCount,
                               onAddNew
                           }: {
    packagesCount: number;
    onAddNew: () => void;
}) => (
    <div className="w-full flex flex-col sm:flex-row justify-between items-center p-6 border-b">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Package Management</h1>
            <p className="text-gray-600 mt-1">Manage your valuable packages</p>
            <p className="text-sm text-gray-500">Total packages: {packagesCount}</p>
        </div>
        <Button onClick={onAddNew}>
            <Plus size={20} />
            Add New Package
        </Button>
    </div>
));

Header.displayName = 'Header';

// Loading State Component
const LoadingState = React.memo(() => (
    <div className="w-full min-h-[88vh] p-4 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#125BAC]" />
            <p className="text-gray-600">Loading packages...</p>
        </div>
    </div>
));

LoadingState.displayName = 'LoadingState';

// Reusable Button Component
const Button = React.memo(({
                               children,
                               onClick,
                               variant = "primary",
                               ...props
                           }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "danger";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const baseClasses = "cursor-pointer flex items-center gap-2 mt-2 sm:mt-0 transition-colors duration-200 px-4 py-2 rounded-lg font-medium";
    const variants = {
        primary: "bg-[#125BAC] hover:bg-[#0d4793] text-white",
        secondary: "bg-gray-500 hover:bg-gray-600 text-white",
        danger: "bg-red-600 hover:bg-red-700 text-white"
    };

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${props.className || ''}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';