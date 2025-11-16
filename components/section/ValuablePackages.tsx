"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IPackage } from "@/server/models/package/package.interface";
import { getAllPackagesServerSide } from "@/server/functions/package.fun";
import { toast } from "sonner";
import { convertToPlainObject } from "@/lib/packageUtils";
import PackageDisplayCard from "@/components/card/PackageDisplayCard";

const ValuablePackages = () => {
    const [packages, setPackages] = useState<IPackage[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initialize = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getAllPackagesServerSide({
                    filter: { isActive: true, isFeatured: true },
                    page: 1,
                    limit: 6
                });

                console.log('response --', response);

                if (!response.isError && response.data) {
                    const packageData = (response.data as { packages: IPackage[] }).packages.map( pkg => ({ ...pkg, _id: pkg._id.toString() }));

                    // Convert all MongoDB objects to plain objects
                    const plainPackages = packageData.map(pkg => {
                        const plainPkg = convertToPlainObject(pkg) as Record<string, unknown>

                        // Ensure imageUrl is always an array of strings
                        if (plainPkg.imageUrl && !Array.isArray(plainPkg.imageUrl)) {
                            plainPkg.imageUrl = [plainPkg.imageUrl as string];
                        } else if (!plainPkg.imageUrl) {
                            plainPkg.imageUrl = [];
                        }

                        // Ensure all dates are strings
                        if (plainPkg.createdAt && plainPkg.createdAt instanceof Date) {
                            plainPkg.createdAt = plainPkg.createdAt.toISOString();
                        }
                        if (plainPkg.updatedAt && plainPkg.updatedAt instanceof Date) {
                            plainPkg.updatedAt = plainPkg.updatedAt.toISOString();
                        }

                        return plainPkg;
                    });

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-expect-error
                    setPackages(plainPackages);
                } else {
                    const errorMsg = "Failed to load packages";
                    setError(errorMsg);
                    toast.error(errorMsg);
                }
            } catch (error) {
                console.error("Error loading packages:", error);
                const errorMsg = "Failed to load packages";
                setError(errorMsg);
                toast.error(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, []);

    // Filter active packages and take first 3
    const displayPackages = packages.slice(0, 3);

    if (isLoading) {
        return (
            <section className="w-full bg-white py-20 px-6 md:px-12 lg:px-20 flex flex-col items-center gap-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#F27D31] leading-tight drop-shadow-lg">
                        Our Valuable <span className="text-black">Packages</span>
                    </h2>
                    <p className="text-gray-600 mt-4 text-sm md:text-base">
                        Experience year-round comfort with our Comfort Zone packages — designed
                        to keep your home warm in winter, cool in summer, and stylish every day.
                    </p>
                </motion.div>

                {/* Loading Skeleton */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-6 justify-items-center max-w-[1200px]"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="w-full max-w-sm border-2 rounded-2xl p-4 relative shadow-lg bg-white animate-pulse"
                        >
                            <div className="w-full h-32 mb-4 rounded-xl bg-gray-200"></div>
                            <div className="text-center">
                                <div className="h-6 bg-gray-200 rounded mb-3 mx-auto w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-3 mx-auto w-full"></div>
                                <div className="flex justify-center space-x-1 mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <div key={star} className="h-5 w-5 bg-gray-200 rounded-full"></div>
                                    ))}
                                </div>
                                <div className="mt-4 space-y-2">
                                    <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                                    <div className="h-3 bg-gray-200 rounded w-4/5 mx-auto"></div>
                                    <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="w-full bg-white py-20 px-6 md:px-12 lg:px-20 flex flex-col items-center gap-12">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600">Error Loading Packages</h2>
                    <p className="text-gray-600 mt-2">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full bg-white py-20 px-6 md:px-12 lg:px-20 flex flex-col items-center gap-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center max-w-2xl"
            >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#F27D31] leading-tight drop-shadow-lg">
                    Our Valuable <span className="text-black">Packages</span>
                </h2>
                <p className="text-gray-600 mt-4 text-sm md:text-base">
                    Experience year-round comfort with our Comfort Zone packages — designed
                    to keep your home warm in winter, cool in summer, and stylish every day.
                </p>
            </motion.div>

            {/* Cards Grid */}
            {displayPackages.length > 0 ? (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-6 justify-items-center max-w-[1200px]"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.2
                            }
                        }
                    }}
                >
                    {displayPackages.map((pkg, index) => (
                        <motion.div
                            key={pkg._id?.toString() || `package-${index}`}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="w-full max-w-sm"
                        >
                            <PackageDisplayCard pkg={pkg} />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center py-12"
                >
                    <p className="text-gray-500 text-lg">No packages available at the moment.</p>
                    <p className="text-gray-400 mt-2">Check back soon for our latest offers!</p>
                </motion.div>
            )}
        </section>
    );
};

export default ValuablePackages;