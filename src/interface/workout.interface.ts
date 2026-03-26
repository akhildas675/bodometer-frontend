
export interface WorkoutFormData {
  workoutName: string;
  workoutDescription: string;
  workoutImage: File | null;
  coverPhoto: File | null;
  introVideo: File | null;        
  targetMuscles: string[];
  equipment: string[];
  benefits: string[];
}


export interface Workout {
  id: string;
  workoutName: string;
  workoutDescription: string;
  workoutImage: string;
  coverPhoto: string;
  introVideo: string;
  targetMuscles: string[];
  equipment: string[];
  benefits: string[];
  isActive: boolean;
}