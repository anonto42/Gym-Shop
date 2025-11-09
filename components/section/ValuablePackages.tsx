"use client";

import React, { useEffect, useState } from "react";
import PackageCart from "../card/PackageCart";
import { motion } from "framer-motion";
import { IPackage } from "@/server/models/package/package.interface";
import { getAllPackagesServerSide } from "@/server/functions/package.fun";
import { toast } from "sonner";

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

const ValuablePackages = () => {
    const [packages, setPackages] = useState<IPackage[]>([]);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(true);
    
    // Load packages on component mount
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

    // Get active packages for display (you can filter by featured if you want)
    const displayPackages = packages
        .filter(pkg => pkg?.isActive) // Only show active packages
        .slice(0, 3); // Show only first 3 packages

    // Show loading until component is mounted and data is loaded
    if (!isMounted || isLoading) {
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
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4 justify-items-center max-w-[1200px]"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="w-full border-2 rounded-2xl p-4 relative shadow-lg bg-white animate-pulse"
                        >
                            {/* Image Skeleton */}
                            <div className="w-full h-32 mb-3 rounded-lg bg-gray-200"></div>
                            
                            {/* Content Skeleton */}
                            <div className="text-center">
                                <div className="h-6 bg-gray-200 rounded mb-2 mx-auto w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-3 mx-auto w-full"></div>
                                
                                {/* Stars Skeleton */}
                                <div className="flex justify-center space-x-1 mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <div key={star} className="h-4 w-4 bg-gray-200 rounded"></div>
                                    ))}
                                </div>
                                
                                <div className="mt-3 space-y-1">
                                    <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
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
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4 justify-items-center max-w-[1200px]"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                {displayPackages.map((pkg, index) => (
                    <PackageCart
                        key={pkg._id?.toString() || `package-${index}`}
                        star={pkg.rating || 5}
                        title={pkg.title || "Package"}
                        description={pkg.description}
                        price={pkg.price || 0}
                        originalPrice={pkg.originalPrice}
                        image={pkg.imageUrl && pkg.imageUrl.length > 0 ? pkg.imageUrl[0] : ""}
                        features={pkg.features || []}
                        category={pkg.category}
                        delay={index * 0.1}
                        isFeatured={pkg.isFeatured || false}
                    />
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