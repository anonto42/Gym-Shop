'use server';

import { revalidatePath } from 'next/cache';
import {connectToDB as connectToDatabase } from "@/server/db";
import {AboutSectionModel} from "@/server/models/about/about.model";
import {TeamMemberModel} from "@/server/models/about/team-member.model";
import {deleteFromCloudinary, extractPublicIdFromUrl, uploadImageToCloudinary} from "@/server/helper/cloudinary.helper";

export interface AboutSectionData {
    id?: string;
    section_key: string;
    title?: string;
    subtitle?: string;
    content?: string;
    image_url?: string;
    stats?: unknown;
    features?: Array<unknown>;
    team_members?: Array<unknown>;
    order_index?: number;
    isActive?: boolean;
}

export interface TeamMemberData {
    id?: string;
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
    };
}

// Get all about sections
export async function getAllAboutSectionsServerSide(): Promise<{
    isError: boolean;
    message?: string;
    data?: {
        sections: AboutSectionData[];
    };
}> {
    try {
        await connectToDatabase();
        const sections = await AboutSectionModel.findAllActive();

        const sectionData: AboutSectionData[] = sections.map(section => ({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            id: section._id.toString(),
            section_key: section.section_key,
            title: section.title,
            subtitle: section.subtitle,
            content: section.content,
            image_url: section.image_url,
            stats: section.stats,
            features: section.features,
            team_members: section.team_members,
            order_index: section.order_index,
            isActive: section.isActive
        }));

        return {
            isError: false,
            data: { sections: sectionData }
        };
    } catch (error) {
        console.error('Error fetching about sections:', error);
        return {
            isError: true,
            message: 'Failed to fetch about sections'
        };
    }
}

// Get all team members
export async function getAllTeamMembersServerSide(): Promise<{
    isError: boolean;
    message?: string;
    data?: {
        teamMembers: TeamMemberData[];
    };
}> {
    try {
        await connectToDatabase();
        const members = await TeamMemberModel.findAllActive();

        const memberData: TeamMemberData[] = members.map(member => ({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            id: member._id.toString(),
            name: member.name,
            role: member.role,
            bio: member.bio,
            image_url: member.image_url,
            order_index: member.order_index,
            isActive: member.isActive,
            social_links: member.social_links
        }));

        return {
            isError: false,
            data: { teamMembers: memberData }
        };
    } catch (error) {
        console.error('Error fetching team members:', error);
        return {
            isError: true,
            message: 'Failed to fetch team members'
        };
    }
}

// Update about section
export async function updateAboutSectionServerSide(section: AboutSectionData): Promise<{
    isError: boolean;
    message?: string;
    data?: AboutSectionData;
}> {
    try {
        await connectToDatabase();

        const { id, ...updateData } = section;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const result = await AboutSectionModel.updateByKey(section.section_key, updateData);

        if (!result) {
            return {
                isError: true,
                message: 'Section not found'
            };
        }

        const updatedSection: AboutSectionData = {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            id: result._id.toString(),
            section_key: result.section_key,
            title: result.title,
            subtitle: result.subtitle,
            content: result.content,
            image_url: result.image_url,
            stats: result.stats,
            features: result.features,
            team_members: result.team_members,
            order_index: result.order_index,
            isActive: result.isActive
        };

        revalidatePath('/about');
        revalidatePath('/admin/about-me');

        return {
            isError: false,
            data: updatedSection
        };
    } catch (error) {
        console.error('Error updating about section:', error);
        return {
            isError: true,
            message: 'Failed to update section'
        };
    }
}

