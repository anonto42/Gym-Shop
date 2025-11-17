"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {getAllTrainingProgramsServerSide} from "@/server/functions/training.fun";
import {getAllVideosServerSide} from "@/server/functions/video.fun";

interface TrainingProgram {
    _id: string;
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    duration: string;
    imageUrl: string[];
    videoUrl?: string;
    features: string[];
    category: string;
    isActive: boolean;
    isFeatured: boolean;
    rating: number;
}

interface Video {
    _id: string;
    url: string;
    title?: string;
    duration?: number;
    format?: string;
}

function PersonalTrainingPage() {
    const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);
    const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            // Load training programs using server action
            const programsResponse = await getAllTrainingProgramsServerSide();
            if (!programsResponse.isError && programsResponse.data) {// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
                setTrainingPrograms(programsResponse.data.programs as TrainingProgram[]);
            } else {
                throw new Error(programsResponse.message || 'Failed to load programs');
            }

            // Load featured videos using server action
            const videosResponse = await getAllVideosServerSide();
            if (!videosResponse.isError && videosResponse.data) {// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
                const videos = videosResponse.data.videos as Video[];
                setFeaturedVideos(videos.slice(0, 1)); // Get the latest video for hero section
            }

            console.log("Video Response :-> ", videosResponse)

        } catch (err) {
            console.error('Error loading data:', err);
            setError('Failed to load training programs');
        } finally {
            setLoading(false);
        }
    };

    const getFeaturedVideo = () => {
        return featuredVideos.length > 0 ? featuredVideos[0] : null;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-white flex items-center justify-center">
                <div className="text-[#F27D31] text-xl">Loading training programs...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen bg-white flex items-center justify-center">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

    const featuredVideo = getFeaturedVideo();

    return (
        <div className="w-full min-h-screen bg-white text-[#242222]">
            {/* Hero / Live Training Section */}
            <section className="w-full flex flex-col items-center justify-center text-center py-12 px-4">
                <motion.h1
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl font-bold text-[#F27D31] mb-6"
                >
                    Our Daily Training <span className="text-[#000000]">on Live</span>
                </motion.h1>

                {featuredVideo ? (
                    <video src={featuredVideo.url} autoPlay loop controls className={"rounded-sm w-full max-w-[1400px] md:h-[500px] shadow-md border border-gray-200"}/>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="rounded-sm w-full max-w-[1400px] md:h-[500px] shadow-md border border-gray-200 bg-gray-100 flex items-center justify-center"
                    >
                        <p className="text-gray-500 text-lg">No featured video available</p>
                    </motion.div>
                )}
            </section>

            {/* Personal Training Programs */}
            <section className="py-16 px-6 md:px-12 lg:px-20">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold text-center text-[#F27D31] mb-12"
                >
                    <span className="text-[#000000]">Our Personal </span>
                    Training Programs
                </motion.h1>

                {trainingPrograms.length === 0 ? (
                    <div className="text-center text-gray-500 text-lg py-12">
                        No training programs available yet.
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center items-center gap-10">
                        {trainingPrograms.map((program, i) => (
                            <motion.div
                                key={program._id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.1,
                                    delay: i * 0.1,
                                    ease: "easeOut",
                                }}
                                className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-lg transition w-full max-w-[420px] h-[420px] flex flex-col items-center relative overflow-hidden"
                            >
                                <div className="relative w-full h-full">
                                    {program.imageUrl.length > 0 ? (
                                        <Image
                                            src={program.imageUrl[0]}
                                            alt={program.title}
                                            fill
                                            className="rounded-sm object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500">No Image</span>
                                        </div>
                                    )}

                                    {/* Discount Badge */}
                                    {program.originalPrice && program.originalPrice > program.price && (
                                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            Save {Math.round(((program.originalPrice - program.price) / program.originalPrice) * 100)}%
                                        </div>
                                    )}

                                    {/* Featured Badge */}
                                    {program.isFeatured && (
                                        <div className="absolute top-4 right-4 bg-[#F27D31] text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            Featured
                                        </div>
                                    )}
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                    <div className="flex justify-between items-center text-white">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                                                {program.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-bold text-[#F27D31]">
                                                    {formatPrice(program.price)}
                                                </span>
                                                {program.originalPrice && program.originalPrice > program.price && (
                                                    <span className="line-through text-gray-300">
                                                        {formatPrice(program.originalPrice)}
                                                    </span>
                                                )}
                                                <span className="text-gray-300">•</span>
                                                <span className="text-gray-300">{program.duration}</span>
                                            </div>
                                        </div>
                                        <button className="bg-[#F27D31] text-white font-semibold py-2 px-4 text-sm rounded-full hover:bg-[#e36e20] transition cursor-pointer whitespace-nowrap ml-4">
                                            Buy Package
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default PersonalTrainingPage;