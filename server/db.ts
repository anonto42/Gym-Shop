"use server";
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in .env.local');
}

async function connectToDB() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    return await mongoose.connect(MONGODB_URI);
}

export default connectToDB;