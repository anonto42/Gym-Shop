"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface ImageWithSkeletonProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
}

const ImageWithSkeleton = ({
                               src,
                               alt,
                               className = "",
                               width = 400,
                               height = 128
                           }: ImageWithSkeletonProps) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className={`relative ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
            )}
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={`rounded-lg transition-opacity duration-300 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                } ${className}`}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
            />
        </div>
    );
};

export default ImageWithSkeleton;