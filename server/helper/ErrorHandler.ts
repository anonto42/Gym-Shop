import mongoose from 'mongoose';
import { SendResponse } from './sendResponse.helper';
import { IResponse } from '../interface/response.interface';

export function handleServerError(error: any): IResponse {
    console.error("Server error:", error);

    // Handle Mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(error.errors).map((err: any) => err.message);
        return SendResponse({ 
            isError: true, 
            status: 400, 
            message: errors.join(', ') 
        });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return SendResponse({ 
            isError: true, 
            status: 409, 
            message: `${field} already exists` 
        });
    }

    // Handle Cast errors (invalid ObjectId)
    if (error instanceof mongoose.Error.CastError) {
        return SendResponse({ 
            isError: true, 
            status: 400, 
            message: 'Invalid ID format' 
        });
    }

    // Handle other known errors
    if (error.status && error.message) {
        return SendResponse({ 
            isError: true, 
            status: error.status, 
            message: error.message 
        });
    }

    // Generic server error
    return SendResponse({ 
        isError: true, 
        status: 500, 
        message: 'Internal server error' 
    });
}