import { Model } from "mongoose";

export interface IOffer {
    _id?: string;
    title: string;
    shortNote: string;
    promoCode: string;
    discount: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
}

export interface IOfferModel extends Model<IOffer> {
    findActiveOffers(): Promise<IOffer[]>;
    validatePromoCode(promoCode: string): Promise<IOffer | null>;
}