// Update team member
export async function updateTeamMemberServerSide(member: TeamMemberData): Promise<{
    isError: boolean;
    message?: string;
    data?: TeamMemberData;
}> {
    try {
        await connectToDatabase();

        const { id, ...updateData } = member;
        const result = await TeamMemberModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!result) {
            return {
                isError: true,
                message: 'Team member not found'
            };
        }

        const updatedMember: TeamMemberData = {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            id: result._id.toString(),
            name: result.name,
            role: result.role,
            bio: result.bio,
            image_url: result.image_url,
            order_index: result.order_index,
            isActive: result.isActive,
            social_links: result.social_links
        };

        revalidatePath('/about');
        revalidatePath('/admin/about-me');

        return {
            isError: false,
            data: updatedMember
        };
    } catch (error) {
        console.error('Error updating team member:', error);
        return {
            isError: true,
            message: 'Failed to update team member'
        };
    }
}

// Create team member
export async function createTeamMemberServerSide(member: Omit<TeamMemberData, 'id'>): Promise<{
    isError: boolean;
    message?: string;
    data?: TeamMemberData;
}> {
    try {
        await connectToDatabase();

        const newMember = new TeamMemberModel(member);
        await newMember.save();

        const createdMember: TeamMemberData = {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            id: newMember._id.toString(),
            name: newMember.name,
            role: newMember.role,
            bio: newMember.bio,
            image_url: newMember.image_url,
            order_index: newMember.order_index,
            isActive: newMember.isActive,
            social_links: newMember.social_links
        };

        revalidatePath('/about');
        revalidatePath('/admin/about-me');

        return {
            isError: false,
            data: createdMember
        };
    } catch (error) {
        console.error('Error creating team member:', error);
        return {
            isError: true,
            message: 'Failed to create team member'
        };
    }
}

// Delete team member (soft delete)
export async function deleteTeamMemberServerSide(id: string): Promise<{
    isError: boolean;
    message?: string;
}> {
    try {
        await connectToDatabase();

        const result = await TeamMemberModel.findByIdAndUpdate(
            id,
            { $set: { isActive: false } },
            { new: true }
        );

        if (!result) {
            return {
                isError: true,
                message: 'Team member not found'
            };
        }

        revalidatePath('/about');
        revalidatePath('/admin/about-me');

        return {
            isError: false,
            message: 'Team member deleted successfully'
        };
    } catch (error) {
        console.error('Error deleting team member:', error);
        return {
            isError: true,
            message: 'Failed to delete team member'
        };
    }
}

// Upload section image
export async function uploadSectionImage(formData: FormData): Promise<{
    isError: boolean;
    message?: string;
    data?: { imageUrl: string };
}> {
    try {
        const file = formData.get('image') as File;
        const sectionKey = formData.get('sectionKey') as string;

        if (!file) {
            return {
                isError: true,
                message: 'No image file provided'
            };
        }

        // Upload to Cloudinary
        const uploadResult = await uploadImageToCloudinary(file, 'about-page');

        // Update the section with new image URL
        const section = await AboutSectionModel.findByKey(sectionKey);
        if (section) {
            // Delete old image from Cloudinary if it exists
            if (section.image_url) {
                const oldPublicId = await extractPublicIdFromUrl(section.image_url);
                if (oldPublicId) {
                    await deleteFromCloudinary(oldPublicId, 'image');
                }
            }

            // Update section with new image URL
            await AboutSectionModel.updateByKey(sectionKey, { image_url: uploadResult.url });
        }

        revalidatePath('/about');
        revalidatePath('/admin/about-me');

        return {
            isError: false,
            data: { imageUrl: uploadResult.url }
        };
    } catch (error) {
        console.error('Error uploading section image:', error);
        return {
            isError: true,
            message: 'Failed to upload image'
        };
    }
}

