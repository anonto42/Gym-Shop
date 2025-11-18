import { model, models, Schema } from "mongoose";
import { ITeamMember, ITeamMemberModel } from "./team-member.interface";

const teamMemberSchema = new Schema<ITeamMember>({
    name: { type: String, required: true },
    role: { type: String },
    bio: { type: String },
    image_url: { type: String },
    order_index: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    social_links: {
        facebook: { type: String },
        twitter: { type: String },
        instagram: { type: String },
        linkedin: { type: String }
    }
}, { timestamps: true });

// Indexes
teamMemberSchema.index({ isActive: 1 });
teamMemberSchema.index({ order_index: 1 });
teamMemberSchema.index({ role: 1 });

// Static methods
teamMemberSchema.statics.findAllActive = async function() {
    return this.find({ isActive: true }).sort({ order_index: 1 }).exec();
};

teamMemberSchema.statics.findByRole = async function(role: string) {
    return this.find({ role, isActive: true }).sort({ order_index: 1 }).exec();
};

let TeamMemberModel: ITeamMemberModel;

if (typeof models !== 'undefined' && models.TeamMember) {
    TeamMemberModel = models.TeamMember as unknown as ITeamMemberModel;
} else {
    TeamMemberModel = model<ITeamMember, ITeamMemberModel>("TeamMember", teamMemberSchema);
}

export { TeamMemberModel };