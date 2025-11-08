import { model, Schema, models } from "mongoose";
import { IBannerMessage, IBannerMessageModel } from "./banner.interface";

const bannerMessageSchema = new Schema<IBannerMessage, IBannerMessageModel>(
  {
    text: {
      type: String,
      required: [true, "Message text is required"],
      trim: true,
      maxlength: [100, "Message cannot exceed 100 characters"]
    },
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    },
    icon: {
      type: String,
      default: "🔹"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

let BannerMessageModel: IBannerMessageModel;

if (typeof models !== 'undefined' && models.BannerMessage) {
    BannerMessageModel = models.BannerMessage as unknown as IBannerMessageModel;
} else {
    BannerMessageModel = model<IBannerMessage, IBannerMessageModel>("BannerMessage", bannerMessageSchema);
}

export { BannerMessageModel };