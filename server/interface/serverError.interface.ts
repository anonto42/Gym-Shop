import mongoose from "mongoose";

export interface IMongooseError extends Error {
    code?: number;
    errors?: Record<string, mongoose.Error.ValidatorError | mongoose.Error.CastError>;
    keyPattern?: Record<string, unknown>;
    keyValue?: Record<string, unknown>;
}

export type ServerError = IMongooseError | Error | unknown;