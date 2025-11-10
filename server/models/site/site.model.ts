import { model, models, Schema } from "mongoose";
import { ISite, ISiteModel } from "./site.interface";

const siteSchema = new Schema<ISite>({
    hero: {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        imageUrl: { type: String, default: "" },
    },
    privacyAndPolicy: { type: String, default: "" },
},{timestamps:true});

let SiteModle: ISiteModel;

if (typeof models !== 'undefined' && models.Site) {
    SiteModle = models.Site as unknown as ISiteModel;
} else {
    SiteModle = model<ISite, ISiteModel>("Site", siteSchema);
}

export { SiteModle };