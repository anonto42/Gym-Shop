import { model, models, Schema } from "mongoose";
import { IOffer, IOfferModel } from "./offer.interface";

const offerSchema = new Schema<IOffer>({
    title: { type: String, required: true },
    shortNote: { type: String, required: true },
    promoCode: { type: String, required: true },
    discount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, required: true },
},{ timestamps: true });

offerSchema.index({ promoCode: 1 });
offerSchema.index({ startDate: 1, endDate: 1 });
offerSchema.index({ isActive: 1 });

offerSchema.statics.findActiveOffers = async function(): Promise<IOffer[]> {
  const now = new Date();
  return this.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).sort({ createdAt: -1 }).exec();
};

offerSchema.statics.validatePromoCode = async function(promoCode: string): Promise<IOffer | null> {
  const now = new Date();
  return this.findOne({
    promoCode: promoCode.toUpperCase(),
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).exec();
};

let OfferModel: IOfferModel;

if (typeof models !== 'undefined' && models.Offer) {
    OfferModel = models.Offer as unknown as IOfferModel;
} else {
    OfferModel = model<IOffer, IOfferModel>("Offer", offerSchema);
}

export { OfferModel };