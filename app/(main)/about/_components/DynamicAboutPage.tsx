// components/about/DynamicAboutPage.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { BsPeople } from 'react-icons/bs';
import { ImConnection } from 'react-icons/im';
import { IoCodeWorking } from 'react-icons/io5';
import { MdOutlineFlaky } from 'react-icons/md';
import { AboutSectionData, TeamMemberData } from '@/server/functions/about-page.fun';
import imageUrl from "@/const/imageUrl";

interface DynamicAboutPageProps {
    sections: AboutSectionData[];
    teamMembers: TeamMemberData[];
}

// Define proper interfaces for the feature objects
interface StoryFeature {
    text: string;
}

interface WhyChooseFeature {
    title: string;
    content: string;
    icon: string;
}

// Define interface for stats
interface Stats {
    happyMembers?: number;
    satisfiedCustomers?: number;
    [key: string]: number | undefined; // Allow for other potential stats
}

// Extend the AboutSectionData to include proper typing for stats and features
interface TypedAboutSectionData extends Omit<AboutSectionData, 'stats' | 'features'> {
    stats?: Stats;
    features?: StoryFeature[] | WhyChooseFeature[];
}

function DynamicAboutPage({ sections, teamMembers }: DynamicAboutPageProps) {
    const getSection = (key: string): TypedAboutSectionData => {
        const section = sections.find(s => s.section_key === key);
        if (section) {
            return {
                ...section,
                stats: section.stats as Stats || {},
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                features: section.features || []
            };
        }
        return {
            section_key: key,
            title: '',
            subtitle: '',
            content: '',
            image_url: '',
            stats: {},
            features: [],
            team_members: [],
            order_index: 0,
            isActive: true
        };
    };

    const heroSection = getSection('hero');
    const storySection = getSection('story');
    const whyChooseSection = getSection('why-choose');
    const teamSection = getSection('team');
    const visionSection = getSection('vision');
    const expertTeamSection = getSection('expert-team');

    // Helper function to render HTML content safely
    const renderHTML = (html: string) => {
        return { __html: html };
    };

    // Get icon component based on icon name
    const getIconComponent = (iconName: string) => {
        switch (iconName) {
            case 'ImConnection':
                return <ImConnection className="text-[#F27D31] text-2xl" />;
            case 'BsPeople':
                return <BsPeople className="text-[#F27D31] text-2xl" />;
            case 'IoCodeWorking':
                return <IoCodeWorking className="text-[#F27D31] text-2xl" />;
            case 'MdOutlineFlaky':
                return <MdOutlineFlaky className="text-[#F27D31] text-2xl" />;
            default:
                return <ImConnection className="text-[#F27D31] text-2xl" />;
        }
    };

    // Type guard for StoryFeature
    const isStoryFeature = (feature: unknown): feature is StoryFeature => {
        return typeof feature === 'object' && feature !== null && 'text' in feature;
    };

    // Type guard for WhyChooseFeature
    const isWhyChooseFeature = (feature: unknown): feature is WhyChooseFeature => {
        return typeof feature === 'object' && feature !== null && 'title' in feature && 'content' in feature && 'icon' in feature;
    };

    // Get story features with proper typing
    const getStoryFeatures = (): StoryFeature[] => {
        if (storySection.features && storySection.features.length > 0) {
            return storySection.features.filter(isStoryFeature) as StoryFeature[];
        }
        return [
            { text: 'Care landscape shows health and care services that empower growth and strength.' },
            { text: 'Professional guidance and support for your fitness journey.' },
            { text: 'Community-driven approach to health and wellness.' }
        ];
    };

    // Get why choose features with proper typing
    const getWhyChooseFeatures = (): WhyChooseFeature[] => {
        if (whyChooseSection.features && whyChooseSection.features.length > 0) {
            return whyChooseSection.features.filter(isWhyChooseFeature) as WhyChooseFeature[];
        }
        return [
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
        ];
    };

    return (
        <div className="w-full bg-white">
            {/* Section 1 - Hero */}
            <section className="max-w-[1500px] mx-auto px-6 py-12 md:py-20">
                <h1
                    className="text-2xl md:text-4xl font-bold text-[#F27D31] text-center mb-6"
                    dangerouslySetInnerHTML={renderHTML(
                        heroSection.title || 'IMPROVE YOUR <span class="text-[#222]">FITNESS LEVEL</span> FOR THE BETTER'
                    )}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
                    {/* Image */}
                    <div className="relative w-full h-[250px] md:h-[400px]">
                        <Image
                            src={heroSection.image_url || imageUrl.about[1]}
                            alt="about"
                            fill
                            className="object-cover rounded-xl"
                            priority
                        />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-5">
                        <p className="text-gray-700 leading-relaxed">
                            {heroSection.content || 'We provide standard & express delivery services through our logistics partners, ensuring your fitness gear and essentials reach you quickly and safely. Join our growing community today!'}
                        </p>

                        <div className="flex flex-wrap gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold text-[#222]">
                                    {(heroSection.stats?.happyMembers || 500)}+
                                </h2>
                                <p className="text-gray-600">Happy Members</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold text-[#222]">
                                    {(heroSection.stats?.satisfiedCustomers || 900)}+
                                </h2>
                                <p className="text-gray-600">Satisfied Customers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2 - Our Story */}
            <section className="max-w-[1500px] mx-auto px-6 py-16">
                <h3 className="text-[#F27D31] font-semibold text-lg text-center">
                    {storySection.subtitle || 'OUR STORY'}
                </h3>
                <h1 className="text-2xl md:text-4xl font-bold text-center mt-2 mb-6">
                    {storySection.title || 'We Create and Glory for the Fitness Landscape'}
                </h1>
                <p className="text-gray-700 text-center max-w-2xl mx-auto leading-relaxed">
                    {storySection.content || 'We are dedicated to providing high-quality solutions that make your fitness journey smoother and more effective. Innovation, dedication, and community are our core values.'}
                </p>

                <div className="flex flex-col gap-3 mt-8 max-w-xl mx-auto">
                    {getStoryFeatures().map((feature: StoryFeature, i: number) => (
                        <div key={i} className="flex items-center gap-3">
                            <MdOutlineFlaky className="text-[#F27D31] text-xl" />
                            <p className="text-gray-700">
                                {feature.text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 3 - Why Choose Us */}
            <section className="max-w-[1500px] mx-auto px-6 py-20">
                <div className="text-center mb-10">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#F27D31] mb-4">
                        {whyChooseSection.title || 'WHY CHOOSE US'}
                    </h1>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                        {whyChooseSection.content || 'We offer a unique combination of personalized fitness training, expert guidance, and 24/7 support designed to help you achieve your goals faster.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-10">
                    {/* Right Text */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {getWhyChooseFeatures().map((feature: WhyChooseFeature, i: number) => (
                            <div key={i} className="flex flex-col gap-3 bg-[#FEF2EA] p-4 rounded-xl">
                                {getIconComponent(feature.icon)}
                                <h2 className="font-semibold text-lg text-[#222]">
                                    {feature.title}
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    {feature.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 4 - Our Team */}
            <section className="max-w-[1500px] mx-auto px-6 py-20 bg-[#FEF2EA] rounded-3xl">
                <div className="text-center mb-10">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#F27D31]">
                        {teamSection.title || 'OUR TEAM'}
                    </h1>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                        {teamSection.content || 'Meet our passionate trainers and mentors who bring years of experience to help you stay fit and strong every day.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    {/* Left Cards */}
                    <div className="flex flex-col gap-6">
                        {teamMembers.slice(0, 3).map((member, i) => (
                            <div key={member.id || i} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow">
                                <BsPeople className="text-[#F27D31] text-3xl" />
                                <div>
                                    <h2 className="font-bold text-[#222]">{member.name || `Team Member ${i + 1}`}</h2>
                                    <p className="text-sm text-gray-600">
                                        {member.role || member.bio || 'Certified fitness trainer helping clients achieve their personal goals.'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Cards */}
                    <div className="flex flex-col gap-6">
                        {teamMembers.slice(3, 6).map((member, i) => (
                            <div key={member.id || i} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow">
                                <BsPeople className="text-[#F27D31] text-3xl" />
                                <div>
                                    <h2 className="font-bold text-[#222]">{member.name || `Team Member ${i + 3}`}</h2>
                                    <p className="text-sm text-gray-600">
                                        {member.bio || member.role || 'Expert in nutrition and wellness strategies for long-term results.'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 5 - Vision */}
            <section className="max-w-[1500px] mx-auto px-6 py-20">
                <h1 className="text-2xl md:text-3xl font-bold text-[#F27D31] text-center mb-6">
                    {visionSection.title || 'OUR GYM VISION'}
                </h1>
                <p className="text-center max-w-2xl mx-auto text-gray-700 mb-10">
                    {visionSection.content || 'Our mission is to create a global community of empowered individuals committed to health, fitness, and mental strength.'}
                </p>
            </section>

            {/* Section 6 - Expert Team */}
            <section className="max-w-[1500px] mx-auto px-6 py-20 bg-[#FEF2EA]">
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
                    Meet Our <span className="text-[#F27D31]">Expert Team</span>
                </h1>
                <p className="text-gray-700 text-center max-w-2xl mx-auto mb-10">
                    {expertTeamSection.content || 'Dedicated professionals ready to support your fitness journey every step of the way.'}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {teamMembers.slice(0, 4).map((member, i) => (
                        <div key={member.id || i} className="relative w-full h-[250px] rounded-xl overflow-hidden shadow-md group">
                            <Image
                                src={member.image_url! || ""}
                                alt={member.name || `team-${i}`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-opacity-40 bg-black/20 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <div className="text-white">
                                    <h3 className="font-bold text-lg">{member.name || `Team Member ${i + 1}`}</h3>
                                    <p className="text-sm">{member.role || 'Fitness Expert'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default DynamicAboutPage;