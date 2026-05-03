import React from "react";


export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

export interface TableAction<T> {
  label: string;
  variant?: "danger" | "primary";
  visible?: (item: T) => boolean;
  disabled?: (row: T) => boolean;
  onClick: (item: T) => void | Promise<void>;
}




export interface TrainerProfile {
  _id: string;
  userId: string;
  specializationIds: { _id: string; workoutName: string }[];  
  experienceInYears: number;
  certifications: string[];
  bio: string;
  coverPhoto:string;
  verificationStatus: "pending" | "approved" | "rejected";
  rejectionReason: string | null;
  applyCount: number;  
  createdAt: string;
  updatedAt: string;
}


export interface TrainerUser {
  _id: string;
  name: string;
  userName: string;
  email: string;
  phoneNumber: string;
  profilePic: string | null;
  gender: string;
  role: string;
  isVerified: boolean;
  dateOfBirth: string | null;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TrainerWithProfile {
  user: TrainerUser;
  profile: TrainerProfile;
}

export interface AdminGetSubscriptionResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  durationInDays: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
}