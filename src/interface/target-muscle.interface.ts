import { BodyRegion } from "@/constants/fitness.constant";

export interface TargetMuscle {
    title: string;
    description: string;
    image: File | null;
    bodyRegion: BodyRegion
}

export interface UpdateTargetMuscles {
    targetMuscleId: string;
    title: string;
    description: string;
    image: string;
    bodyRegion: BodyRegion;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}