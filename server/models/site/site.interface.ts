import { Model } from "mongoose";


export interface ISite {
    hero: {
        title: string;
        description: string;
        imageUrl: string;
    },
    privacyAndPolicy: string
}

export interface ISiteModel extends Model<ISite>{
    findByOne(id: string): ISite;
}