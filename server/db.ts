import mongoose, { ConnectOptions } from 'mongoose';

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

const mongooseCache: MongooseCache = {
    conn: null,
    promise: null,
};

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local.local'
    );
}

export async function connectToDB(): Promise<typeof mongoose> {
    // If we have a cached connection, return it
    if (mongooseCache.conn) {
        return mongooseCache.conn;
    }

    // If we have a pending connection promise, wait for it
    if (mongooseCache.promise) {
        mongooseCache.conn = await mongooseCache.promise;
        return mongooseCache.conn;
    }

    // Create new connection promise
    const opts: ConnectOptions = {
        bufferCommands: false,
    };

    mongooseCache.promise = mongoose.connect(MONGODB_URI, opts);

    try {
        mongooseCache.conn = await mongooseCache.promise;
    } catch (e) {
        // Reset promise on error to allow retries
        mongooseCache.promise = null;
        throw e;
    }

    return mongooseCache.conn;
}

export default connectToDB;