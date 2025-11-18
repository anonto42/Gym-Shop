import { Document, Model } from "mongoose";

export interface IAboutSection {
    section_key: string;
    title?: string;
    subtitle?: string;
    content?: string;
    image_url?: string;
    stats?: {
        happyMembers?: number;
        satisfiedCustomers?: number;
        [key: string]: unknown;
    };
    features?: Array<{
        text?: string;
        title?: string;
        content?: string;
        icon?: string;
        [key: string]: unknown;
    }>;
    team_members?: Array<unknown>;
    order_index?: number;
    isActive?: boolean;
}

export interface IAboutSectionDocument extends IAboutSection, Document {
    createdAt: Date;
    updatedAt: Date;
}

export interface IAboutSectionModel extends Model<IAboutSectionDocument> {
    findByKey(key: string): Promise<IAboutSectionDocument | null>;
    findAllActive(): Promise<IAboutSectionDocument[]>;
    updateByKey(key: string, data: Partial<IAboutSection>): Promise<IAboutSectionDocument | null>;
}