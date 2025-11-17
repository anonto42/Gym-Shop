import { Schema, model, models } from 'mongoose';
import { IPersonalTraining } from './personal-training.interface';

const PersonalTrainingSchema = new Schema<IPersonalTraining>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    imageUrl: [{
        type: String,
        required: [true, 'At least one image is required'],
    }],
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
        type: Number,
        min: [0, 'Original price cannot be negative'],
    },
    duration: {
        type: String,
        required: [true, 'Duration is required'],
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: [true, 'Difficulty level is required'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
    },
    trainer: {
        type: String,
        required: [true, 'Trainer name is required'],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    videoUrl: {
        type: String,
    },
    includes: [{
        type: String,
    }],
    requirements: [{
        type: String,
    }],
}, {
    timestamps: true,
});

export const PersonalTrainingModel = models.PersonalTraining || model<IPersonalTraining>('PersonalTraining', PersonalTrainingSchema);