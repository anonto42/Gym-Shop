
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createPersonalTraining, updatePersonalTraining, getPersonalTrainingById } from "@/server/functions/personal-training.fun";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2, Trash2, Play } from "lucide-react";
import {
    deleteFromCloudinary,
    extractPublicIdFromUrl,
    uploadTrainingImages,
    uploadTrainingVideo
} from "@/server/helper/cloudinary.helper";

interface PersonalTrainingFormProps {
    trainingId?: string;
    mode: 'create' | 'edit';
}

export default function PersonalTrainingForm({ trainingId, mode }: PersonalTrainingFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        originalPrice: 0,
        duration: '',
        difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
        category: '',
        trainer: '',
        isActive: true,
        isFeatured: false,
        videoUrl: '',
        imageUrl: [] as string[],
        includes: [''],
        requirements: ['']
    });

    useEffect(() => {
        if (mode === 'edit' && trainingId) {
            loadTraining();
        }
    }, [mode, trainingId]);

    const loadTraining = async () => {
        try {
            const response = await getPersonalTrainingById(trainingId!);
            if (!response.isError && response.data) {
                const training = (response.data as { training: any }).training;
                setFormData({
                    title: training.title || '',
                    description: training.description || '',
                    price: training.price || 0,
                    originalPrice: training.originalPrice || 0,
                    duration: training.duration || '',
                    difficulty: training.difficulty || 'beginner',
                    category: training.category || '',
                    trainer: training.trainer || '',
                    isActive: training.isActive ?? true,
                    isFeatured: training.isFeatured ?? false,
                    videoUrl: training.videoUrl || '',
                    imageUrl: Array.isArray(training.imageUrl) ? training.imageUrl : training.imageUrl ? [training.imageUrl] : [],
                    includes: Array.isArray(training.includes) ? training.includes : training.includes ? [training.includes] : [''],
                    requirements: Array.isArray(training.requirements) ? training.requirements : training.requirements ? [training.requirements] : ['']
                });
            }
        } catch (error) {
            console.error("Error loading training:", error);
            toast.error("Failed to load training");
        }
    };

    const handleImageUpload = async (files: FileList) => {
        try {
            setUploading('images');
            const fileArray = Array.from(files);
            const uploadedUrls = await uploadTrainingImages(fileArray);

            setFormData(prev => ({
                ...prev,
                imageUrl: [...prev.imageUrl, ...uploadedUrls]
            }));

            toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
        } catch (error) {
            console.error("Error uploading images:", error);
            toast.error("Failed to upload images");
        } finally {
            setUploading(null);
        }
    };

    const handleVideoUpload = async (file: File) => {
        try {
            setUploading('video');

            // Delete old video if exists
            if (formData.videoUrl) {
                const publicId = await extractPublicIdFromUrl(formData.videoUrl);
                if (publicId) {
                    await deleteFromCloudinary(publicId, 'video');
                }
            }

            const videoUrl = await uploadTrainingVideo(file);
            setFormData(prev => ({
                ...prev,
                videoUrl
            }));

            toast.success("Video uploaded successfully");
        } catch (error) {
            console.error("Error uploading video:", error);
            toast.error("Failed to upload video");
        } finally {
            setUploading(null);
        }
    };

    const removeImage = async (index: number) => {
        const urlToRemove = formData.imageUrl[index];

        // Delete from Cloudinary
        const publicId = await extractPublicIdFromUrl(urlToRemove);
        if (publicId) {
            await deleteFromCloudinary(publicId, 'image');
        }

        setFormData(prev => ({
            ...prev,
            imageUrl: prev.imageUrl.filter((_, i) => i !== index)
        }));

        toast.success("Image removed");
    };

    const removeVideo = async () => {
        if (formData.videoUrl) {
            const publicId = await extractPublicIdFromUrl(formData.videoUrl);
            if (publicId) {
                await deleteFromCloudinary(publicId, 'video');
            }
        }

        setFormData(prev => ({
            ...prev,
            videoUrl: ''
        }));

        toast.success("Video removed");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Filter out empty strings from arrays
            const submitData = {
                ...formData,
                imageUrl: formData.imageUrl.filter(url => url.trim()),
                includes: formData.includes.filter(item => item.trim()),
                requirements: formData.requirements.filter(req => req.trim())
            };

            let response;
            if (mode === 'create') {
                response = await createPersonalTraining(submitData);
            } else {
                response = await updatePersonalTraining(trainingId!, submitData);
            }

            if (!response.isError) {
                toast.success(response.message || `Training ${mode === 'create' ? 'created' : 'updated'} successfully`);
                router.push('/admin/personal-training');
            } else {
                toast.error(response.message || `Failed to ${mode} training`);
            }
        } catch (error) {
            console.error(`Error ${mode}ing training:`, error);
            toast.error(`Failed to ${mode} training`);
        } finally {
            setLoading(false);
        }
    };

    const addArrayItem = (field: 'includes' | 'requirements') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const updateArrayItem = (field: 'includes' | 'requirements', index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const removeArrayItem = (field: 'includes' | 'requirements', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="w-full min-h-screen p-4">
            <div className="w-full bg-white border rounded-3xl overflow-hidden">
                {/* Header */}
                <div className="w-full flex justify-between items-center p-6 border-b">
                    <h1 className="text-2xl font-semibold">
                        {mode === 'create' ? 'Create New Training' : 'Edit Training'}
                    </h1>
                    <Button
                        onClick={() => router.back()}
                        variant="outline"
                    >
                        Back
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Basic Info */}
                        <div className="space-y-6">
                            {/* Basic Information Card */}
                            <div className="bg-white p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                                {/* ... (basic info fields remain the same) ... */}
                            </div>

                            {/* Image Upload Card */}
                            <div className="bg-white p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Training Images</h3>
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                                            className="hidden"
                                            id="image-upload"
                                            disabled={uploading === 'images'}
                                        />
                                        <label htmlFor="image-upload" className={`cursor-pointer ${uploading === 'images' ? 'opacity-50' : ''}`}>
                                            {uploading === 'images' ? (
                                                <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
                                            ) : (
                                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            )}
                                            <p className="text-sm text-gray-600">
                                                {uploading === 'images' ? 'Uploading...' : 'Click to upload images'}
                                            </p>
                                            <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB each</p>
                                        </label>
                                    </div>

                                    {/* Image Preview Grid */}
                                    {formData.imageUrl.length > 0 && (
                                        <div className="grid grid-cols-3 gap-3">
                                            {formData.imageUrl.map((url, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={url}
                                                        alt={`Training image ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Additional Info */}
                        <div className="space-y-6">
                            {/* Training Details Card */}
                            <div className="bg-white p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Training Details</h3>
                                {/* ... (training details fields remain the same) ... */}
                            </div>

                            {/* Video Upload Card */}
                            <div className="bg-white p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Training Video</h3>
                                <div className="space-y-4">
                                    {!formData.videoUrl ? (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={(e) => e.target.files?.[0] && handleVideoUpload(e.target.files[0])}
                                                className="hidden"
                                                id="video-upload"
                                                disabled={uploading === 'video'}
                                            />
                                            <label htmlFor="video-upload" className={`cursor-pointer ${uploading === 'video' ? 'opacity-50' : ''}`}>
                                                {uploading === 'video' ? (
                                                    <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
                                                ) : (
                                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                )}
                                                <p className="text-sm text-gray-600">
                                                    {uploading === 'video' ? 'Uploading...' : 'Click to upload video'}
                                                </p>
                                                <p className="text-xs text-gray-400">MP4, MOV up to 100MB</p>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="relative">
                                                <video
                                                    controls
                                                    className="w-full rounded-lg"
                                                    src={formData.videoUrl}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeVideo}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-sm text-green-600 flex items-center gap-2">
                                                <Play className="w-4 h-4" />
                                                Video uploaded successfully
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Includes & Requirements Card */}
                            <div className="bg-white p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Program Details</h3>
                                {/* ... (includes & requirements fields remain the same) ... */}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end gap-4">
                        <Button
                            type="button"
                            onClick={() => router.back()}
                            variant="outline"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || uploading !== null}
                            className="bg-[#125BAC] hover:bg-[#0d4793] cursor-pointer px-8"
                        >
                            {(loading || uploading) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {loading ? 'Saving...' : uploading ? 'Uploading...' : mode === 'create' ? 'Create Training' : 'Update Training'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}