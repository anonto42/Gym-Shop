export interface IPersonalTraining {
    _id?: string;
    title: string;
    description: string;
    imageUrl: string[];
    price: number;
    originalPrice?: number;
    duration: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    trainer: string;
    isActive: boolean;
    isFeatured: boolean;
    videoUrl?: string;
    includes: string[];
    requirements: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IFeaturedVideo {
    _id?: string;
    videoUrl: string;
    title: string;
    description: string;
    isActive: boolean;
    trainingId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}