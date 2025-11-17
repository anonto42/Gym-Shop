import { Schema, model, models } from 'mongoose';
import { IFeaturedVideo } from './personal-training.interface';

const FeaturedVideoSchema = new Schema<IFeaturedVideo>({
    videoUrl: {
        type: String,
        required: [true, 'Video URL is required'],
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    trainingId: {
        type: String,
    },
}, {
    timestamps: true,
});

export const FeaturedVideoModel = models.FeaturedVideo || model<IFeaturedVideo>('FeaturedVideo', FeaturedVideoSchema);