import mongoose from 'mongoose';
import { IPackageResponse } from '../interface/package.interface';

// Define interface for MongoDB duplicate key error
interface MongoDuplicateKeyError {
    code: number;
    keyValue: Record<string, unknown>;
    keyPattern: Record<string, unknown>;
}

// Type guard for MongoDB duplicate key error
function isMongoDuplicateKeyError(error: unknown): error is MongoDuplicateKeyError {
    if (typeof error !== 'object' || error === null) return false;
    
    const err = error as Record<string, unknown>;
    return (
        err.code === 11000 &&
        typeof err.keyValue === 'object' &&
        err.keyValue !== null &&
        typeof err.keyPattern === 'object' &&
        err.keyPattern !== null
    );
}

export function handleServerError(error: unknown): IPackageResponse {
    console.error("Server error:", error);

    // Handle Mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(error.errors).map((err: mongoose.Error.ValidatorError | mongoose.Error.CastError) => err.message);
        return {
            isError: true, 
            status: 400, 
            message: errors.join(', ')
        };
    }

    // Handle duplicate key errors using type guard
    if (isMongoDuplicateKeyError(error)) {
        const field = Object.keys(error.keyValue)[0];
        return {
            isError: true, 
            status: 409, 
            message: `${field} already exists`
        };
    }

    // Handle Cast errors (invalid ObjectId)
    if (error instanceof mongoose.Error.CastError) {
        return {
            isError: true, 
            status: 400, 
            message: 'Invalid ID format'
        };
    }

    // Handle other known errors with status and message
    if (typeof error === 'object' && error !== null && 'status' in error && 'message' in error) {
        const err = error as { status: unknown; message: unknown };
        if (typeof err.status === 'number' && typeof err.message === 'string') {
            return {
                isError: true, 
                status: err.status, 
                message: err.message
            };
        }
    }

    // Handle generic Error objects
    if (error instanceof Error) {
        return {
            isError: true, 
            status: 500, 
            message: error.message
        };
    }

    // Generic server error for unknown error types
    return {
        isError: true, 
        status: 500, 
        message: 'Internal server error'
    };
}