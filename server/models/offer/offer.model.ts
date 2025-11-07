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

let OfferModel: IOfferModel;

if (typeof models !== 'undefined' && models.Offer) {
    OfferModel = models.Offer as unknown as IOfferModel;
} else {
    OfferModel = model<IOffer, IOfferModel>("Offer", offerSchema);
}

export { OfferModel };