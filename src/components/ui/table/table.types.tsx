import React from "react";


export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean; 
}

export interface TableAction<T> {
  label: string;
  variant?: "danger" | "primary";
  visible?: (item: T) => boolean;
  disabled?: (row: T) => boolean;
  onClick: (item: T) => void;
}




export interface TrainerProfile {
  _id: string;
  userId: string;
  experienceInYears: number;
  certifications: string[];
  bio: string;
  verificationStatus: "pending" | "approved" | "rejected";
  rejectionReason: string | null;
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