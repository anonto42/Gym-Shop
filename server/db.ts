import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in .env.local');
}

// Global cache for Mongoose connection
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Use global to persist connection across hot reloads in development
declare global {
    var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || {
    conn: null,
    promise: null,
};

if (!global.mongoose) {
    global.mongoose = cached;
}

export async function connectToDB() {
    // If we have a cached connection, return it
    if (cached.conn) {
        return cached.conn;
    }

    // If no promise exists, create a new connection
    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Disable mongoose buffering
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts);
    }

    try {
        // Wait for the connection promise to resolve
        cached.conn = await cached.promise;
    } catch (error) {
        // If connection fails, reset the promise
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}