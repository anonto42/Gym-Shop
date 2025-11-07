import { Model } from "mongoose";

export interface IOffer {
    title: string;
    shortNote: string;
    promoCode: string;
    discount: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
}

export interface IOfferModel extends Model<IOffer> {}