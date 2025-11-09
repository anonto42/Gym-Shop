import { model, models, Schema } from "mongoose";
import { IPackage, IPackageModel } from "./package.interface";

const packageSchema = new Schema<IPackage>({
    title: { 
        type: String, 
        required: [true, "Package title is required"],
        trim: true,
        maxlength: [100, "Title cannot exceed 100 characters"]
    },
    description: { 
        type: String, 
        required: [true, "Package description is required"],
        trim: true,
        maxlength: [500, "Description cannot exceed 500 characters"]
    },
    price: { 
        type: Number, 
        required: [true, "Package price is required"],
        min: [0, "Price cannot be negative"]
    },
    originalPrice: { 
        type: Number,
        min: [0, "Original price cannot be negative"]
    },
    features: [{ 
        type: String,
        trim: true
    }],
    imageUrl: { 
        type: [String],
        trim: true
    },
    rating: { 
        type: Number, 
        default: 5,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot exceed 5"]
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    isFeatured: { 
        type: Boolean, 
        default: false 
    },
    category: { 
        type: String, 
        required: [true, "Package category is required"],
        trim: true
    }
}, { 
    timestamps: true 
});


// Indexes
packageSchema.index({ category: 1, isActive: 1 });
packageSchema.index({ isFeatured: 1, isActive: 1 });
packageSchema.index({ price: 1 });
packageSchema.index({ createdAt: -1 });

// Static methods
packageSchema.statics.findActivePackages = async function(): Promise<IPackage[]> {
    return this.find({ isActive: true })
        .sort({ createdAt: -1 })
        .exec();
};

packageSchema.statics.findFeaturedPackages = async function(): Promise<IPackage[]> {
    return this.find({ 
        isActive: true, 
        isFeatured: true 
    })
    .sort({ createdAt: -1 })
    .exec();
};

packageSchema.statics.findByCategory = async function(category: string): Promise<IPackage[]> {
    if (category === "all") {
        return this.find({ isActive: true }).sort({ createdAt: -1 }).exec();
    }
    return this.find({ 
        category: { $regex: category, $options: 'i' }, 
        isActive: true 
    })
    .sort({ createdAt: -1 })
    .exec();
};

let PackageModel: IPackageModel;

if (typeof models !== 'undefined' && models.Package) {
    PackageModel = models.Package as unknown as IPackageModel;
} else {
    PackageModel = model<IPackage, IPackageModel>("Package", packageSchema);
}

export { PackageModel };