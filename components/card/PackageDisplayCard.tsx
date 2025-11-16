"use client";

import React from "react";
import { IPackage } from "@/server/models/package/package.interface";
import { Star } from "lucide-react";
import ImageWithSkeleton from "@/components/ui/ImageWIthSkeleton";

interface PackageDisplayCardProps {
    pkg: IPackage;
}

const PackageDisplayCard = React.memo(({ pkg }: PackageDisplayCardProps) => {
    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    size={16}
                    className={i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                />
            );
        }
        return (
            <div className="flex justify-center items-center space-x-1">
                {stars}
                <span className="text-sm text-gray-600 ml-1">({rating})</span>
            </div>
        );
    };

    // Ensure imageUrl is always treated as array and handle null/undefined
    const imageUrls = Array.isArray(pkg.imageUrl) ? pkg.imageUrl :
        pkg.imageUrl ? [pkg.imageUrl as string] : [];

    return (
        <div className="w-full border-2 rounded-2xl p-4 relative shadow-lg hover:shadow-xl transition-all duration-300 bg-white group">
            {/* Featured Badge */}
            {pkg.isFeatured && (
                <div className="absolute -top-2 -left-2 bg-[#F27D31] text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                    Featured
                </div>
            )}

            {/* Inactive Badge */}
            {!pkg.isActive && (
                <div className="absolute -top-2 -left-2 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                    Inactive
                </div>
            )}

            {/* Package Images */}
            {imageUrls.length > 0 && imageUrls[0] && (
                <div className="w-full h-32 mb-3 rounded-lg overflow-hidden relative">
                    <ImageWithSkeleton
                        src={imageUrls[0]}
                        alt={pkg.title || "Package"}
                        className="w-full h-full object-cover"
                        width={400}
                        height={128}
                    />
                    {imageUrls.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                            +{imageUrls.length - 1} more
                        </div>
                    )}
                </div>
            )}

            {/* Package Content */}
            <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                    {pkg.title || "Untitled Package"}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {pkg.description || "No description available."}
                </p>

                {renderStars(pkg.rating || 0)}

                <div className="mt-3 space-y-1">
                    <p className="text-2xl font-bold text-[#125BAC]">
                        ${pkg.price || 0}
                    </p>
                    {pkg.originalPrice && pkg.originalPrice > (pkg.price || 0) && (
                        <p className="text-sm text-gray-500 line-through">
                            ${pkg.originalPrice}
                        </p>
                    )}
                    <p className="text-xs text-gray-400 capitalize">
                        {pkg.category || "Uncategorized"}
                    </p>
                </div>

                {/* Features */}
                {pkg.features && pkg.features.length > 0 && (
                    <div className="mt-3 text-left">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Features:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                            {pkg.features.slice(0, 3).map((feature, index) => (
                                <li key={index} className="line-clamp-1">• {feature}</li>
                            ))}
                            {pkg.features.length > 3 && (
                                <li className="text-gray-400">
                                    +{pkg.features.length - 3} more
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
});

PackageDisplayCard.displayName = 'PackageDisplayCard';

export default PackageDisplayCard;