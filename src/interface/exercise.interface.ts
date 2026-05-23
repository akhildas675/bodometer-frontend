import { DifficultyLevel } from "@/constants/fitness.constant";

export interface ExerciseFormData {
  title: string;
  description: string;
  instructions: string[];
  categoryIds: string[];
  targetMuscleIds: string[];
  equipmentIds: string[];
  workoutEnvironments: string[];

  difficulty: DifficultyLevel;

  isCompound: boolean;
  video: File | null;
  videoUrl?: string; // For existing preview
  image: File | null;

}

export interface ExerciseMedia {
  image: string;
  videoUrl?: string;
}

export interface ExerciseRow {
  exerciseId: string;
  key: string;
  title: string;
  description: string;
  instructions: string[];
  media: ExerciseMedia;
  categoryIds: string[];
  targetMuscleIds: string[];
  equipmentIds: string[];
  workoutEnvironments: string[];
  difficulty: DifficultyLevel;

  isCompound: boolean;
  isActive: boolean;
  targetMuscles?: string[];
  equipment?: string[];
  createdAt?: string;
  updatedAt?: string;
}
