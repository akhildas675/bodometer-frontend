import React from "react";


export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

export interface TableAction<T> {
  label: string | ((item: T) => string);

  icon?: React.ReactNode | ((item: T) => React.ReactNode);

  className?: string | ((item: T) => string);

  variant?: "danger" | "primary";

  disabled?: (item: T) => boolean;

  visible?: (item: T) => boolean;

  onClick: (item: T) => void;
}


export interface TrainerProfile {
  _id: string;
  userId: string;
  specializations: { _id: string; name: string }[];  
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