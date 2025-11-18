'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, Plus, Trash2, Save, Upload, Image as ImageIcon } from 'lucide-react';
import {
    getAllAboutSectionsServerSide,
    getAllTeamMembersServerSide,
    updateAboutSectionServerSide,
    updateTeamMemberServerSide,
    createTeamMemberServerSide,
    deleteTeamMemberServerSide,
    uploadSectionImage,
    uploadTeamMemberImage,
    type AboutSectionData,
    type TeamMemberData
} from '@/server/functions/about-page.fun';

// Define proper interfaces for feature objects
interface StoryFeature {
    text: string;
}

interface WhyChooseFeature {
    title: string;
    content: string;
    icon: string;
}

function AboutMe() {
    const [sections, setSections] = useState<AboutSectionData[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);
    const [activeTab, setActiveTab] = useState('hero');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [sectionsResponse, teamResponse] = await Promise.all([
                getAllAboutSectionsServerSide(),
                getAllTeamMembersServerSide()
            ]);

            if (!sectionsResponse.isError && sectionsResponse.data) {
                setSections(sectionsResponse.data.sections);
            }

            if (!teamResponse.isError && teamResponse.data) {
                setTeamMembers(teamResponse.data.teamMembers);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            setSaveStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleSectionUpdate = async (sectionKey: string, sectionData: AboutSectionData) => {
        setSaving(true);
        setSaveStatus('idle');

        try {
            const response = await updateAboutSectionServerSide(sectionData);

            if (!response.isError && response.data) {
                setSections(prev => prev.map(s =>
                    s.section_key === sectionKey ? response.data! : s
                ));
                setSaveStatus('success');
                setTimeout(() => setSaveStatus('idle'), 3000);
            } else {
                setSaveStatus('error');
            }
        } catch (error) {
            console.error('Error updating section:', error);
            setSaveStatus('error');
        } finally {
            setSaving(false);
        }
    };

    const handleTeamMemberUpdate = async (memberData: TeamMemberData) => {
        setSaving(true);
        setSaveStatus('idle');

        try {
            const response = await updateTeamMemberServerSide(memberData);

            if (!response.isError && response.data) {
                setTeamMembers(prev => prev.map(m =>
                    m.id === memberData.id ? response.data! : m
                ));
                setSaveStatus('success');
                setTimeout(() => setSaveStatus('idle'), 3000);
            } else {
                setSaveStatus('error');
            }
        } catch (error) {
            console.error('Error updating team member:', error);
            setSaveStatus('error');
        } finally {
            setSaving(false);
        }
    };

    const handleCreateTeamMember = async () => {
        setSaving(true);
        setSaveStatus('idle');

        try {
            const newMember: Omit<TeamMemberData, 'id'> = {
                name: 'New Team Member',
                role: 'Team Member',
                bio: 'Add bio here...',
                image_url: '',
                order_index: teamMembers.length,
                isActive: true
            };

            const response = await createTeamMemberServerSide(newMember);
            if (!response.isError && response.data) {
                setTeamMembers(prev => [...prev, response.data!]);
                setSaveStatus('success');
                setTimeout(() => setSaveStatus('idle'), 3000);
            } else {
                setSaveStatus('error');
            }
        } catch (error) {
            console.error('Error creating team member:', error);
            setSaveStatus('error');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTeamMember = async (id: string) => {
        if (!confirm('Are you sure you want to delete this team member?')) return;

        setSaving(true);
        setSaveStatus('idle');

        try {
            const response = await deleteTeamMemberServerSide(id);
            if (!response.isError) {
                setTeamMembers(prev => prev.filter(m => m.id !== id));
                setSaveStatus('success');
                setTimeout(() => setSaveStatus('idle'), 3000);
            } else {
                setSaveStatus('error');
            }
        } catch (error) {
            console.error('Error deleting team member:', error);
            setSaveStatus('error');
        } finally {
            setSaving(false);
        }
    };

    const handleSectionImageUpload = async (sectionKey: string, file: File) => {
        setSaving(true);
        setSaveStatus('idle');

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('sectionKey', sectionKey);

            const response = await uploadSectionImage(formData);

            if (!response.isError && response.data) {
                // Update the section with new image URL
                const updatedSection = sections.find(s => s.section_key === sectionKey);
                if (updatedSection) {
                    await handleSectionUpdate(sectionKey, {
                        ...updatedSection,
                        image_url: response.data.imageUrl
                    });
                }
                setSaveStatus('success');
                setTimeout(() => setSaveStatus('idle'), 3000);
            } else {
                setSaveStatus('error');
            }
        } catch (error) {
            console.error('Error uploading section image:', error);
            setSaveStatus('error');
        } finally {
            setSaving(false);
        }
    };

    const handleTeamMemberImageUpload = async (memberId: string, file: File) => {
        setSaving(true);
        setSaveStatus('idle');

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('memberId', memberId);

            const response = await uploadTeamMemberImage(formData);

            if (!response.isError && response.data) {
                // Update the team member with new image URL
                const updatedMember = teamMembers.find(m => m.id === memberId);
                if (updatedMember) {
                    await handleTeamMemberUpdate({
                        ...updatedMember,
                        image_url: response.data.imageUrl
                    });
                }
                setSaveStatus('success');
                setTimeout(() => setSaveStatus('idle'), 3000);
            } else {
                setSaveStatus('error');
            }
        } catch (error) {
            console.error('Error uploading team member image:', error);
            setSaveStatus('error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="w-6 h-6 animate-spin text-[#F27D31]" />
                <span className="ml-2">Loading...</span>
            </div>
        );
    }

    const sectionTabs = [
        { key: 'hero', name: 'Hero Section' },
        { key: 'story', name: 'Our Story' },
        { key: 'why-choose', name: 'Why Choose Us' },
        { key: 'team', name: 'Our Team' },
        { key: 'vision', name: 'Our Vision' },
        { key: 'expert-team', name: 'Expert Team' }
    ];

    const getSectionByKey = (key: string): AboutSectionData => {
        return sections.find(s => s.section_key === key) || {
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

    return (
        <div className="p-6 bg-white rounded-lg shadow mt-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">About Page Management</h1>

                <AnimatePresence>
                    {saveStatus !== 'idle' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                saveStatus === 'success'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}
                        >
                            {saveStatus === 'success' ? 'Saved successfully!' : 'Error saving changes'}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {sectionTabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === tab.key
                                    ? 'border-[#F27D31] text-[#F27D31]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            {saving && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 flex items-center">
                    <Loader className="w-4 h-4 animate-spin text-blue-600 mr-2" />
                    <div className="text-blue-700 text-sm">Saving changes...</div>
                </div>
            )}

            {activeTab === 'hero' && (
                <HeroSectionEditor
                    section={getSectionByKey('hero')}
                    onSave={(sectionData) => handleSectionUpdate('hero', sectionData)}
                    onImageUpload={(file) => handleSectionImageUpload('hero', file)}
                    saving={saving}
                />
            )}

            {activeTab === 'story' && (
                <StorySectionEditor
                    section={getSectionByKey('story')}
                    onSave={(sectionData) => handleSectionUpdate('story', sectionData)}
                    saving={saving}
                />
            )}

            {activeTab === 'why-choose' && (
                <WhyChooseEditor
                    section={getSectionByKey('why-choose')}
                    onSave={(sectionData) => handleSectionUpdate('why-choose', sectionData)}
                    saving={saving}
                />
            )}

            {activeTab === 'team' && (
                <TeamSectionEditor
                    section={getSectionByKey('team')}
                    teamMembers={teamMembers}
                    onSectionSave={(sectionData) => handleSectionUpdate('team', sectionData)}
                    onTeamMemberSave={handleTeamMemberUpdate}
                    onTeamMemberImageUpload={handleTeamMemberImageUpload}
                    onCreateTeamMember={handleCreateTeamMember}
                    onDeleteTeamMember={handleDeleteTeamMember}
                    saving={saving}
                />
            )}

            {activeTab === 'vision' && (
                <VisionSectionEditor
                    section={getSectionByKey('vision')}
                    onSave={(sectionData) => handleSectionUpdate('vision', sectionData)}
                    saving={saving}
                />
            )}

            {activeTab === 'expert-team' && (
                <ExpertTeamEditor
                    section={getSectionByKey('expert-team')}
                    teamMembers={teamMembers}
                    onSave={(sectionData) => handleSectionUpdate('expert-team', sectionData)}
                    saving={saving}
                />
            )}
        </div>
    );
}

// Individual Section Editors

interface SectionEditorProps {
    section: AboutSectionData;
    onSave: (sectionData: AboutSectionData) => void;
    saving: boolean;
    onImageUpload?: (file: File) => void;
}

const HeroSectionEditor = ({ section, onSave, saving, onImageUpload }: SectionEditorProps) => {
    const [formData, setFormData] = useState<AboutSectionData>(section);

    useEffect(() => {
        setFormData(section);
    }, [section]);

    const handleInputChange = (field: keyof AboutSectionData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleStatsChange = (field: string, value: number) => {
        setFormData(prev => ({
            ...prev,
            stats: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ...prev.stats,
                [field]: value
            }
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onImageUpload) {
            onImageUpload(file);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Hero Section</h2>
                <button
                    onClick={() => onSave(formData)}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#F27D31] text-white px-4 py-2 rounded-md hover:bg-[#e56a1a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Section'}
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                    placeholder="Main title..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                    value={formData.content || ''}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                    placeholder="Hero content..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="hero-image-upload"
                    />
                    <label
                        htmlFor="hero-image-upload"
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md cursor-pointer transition-colors"
                    >
                        <Upload className="w-4 h-4" />
                        Upload Image
                    </label>
                    {formData.image_url && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <ImageIcon className="w-4 h-4" />
                            <span>Image uploaded</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Happy Members Count</label>
                    <input
                        type="number"
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        value={formData.stats?.happyMembers || 500}
                        onChange={(e) => handleStatsChange('happyMembers', parseInt(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Satisfied Customers Count</label>
                    <input
                        type="number"
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        value={formData.stats?.satisfiedCustomers || 900}
                        onChange={(e) => handleStatsChange('satisfiedCustomers', parseInt(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                    />
                </div>
            </div>
        </div>
    );
};

const StorySectionEditor = ({ section, onSave, saving }: SectionEditorProps) => {
    const [formData, setFormData] = useState<AboutSectionData>(section);

    useEffect(() => {
        setFormData(section);
    }, [section]);

    const handleInputChange = (field: keyof AboutSectionData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...(formData.features || [])];
        if (!newFeatures[index]) {
            newFeatures[index] = { text: '' };
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        newFeatures[index] = { ...newFeatures[index], text: value };
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        const newFeatures = [...(formData.features || []), { text: 'New feature...' }];
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const removeFeature = (index: number) => {
        const newFeatures = [...(formData.features || [])];
        newFeatures.splice(index, 1);
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Our Story Section</h2>
                <button
                    onClick={() => onSave(formData)}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#F27D31] text-white px-4 py-2 rounded-md hover:bg-[#e56a1a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Section'}
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                    type="text"
                    value={formData.subtitle || ''}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                    placeholder="Subtitle..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                    placeholder="Main title..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                    value={formData.content || ''}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                    placeholder="Story content..."
                />
            </div>

            <div>
                <h3 className="font-medium mb-2">Features/Bullet Points</h3>
                {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    (formData.features || []).map((feature: StoryFeature, index: number) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={feature.text || ''}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                            placeholder="Feature text..."
                        />
                        <button
                            onClick={() => removeFeature(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <button
                    onClick={addFeature}
                    className="flex items-center gap-2 bg-[#F27D31] text-white px-3 py-2 rounded-md hover:bg-[#e56a1a]"
                >
                    <Plus className="w-4 h-4" />
                    Add Feature
                </button>
            </div>
        </div>
    );
};

const WhyChooseEditor = ({ section, onSave, saving }: SectionEditorProps) => {
    const [formData, setFormData] = useState<AboutSectionData>(section);
    const iconOptions = [
        { value: 'ImConnection', label: 'Connection Icon' },
        { value: 'BsPeople', label: 'People Icon' },
        { value: 'IoCodeWorking', label: 'Work Icon' },
        { value: 'MdOutlineFlaky', label: 'Star Icon' }
    ];

    useEffect(() => {
        setFormData(section);
    }, [section]);

    const handleInputChange = (field: keyof AboutSectionData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFeatureChange = (index: number, field: string, value: string) => {
        const newFeatures = [...(formData.features || Array(4).fill({}))];
        if (!newFeatures[index]) {
            newFeatures[index] = {};
        }
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        const newFeatures = [...(formData.features || []), { title: '', content: '', icon: 'ImConnection' }];
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const removeFeature = (index: number) => {
        const newFeatures = [...(formData.features || [])];
        newFeatures.splice(index, 1);
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const moveFeatureUp = (index: number) => {
        if (index === 0) return;
        const newFeatures = [...(formData.features || [])];
        const temp = newFeatures[index];
        newFeatures[index] = newFeatures[index - 1];
        newFeatures[index - 1] = temp;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const moveFeatureDown = (index: number) => {
        const newFeatures = [...(formData.features || [])];
        if (index === newFeatures.length - 1) return;
        const temp = newFeatures[index];
        newFeatures[index] = newFeatures[index + 1];
        newFeatures[index + 1] = temp;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Why Choose Us Section</h2>
                <button
                    onClick={() => onSave(formData)}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#F27D31] text-white px-4 py-2 rounded-md hover:bg-[#e56a1a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Section'}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                        placeholder="Why Choose Us..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                        value={formData.content || ''}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                        placeholder="Section description..."
                    />
                </div>
            </div>

            <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Features Grid</h3>
                    <button
                        onClick={addFeature}
                        className="flex items-center gap-2 bg-[#F27D31] text-white px-3 py-2 rounded-md hover:bg-[#e56a1a]"
                    >
                        <Plus className="w-4 h-4" />
                        Add Feature
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(formData.features && formData.features.length > 0
                            ? formData.features
                            : Array(4).fill({ title: '', content: '', icon: 'ImConnection' })
                    ).map((feature: WhyChooseFeature, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium text-gray-800">Feature {index + 1}</h4>
                                <div className="flex gap-2">
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => moveFeatureUp(index)}
                                            disabled={index === 0}
                                            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                                            title="Move up"
                                        >
                                            ↑
                                        </button>
                                        <button
                                            onClick={() => moveFeatureDown(index)}
                                            disabled={index === (formData.features?.length || 0) - 1}
                                            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                                            title="Move down"
                                        >
                                            ↓
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFeature(index)}
                                        className="p-1 text-red-500 hover:text-red-700"
                                        title="Remove feature"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                                    <select
                                        value={feature.icon || 'ImConnection'}
                                        onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                                    >
                                        {iconOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={feature.title || ''}
                                        onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                                        placeholder="Feature title..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={feature.content || ''}
                                        onChange={(e) => handleFeatureChange(index, 'content', e.target.value)}
                                        rows={3}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                                        placeholder="Feature description..."
                                    />
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="mt-4 p-3 bg-white border border-gray-200 rounded-md">
                                <h5 className="text-sm font-medium text-gray-600 mb-2">Preview:</h5>
                                <div className="flex items-center gap-3 p-2 bg-[#FEF2EA] rounded">
                                    <div className="text-[#F27D31]">
                                        {feature.icon === 'ImConnection' && (
                                            <div className="w-6 h-6 bg-[#F27D31] rounded-full flex items-center justify-center text-white text-xs">
                                                C
                                            </div>
                                        )}
                                        {feature.icon === 'BsPeople' && (
                                            <div className="w-6 h-6 bg-[#F27D31] rounded-full flex items-center justify-center text-white text-xs">
                                                P
                                            </div>
                                        )}
                                        {feature.icon === 'IoCodeWorking' && (
                                            <div className="w-6 h-6 bg-[#F27D31] rounded-full flex items-center justify-center text-white text-xs">
                                                W
                                            </div>
                                        )}
                                        {feature.icon === 'MdOutlineFlaky' && (
                                            <div className="w-6 h-6 bg-[#F27D31] rounded-full flex items-center justify-center text-white text-xs">
                                                S
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h6 className="font-semibold text-sm text-[#222]">
                                            {feature.title || 'Feature Title'}
                                        </h6>
                                        <p className="text-gray-600 text-xs">
                                            {feature.content || 'Feature description will appear here...'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {(!formData.features || formData.features.length === 0) && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-500">No features added yet.</p>
                        <button
                            onClick={addFeature}
                            className="mt-2 flex items-center gap-2 bg-[#F27D31] text-white px-4 py-2 rounded-md hover:bg-[#e56a1a] mx-auto"
                        >
                            <Plus className="w-4 h-4" />
                            Add First Feature
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

interface TeamSectionEditorProps {
    section: AboutSectionData;
    teamMembers: TeamMemberData[];
    onSectionSave: (sectionData: AboutSectionData) => void;
    onTeamMemberSave: (memberData: TeamMemberData) => void;
    onTeamMemberImageUpload: (memberId: string, file: File) => void;
    onCreateTeamMember: () => void;
    onDeleteTeamMember: (id: string) => void;
    saving: boolean;
}

const TeamSectionEditor = ({
                               section,
                               teamMembers,
                               onSectionSave,
                               onTeamMemberSave,
                               onTeamMemberImageUpload,
                               onCreateTeamMember,
                               onDeleteTeamMember,
                               saving
                           }: TeamSectionEditorProps) => {
    const [sectionFormData, setSectionFormData] = useState<AboutSectionData>(section);
    const [teamMemberForms, setTeamMemberForms] = useState<{ [key: string]: TeamMemberData }>({});

    useEffect(() => {
        setSectionFormData(section);
        // Initialize team member forms
        const initialForms: { [key: string]: TeamMemberData } = {};
        teamMembers.forEach(member => {
            if (member.id) {
                initialForms[member.id] = member;
            }
        });
        setTeamMemberForms(initialForms);
    }, [section, teamMembers]);

    const handleSectionInputChange = (field: keyof AboutSectionData, value: string) => {
        setSectionFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleTeamMemberChange = (memberId: string, field: keyof TeamMemberData, value: string | number) => {
        setTeamMemberForms(prev => ({
            ...prev,
            [memberId]: {
                ...prev[memberId],
                [field]: value
            }
        }));
    };

    const handleTeamMemberImageUpload = (memberId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onTeamMemberImageUpload(memberId, file);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Our Team Section</h2>
                <button
                    onClick={() => onSectionSave(sectionFormData)}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#F27D31] text-white px-4 py-2 rounded-md hover:bg-[#e56a1a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Section'}
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    type="text"
                    value={sectionFormData.title || ''}
                    onChange={(e) => handleSectionInputChange('title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                    placeholder="Title..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                    value={sectionFormData.content || ''}
                    onChange={(e) => handleSectionInputChange('content', e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                    placeholder="Content..."
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Team Members</h3>
                    <button
                        onClick={onCreateTeamMember}
                        disabled={saving}
                        className="flex items-center gap-2 bg-[#F27D31] text-white px-4 py-2 rounded-md hover:bg-[#e56a1a] disabled:opacity-50"
                    >
                        <Plus className="w-4 h-4" />
                        Add Team Member
                    </button>
                </div>

                <div className="space-y-4">
                    {teamMembers.map((member) => (
                        <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-medium">Team Member</h4>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => member.id && onTeamMemberSave(teamMemberForms[member.id] || member)}
                                        disabled={saving}
                                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                                    >
                                        <Save className="w-3 h-3" />
                                        Save
                                    </button>
                                    <button
                                        onClick={() => member.id && onDeleteTeamMember(member.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        value={teamMemberForms[member.id]?.name || member.name}
                                        onChange={(e) => member.id && handleTeamMemberChange(member.id, 'name', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <input
                                        type="text"
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        value={teamMemberForms[member.id]?.role || member.role || ''}
                                        onChange={(e) => member.id && handleTeamMemberChange(member.id, 'role', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="mt-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    value={teamMemberForms[member.id]?.bio || member.bio || ''}
                                    onChange={(e) => member.id && handleTeamMemberChange(member.id, 'bio', e.target.value)}
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                                />
                            </div>

                            <div className="mt-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => member.id && handleTeamMemberImageUpload(member.id, e)}
                                        className="hidden"
                                        id={`team-member-image-${member.id}`}
                                    />
                                    <label
                                        htmlFor={`team-member-image-${member.id}`}
                                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm cursor-pointer transition-colors"
                                    >
                                        <Upload className="w-3 h-3" />
                                        Upload Image
                                    </label>
                                    {(
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        teamMemberForms[member.id]?.image_url || member.image_url) && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <ImageIcon className="w-3 h-3" />
                                            <span>Image uploaded</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
                                    <input
                                        type="number"
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        value={teamMemberForms[member.id]?.order_index || member.order_index || 0}
                                        onChange={(e) => member.id && handleTeamMemberChange(member.id, 'order_index', parseInt(e.target.value) || 0)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const VisionSectionEditor = ({ section, onSave, saving }: SectionEditorProps) => {
    const [formData, setFormData] = useState<AboutSectionData>(section);

    useEffect(() => {
        setFormData(section);
    }, [section]);

    const handleInputChange = (field: keyof AboutSectionData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Vision Section</h2>
                <button
                    onClick={() => onSave(formData)}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#F27D31] text-white px-4 py-2 rounded-md hover:bg-[#e56a1a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Section'}
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                    placeholder="Title..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                    value={formData.content || ''}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                    placeholder="Content..."
                />
            </div>
        </div>
    );
};

const ExpertTeamEditor = ({ section, teamMembers, onSave, saving }: SectionEditorProps & { teamMembers: TeamMemberData[] }) => {
    const [formData, setFormData] = useState<AboutSectionData>(section);

    useEffect(() => {
        setFormData(section);
    }, [section]);

    const handleInputChange = (field: keyof AboutSectionData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Expert Team Section</h2>
                <button
                    onClick={() => onSave(formData)}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#F27D31] text-white px-4 py-2 rounded-md hover:bg-[#e56a1a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Section'}
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                    placeholder="Title..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                    value={formData.content || ''}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F27D31] focus:border-transparent"
                    placeholder="Content..."
                />
            </div>

            <div>
                <h3 className="font-medium mb-2">Team Members Preview</h3>
                <p className="text-sm text-gray-600">
                    {teamMembers.length} team members available. Team members are managed in the &quot;Our Team&quot; section.
                </p>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {teamMembers.slice(0, 4).map((member) => (
                        <div key={member.id} className="text-center p-2 border rounded">
                            <div className="font-medium text-sm truncate">{member.name}</div>
                            <div className="text-xs text-gray-500 truncate">{member.role}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutMe;