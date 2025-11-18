import { Document, Model } from "mongoose";

export interface ITeamMember {
    name: string;
    role?: string;
    bio?: string;
    image_url?: string;
    order_index?: number;
    isActive?: boolean;
    social_links?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
        [key: string]: string | undefined;
    };
}

export interface ITeamMemberDocument extends ITeamMember, Document {
    createdAt: Date;
    updatedAt: Date;
}

export interface ITeamMemberModel extends Model<ITeamMemberDocument> {
    findAllActive(): Promise<ITeamMemberDocument[]>;
    findByRole(role: string): Promise<ITeamMemberDocument[]>;
}