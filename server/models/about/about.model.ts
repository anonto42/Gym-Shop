import { model, models, Schema } from "mongoose";
import { IAboutSection, IAboutSectionModel } from "./about.interface";

const aboutSectionSchema = new Schema<IAboutSection>({
    section_key: { type: String, required: true, unique: true },
    title: { type: String },
    subtitle: { type: String },
    content: { type: String },
    image_url: { type: String },
    stats: { type: Schema.Types.Mixed, default: {} },
    features: { type: [Schema.Types.Mixed], default: [] },
    team_members: { type: [Schema.Types.Mixed], default: [] },
    order_index: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Indexes
aboutSectionSchema.index({ section_key: 1 });
aboutSectionSchema.index({ isActive: 1 });
aboutSectionSchema.index({ order_index: 1 });

// Static methods
aboutSectionSchema.statics.findByKey = async function(key: string) {
    return this.findOne({ section_key: key, isActive: true }).exec();
};

aboutSectionSchema.statics.findAllActive = async function() {
    return this.find({ isActive: true }).sort({ order_index: 1 }).exec();
};

aboutSectionSchema.statics.updateByKey = async function(key: string, data: Partial<IAboutSection>) {
    return this.findOneAndUpdate(
        { section_key: key },
        { $set: data },
        { new: true, upsert: true }
    ).exec();
};

let AboutSectionModel: IAboutSectionModel;

if (typeof models !== 'undefined' && models.AboutSection) {
    AboutSectionModel = models.AboutSection as unknown as IAboutSectionModel;
} else {
    AboutSectionModel = model<IAboutSection, IAboutSectionModel>("AboutSection", aboutSectionSchema);
}

export { AboutSectionModel };