// Upload team member image
export async function uploadTeamMemberImage(formData: FormData): Promise<{
    isError: boolean;
    message?: string;
    data?: { imageUrl: string };
}> {
    try {
        const file = formData.get('image') as File;
        const memberId = formData.get('memberId') as string;

        if (!file) {
            return {
                isError: true,
                message: 'No image file provided'
            };
        }

        // Upload to Cloudinary
        const uploadResult = await uploadImageToCloudinary(file, 'about-page/team');

        // Update team member with new image URL
        const member = await TeamMemberModel.findById(memberId);
        if (member) {
            // Delete old image from Cloudinary if it exists
            if (member.image_url) {
                const oldPublicId = await extractPublicIdFromUrl(member.image_url);
                if (oldPublicId) {
                    await deleteFromCloudinary(oldPublicId, 'image');
                }
            }

            // Update member with new image URL
            await TeamMemberModel.findByIdAndUpdate(memberId, { image_url: uploadResult.url });
        }

        revalidatePath('/about');
        revalidatePath('/admin/about-me');

        return {
            isError: false,
            data: { imageUrl: uploadResult.url }
        };
    } catch (error) {
        console.error('Error uploading team member image:', error);
        return {
            isError: true,
            message: 'Failed to upload image'
        };
    }
}

// Initialize default sections
export async function initializeDefaultAboutSections(): Promise<{
    isError: boolean;
    message?: string;
}> {
    try {
        await connectToDatabase();

        const defaultSections = [
            {
                section_key: 'hero',
                title: 'IMPROVE YOUR <span class="text-[#222]">FITNESS LEVEL</span> FOR THE BETTER',
                content: 'We provide standard & express delivery services through our logistics partners, ensuring your fitness gear and essentials reach you quickly and safely. Join our growing community today!',
                stats: {
                    happyMembers: 500,
                    satisfiedCustomers: 900
                },
                order_index: 1,
                isActive: true
            },
            {
                section_key: 'story',
                subtitle: 'OUR STORY',
                title: 'We Create and Glory for the Fitness Landscape',
                content: 'We are dedicated to providing high-quality solutions that make your fitness journey smoother and more effective. Innovation, dedication, and community are our core values.',
                features: [
                    { text: 'Care landscape shows health and care services that empower growth and strength.' },
                    { text: 'Professional guidance and support for your fitness journey.' },
                    { text: 'Community-driven approach to health and wellness.' }
                ],
                order_index: 2,
                isActive: true
            },
            {
                section_key: 'why-choose',
                title: 'WHY CHOOSE US',
                content: 'We offer a unique combination of personalized fitness training, expert guidance, and 24/7 support designed to help you achieve your goals faster.',
                features: [
                    {
                        title: '24/7 Support',
                        content: 'Get professional guidance anytime you need, helping you stay consistent and motivated throughout your journey.',
                        icon: 'ImConnection'
                    },
                    {
                        title: 'Expert Trainers',
                        content: 'Learn from certified professionals with years of experience in fitness and nutrition.',
                        icon: 'BsPeople'
                    },
                    {
                        title: 'Custom Plans',
                        content: 'Personalized workout and nutrition plans tailored to your specific goals and needs.',
                        icon: 'IoCodeWorking'
                    },
                    {
                        title: 'Community',
                        content: 'Join a supportive community of like-minded individuals on the same fitness journey.',
                        icon: 'MdOutlineFlaky'
                    }
                ],
                order_index: 3,
                isActive: true
            },
            {
                section_key: 'team',
                title: 'OUR TEAM',
                content: 'Meet our passionate trainers and mentors who bring years of experience to help you stay fit and strong every day.',
                order_index: 4,
                isActive: true
            },
            {
                section_key: 'vision',
                title: 'OUR GYM VISION',
                content: 'Our mission is to create a global community of empowered individuals committed to health, fitness, and mental strength.',
                order_index: 5,
                isActive: true
            },
            {
                section_key: 'expert-team',
                title: 'Meet Our Expert Team',
                content: 'Dedicated professionals ready to support your fitness journey every step of the way.',
                order_index: 6,
                isActive: true
            }
        ];

        for (const section of defaultSections) {
            await AboutSectionModel.updateByKey(section.section_key, section);
        }

        revalidatePath('/about');
        revalidatePath('/admin/about-me');

        return {
            isError: false,
            message: 'Default sections initialized successfully'
        };
    } catch (error) {
        console.error('Error initializing default sections:', error);
        return {
            isError: true,
            message: 'Failed to initialize default sections'
        };
    }
}