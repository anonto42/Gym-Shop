import { useState } from "react";

interface ImageWithSkeletonProps {
    src: string;
    alt?: string;
    className?: string;
    containerClassName?: string;
    fallbackSrc?: string;
}

export default function ImageWithSkeleton({
                                              src,
                                              alt = "",
                                              className = "",
                                              containerClassName = "",
                                              fallbackSrc = "https://via.placeholder.com/300x200?text=No+Image",
                                          }: ImageWithSkeletonProps) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div
            className={`relative overflow-hidden rounded-lg flex items-center justify-center ${containerClassName}`}
        >
            {/* Skeleton shimmer while loading */}
            {!loaded && !error && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
            )}

            {/* Image */}
            <img
                src={error ? fallbackSrc : src}
                alt={alt}
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
                className={`transition-opacity duration-300 ${
                    loaded ? "opacity-100" : "opacity-0"
                } w-full h-full object-cover ${className}`}
            />
        </div>
    );
}
