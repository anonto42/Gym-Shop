import { Model } from "mongoose";


export interface ISite {
    hero: {
        title: string;
        description: string;
        imageUrl: string;
    },
}

export interface ISiteModel extends Model<ISite>{
    
}