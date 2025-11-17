import {Schema, model, models} from "mongoose";
import {ITrainingProgram, ITrainingProgramModel} from "@/server/models/training-program/training-program.interface";

const trainingProgramSchema = new Schema<ITrainingProgram>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"]
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            maxlength: [2000, "Description cannot exceed 2000 characters"]
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"]
        },
        originalPrice: {
            type: Number,
            min: [0, "Original price cannot be negative"],
            // validate: {
            //     validator: function(this: ITrainingProgram, value: number) {
            //         return !value || value >= this.price;
            //     },
            //     message: "Original price must be greater than or equal to current price"
            // }
        },
        duration: {
            type: String,
            required: [true, "Duration is required"],
            trim: true
        },
        imageUrl: [{
            type: String,
            required: [true, "At least one image URL is required"],
            validate: {
                validator: function(urls: string[]) {
                    return urls.length > 0;
                },
                message: "At least one image URL is required"
            }
        }],
        // videoUrl field completely removed
        features: [{
            type: String,
            trim: true
        }],
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isFeatured: {
            type: Boolean,
            default: false
        },
        rating: {
            type: Number,
            min: [0, "Rating cannot be less than 0"],
            max: [5, "Rating cannot exceed 5"],
            default: 0
        }
    },
    {
        timestamps: true
    }
);

// Static methods implementation
trainingProgramSchema.statics.findActivePrograms = function(): Promise<ITrainingProgram[]> {
    return this.find({ isActive: true }).sort({ createdAt: -1 }).exec();
};

trainingProgramSchema.statics.findFeaturedPrograms = function(): Promise<ITrainingProgram[]> {
    return this.find({
        isActive: true,
        isFeatured: true
    }).sort({ createdAt: -1 }).exec();
};

trainingProgramSchema.statics.findByCategory = function(category: string): Promise<ITrainingProgram[]> {
    return this.find({
        category: new RegExp(category, 'i'),
        isActive: true
    }).sort({ createdAt: -1 }).exec();
};

// Indexes for better query performance
trainingProgramSchema.index({ category: 1, isActive: 1 });
trainingProgramSchema.index({ isActive: 1, isFeatured: 1 });
trainingProgramSchema.index({ createdAt: -1 });

// Virtual for discount percentage
trainingProgramSchema.virtual('discountPercentage').get(function(this: ITrainingProgram) {
    if (!this.originalPrice || this.originalPrice <= this.price) {
        return 0;
    }
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

// Ensure virtual fields are serialized
trainingProgramSchema.set('toJSON', { virtuals: true });
trainingProgramSchema.set('toObject', { virtuals: true });

// Pre-save middleware to handle data validation
trainingProgramSchema.pre('save', function(next) {
    // Ensure originalPrice is not less than price
    if (this.originalPrice && this.originalPrice < this.price) {
        this.originalPrice = this.price;
    }
    next();
});

let TrainingProgram: ITrainingProgramModel;

if (typeof models !== 'undefined' && models.TrainingProgram) {
    TrainingProgram = models.TrainingProgram as unknown as ITrainingProgramModel;
} else {
    TrainingProgram = model<ITrainingProgram, ITrainingProgramModel>("TrainingProgram", trainingProgramSchema);
}

export { TrainingProgram };