"use client";
import React from 'react';

interface LoaderProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    overlay?: boolean;
}

const Loader: React.FC<LoaderProps> = ({message = 'Loading...', size = 'md', overlay = true
}:LoaderProps ) => {

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    };

    const textSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };

    return (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center cursor-wait ${
            overlay ? 'bg-black/5 bg-opacity-10 backdrop-blur-xs' : ''
        }`}>
            <div className="flex flex-col items-center justify-center space-y-4">
                {/* Spinner */}
                <div className={`${sizeClasses[size]} relative`}>
                    {/* Outer ring */}
                    <div className={`absolute inset-0 rounded-full border-4 border-gray-200`}></div>

                    {/* Spinning ring */}
                    <div className={`absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin`}></div>

                    {/* Inner dot */}
                    <div className="absolute inset-2 rounded-full bg-blue-500 animate-pulse"></div>
                </div>

                {/* Message */}
                {message && (
                    <p className={`${textSizes[size]} text-white font-medium text-center`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Loader;