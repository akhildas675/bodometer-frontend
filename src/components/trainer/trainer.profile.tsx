import { useEffect, useState, useRef } from "react";
import {
  PenIcon,
  User,
  AtSign,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  Award,
  BookOpen,
  Dumbbell,
  Briefcase,
  FileText,
  Trash2,
  Plus,
  Eye,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { parseApiError } from "@/api/error.helper";



import { useAuthStore } from "@/stores/auth.store";
import { useFetch } from "@/hooks/useFetch";

import { GENDER } from "@/constants/identity";
import type { Gender } from "@/constants/identity";
import type {
  ProfileUpdatePayload,
  TrainerProfileInterface,
} from "@/interface/trainer.interface";
import type { CategoryListItem } from "@/interface/user.interface";

import trainerService from "@/services/trainer/trainer.service";

const GENDER_LABELS: Record<string, string> = {
  [GENDER.MALE]: "Male",
  [GENDER.FEMALE]: "Female",
  [GENDER.OTHER]: "Other",
  [GENDER.PREFER_NOT_SAY]: "Prefer Not to Say",
};

const TrainerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedCoverImage, setSelectedCoverImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const certificationsInputRef = useRef<HTMLInputElement>(null);

  const user = useAuthStore((state) => state.user);

  const [form, setForm] = useState({
    name: "",
    userName: "",
    email: "",
    phoneNumber: "" as string | null,
    gender: "prefer_not_say" as Gender,
    dateOfBirth: "" as string | null,
    experienceInYears: 0,
    bio: "",
    specializations: [] as string[],
    certifications: [] as string[],
  });

  const {
    data: profileResponse,
    loading,
    error,
    refetch,
  } = useFetch<{ success: boolean; data: TrainerProfileInterface }>(
    trainerService.getTrainerProfile,
    true,
  );

  const {
    data: categoriesResponse,
  } = useFetch<CategoryListItem[]>(() =>
    trainerService.getCategories().then((res) => res.data),
    true
  );

  const profile = profileResponse?.data;

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        userName: profile.userName || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        gender: profile.gender || "prefer_not_say",
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
          : "",
        experienceInYears: profile.experienceInYears || 0,
        bio: profile.bio || "",
        specializations: profile.specializations || [],
        certifications: profile.certifications || [],
      });
      setPreviewUrl(profile.profilePic || "");
      setCoverPreviewUrl(profile.coverPhoto || "");
    }
  }, [profile]);

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setForm((prev) => ({
        ...prev,
        [field]:
          value === ""
            ? field === "phoneNumber" || field === "dateOfBirth"
              ? null
              : ""
            : value,
      }));
    };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        name: profile.name || "",
        userName: profile.userName || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        gender: profile.gender || "prefer_not_say",
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
          : "",
        experienceInYears: profile.experienceInYears || 0,
        bio: profile.bio || "",
        specializations: profile.specializations || [],
        certifications: profile.certifications || [],
      });
      setPreviewUrl(profile.profilePic || "");
      setCoverPreviewUrl(profile.coverPhoto || "");
    }
    setSelectedImage(null);
    setSelectedCoverImage(null);
    setIsEditing(false);
  };

  const handleCoverPicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedCoverImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleToggleSpecialization = (categoryId: string) => {
    if (!isEditing) return;
    setForm((prev) => {
      const current = prev.specializations;
      const updated = current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId];
      return { ...prev, specializations: updated };
    });
  };

  const handleUploadCertificate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Allow PDFs, images, docs up to 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Document size should be less than 10MB");
      return;
    }

    const loadingToast = toast.loading("Uploading certification document...");
    setIsUploadingDoc(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await trainerService.uploadProfilePicture(formData);

      if (uploadResponse.success && uploadResponse.data.url) {
        setForm((prev) => ({
          ...prev,
          certifications: [...prev.certifications, uploadResponse.data.url],
        }));
        toast.success(uploadResponse.message, { id: loadingToast });
      } else {
        throw new Error("Failed to upload document");
      }
    } catch  {
      toast.error("Failed to upload document. Please try again.", { id: loadingToast });
    } finally {
      setIsUploadingDoc(false);
      if (certificationsInputRef.current) {
        certificationsInputRef.current.value = "";
      }
    }
  };

  const handleRemoveCertificate = (indexToRemove: number) => {
    if (!isEditing) return;
    setForm((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleProfilePicClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);
    const loadingToast = toast.loading("Updating profile...");

    try {
      let uploadedImageUrl: string | undefined;
      let uploadedCoverUrl: string | undefined;

      if (selectedImage) {
        toast.loading("Uploading profile image...", { id: loadingToast });

        const formData = new FormData();
        formData.append("file", selectedImage);

        const uploadResponse =
          await trainerService.uploadProfilePicture(formData);

        if (uploadResponse.success && uploadResponse.data.url) {
          uploadedImageUrl = uploadResponse.data.url;
        } else {
          throw new Error("Failed to upload profile image");
        }
      }

      if (selectedCoverImage) {
        toast.loading("Uploading cover photo...", { id: loadingToast });

        const formData = new FormData();
        formData.append("file", selectedCoverImage);

        const uploadResponse =
          await trainerService.uploadProfilePicture(formData);

        if (uploadResponse.success && uploadResponse.data.url) {
          uploadedCoverUrl = uploadResponse.data.url;
        } else {
          throw new Error("Failed to upload cover photo");
        }
      }

      toast.loading("Saving profile...", { id: loadingToast });

      const updatePayload: ProfileUpdatePayload = {
        name: form.name,
        userName: form.userName,
        phoneNumber: form.phoneNumber,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth) : null,
        experienceInYears: form.experienceInYears,
        bio: form.bio,
        specializations: form.specializations,
        certifications: form.certifications,
      };

      if (uploadedImageUrl) {
        updatePayload.profilePic = uploadedImageUrl;
      }

      if (uploadedCoverUrl) {
        updatePayload.coverPhoto = uploadedCoverUrl;
      }

      const updateResponse =
        await trainerService.updateTrainerProfile(updatePayload);

      if (updateResponse.success) {
        await refetch();
        setSelectedImage(null);
        setSelectedCoverImage(null);
        setIsEditing(false);
        toast.success(updateResponse.message, { id: loadingToast });
      } else {
        throw new Error(updateResponse.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      const apiError = parseApiError(error);

      if (apiError.statusCode === 403) {
        toast.error(apiError.message, {
          id: loadingToast,
          duration: 5000,
        });
      } else if (apiError.statusCode === 401) {
        toast.error("Session expired. Please login again.", {
          id: loadingToast,
        });
      } else {
        toast.error(apiError.message, { id: loadingToast });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
    
        <div className="min-h-screen bg-[#050017] text-white pt-24 pb-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
     
    );
  }

  if (error) {
    return (
    
        <div className="min-h-screen bg-[#050017] text-white pt-24 pb-10 flex items-center justify-center">
          <p className="text-red-400">
            Failed to load profile. Please try again.
          </p>
        </div>
     
    );
  }

  if (!profile || !user) {
    return (
  
        <div className="min-h-screen bg-[#050017] text-white pt-24 pb-10 flex items-center justify-center">
          <p>No profile data found</p>
        </div>
     
    );
  }

  return (
 
      <div className="max-w-7xl mx-auto text-white">
            <h1 className="text-lg text-slate-300 mb-6">
              WELCOME{" "}
              <span className="text-indigo-400 font-semibold">
                {form.name || "Trainer"}
              </span>
            </h1>

            <div className="relative bg-linear-to-br from-[#140b3a] to-[#0a0624] rounded-3xl overflow-hidden shadow-xl">
              
              {/* Cover Photo */}
              <div className="relative h-44 w-full bg-[#1b124a]">
                <img
                  src={
                    coverPreviewUrl ||
                    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&auto=format&fit=crop&q=80"
                  }
                  className="w-full h-full object-cover"
                  alt="cover"
                />
                
                {isEditing && (
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer hover:bg-black/60 transition-all opacity-0 hover:opacity-100"
                  >
                    <svg className="w-8 h-8 text-purple-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.5} />
                      <circle cx="8.5" cy="8.5" r="1.5" strokeWidth={1.5} />
                      <path d="M21 15l-5-5L5 21" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-white text-xs font-semibold">Change Cover Photo</span>
                  </div>
                )}
                
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverPicChange}
                  className="hidden"
                />
              </div>

              {/* Profile Card Header & Avatar Area */}
              <div className="p-8 pt-0 relative">
                {/* Profile Pic overlapping the cover photo */}
                <div className="flex justify-between items-end -mt-10 mb-6">
                  <div className="flex items-end gap-4">
                    <div className="relative z-10">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                        className="hidden"
                      />
                      <img
                        src={
                          previewUrl ||
                          "https://images.unsplash.com/photo-1599058917212-d750089bc07a"
                        }
                        className="h-20 w-20 rounded-full object-cover border-4 border-[#140b3a] cursor-pointer shadow-md shadow-black/30"
                        alt="user"
                        onClick={handleProfilePicClick}
                      />
                      {isEditing && (
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer border-4 border-[#140b3a]"
                          onClick={handleProfilePicClick}
                        >
                          <PenIcon size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="pb-1">
                      <h2 className="text-lg font-bold text-white leading-tight">{form.name}</h2>
                      <p className="text-xs text-slate-400">{form.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pb-1">
                    {isEditing && (
                      <>
                        <button
                          onClick={handleCancel}
                          disabled={isSaving}
                          type="button"
                          className="px-4 py-1.5 rounded-full bg-gray-600 hover:bg-gray-700 transition text-sm disabled:opacity-50 font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdate}
                          disabled={isSaving}
                          type="button"
                          className="px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 transition text-sm disabled:opacity-50 flex items-center gap-2 font-semibold cursor-pointer"
                        >
                          {isSaving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Saving...
                            </>
                          ) : (
                            "Save"
                          )}
                        </button>
                      </>
                    )}
                    {!isEditing && (
                      <button
                        onClick={handleEdit}
                        type="button"
                        className="px-5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 transition text-sm font-semibold cursor-pointer"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>

              <div className="space-y-6 mt-6">
                
                {/* Unified Card Layout for both View and Edit modes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Personal Information Card */}
                  <div className="bg-[#120a32]/60 rounded-3xl p-6 border border-purple-900/20 space-y-6">
                    <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-2 border-b border-purple-900/30 pb-3">
                      <User size={16} /> Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="flex items-start gap-3 bg-[#1c1550]/20 p-3 rounded-2xl border border-purple-950/30">
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                          <User size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Full Name</p>
                          {!isEditing ? (
                            <p className="text-sm font-semibold text-white truncate">{form.name || "—"}</p>
                          ) : (
                            <input
                              className="w-full bg-[#1c1550]/60 px-3 py-1.5 rounded-lg border border-purple-800/40 text-white text-xs outline-none focus:border-purple-500 transition-all font-semibold"
                              value={form.name}
                              onChange={handleChange("name")}
                              required
                            />
                          )}
                        </div>
                      </div>

                      {/* Username */}
                      <div className="flex items-start gap-3 bg-[#1c1550]/20 p-3 rounded-2xl border border-purple-950/30">
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                          <AtSign size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Username</p>
                          {!isEditing ? (
                            <p className="text-sm font-semibold text-white truncate">{form.userName || "—"}</p>
                          ) : (
                            <input
                              className="w-full bg-[#1c1550]/60 px-3 py-1.5 rounded-lg border border-purple-800/40 text-white text-xs outline-none focus:border-purple-500 transition-all font-semibold"
                              value={form.userName}
                              onChange={handleChange("userName")}
                              required
                            />
                          )}
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-start gap-3 bg-[#1c1550]/20 p-3 rounded-2xl border border-purple-950/30 col-span-1 sm:col-span-2">
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                          <Mail size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Email Address</p>
                          <p className="text-sm font-semibold text-slate-400 truncate cursor-not-allowed select-none flex items-center gap-1.5">
                            {form.email}
                            <span className="text-[10px] bg-slate-500/10 px-1.5 py-0.5 rounded text-slate-500 border border-slate-500/20 font-semibold tracking-wide uppercase">Locked</span>
                          </p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-start gap-3 bg-[#1c1550]/20 p-3 rounded-2xl border border-purple-950/30">
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                          <Phone size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Phone</p>
                          {!isEditing ? (
                            <p className="text-sm font-semibold text-white truncate">{form.phoneNumber || "—"}</p>
                          ) : (
                            <input
                              type="tel"
                              className="w-full bg-[#1c1550]/60 px-3 py-1.5 rounded-lg border border-purple-800/40 text-white text-xs outline-none focus:border-purple-500 transition-all font-semibold"
                              value={form.phoneNumber || ""}
                              onChange={handleChange("phoneNumber")}
                              placeholder="Enter phone number"
                            />
                          )}
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div className="flex items-start gap-3 bg-[#1c1550]/20 p-3 rounded-2xl border border-purple-950/30">
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                          <Calendar size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Date of Birth</p>
                          {!isEditing ? (
                            <p className="text-sm font-semibold text-white truncate">
                              {form.dateOfBirth ? new Date(form.dateOfBirth).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : "—"}
                            </p>
                          ) : (
                            <input
                              type="date"
                              className="w-full bg-[#1c1550]/60 px-3 py-1.5 rounded-lg border border-purple-800/40 text-white text-xs outline-none focus:border-purple-500 transition-all font-semibold scheme-dark"
                              value={form.dateOfBirth || ""}
                              onChange={handleChange("dateOfBirth")}
                              required
                            />
                          )}
                        </div>
                      </div>

                      {/* Gender */}
                      <div className="flex items-start gap-3 bg-[#1c1550]/20 p-3 rounded-2xl border border-purple-950/30 col-span-1 sm:col-span-2">
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                          <Sparkles size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Gender</p>
                          {!isEditing ? (
                            <p className="text-sm font-semibold text-white truncate">{GENDER_LABELS[form.gender] || "—"}</p>
                          ) : (
                            <select
                              className="w-full bg-[#1c1550]/60 px-3 py-1.5 rounded-lg border border-purple-800/40 text-white text-xs outline-none focus:border-purple-500 transition-all font-semibold appearance-none cursor-pointer pr-8"
                              value={form.gender}
                              onChange={handleChange("gender")}
                              required
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a78bfa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: 'right 0.5rem center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '1rem 1rem'
                              }}
                            >
                              {Object.values(GENDER).map((gender) => (
                                <option key={gender} value={gender} className="bg-[#100b32] text-white">
                                  {GENDER_LABELS[gender]}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Profile Card */}
                  <div className="bg-[#120a32]/60 rounded-3xl p-6 border border-purple-900/20 space-y-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-2 border-b border-purple-900/30 pb-3 mb-4">
                        <Briefcase size={16} /> Professional Profile
                      </h3>
                      
                      {/* Professional Experience Banner */}
                      <div className="flex items-center gap-4 bg-linear-to-r from-purple-500/10 to-indigo-500/5 p-4 rounded-2xl border border-purple-500/20 mb-6">
                        <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300 shrink-0">
                          <Award size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-purple-300/80 font-medium uppercase tracking-wider mb-0.5">Professional Experience</p>
                          {!isEditing ? (
                            <p className="text-xl font-bold text-white">{form.experienceInYears} Years</p>
                          ) : (
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="number"
                                min="0"
                                className="w-24 bg-[#1c1550]/60 px-3 py-1.5 rounded-lg border border-purple-800/40 text-white text-xs outline-none focus:border-purple-500 transition-all font-semibold"
                                value={form.experienceInYears}
                                onChange={(e) => setForm(prev => ({ ...prev, experienceInYears: Math.max(0, Number(e.target.value)) }))}
                                required
                              />
                              <span className="text-xs text-slate-400 font-semibold">Years</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Biography Block */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Biography</p>
                        {!isEditing ? (
                          <div className="relative bg-[#1c1550]/20 p-4 rounded-2xl border border-purple-950/30 min-h-[110px] text-sm text-slate-300 leading-relaxed italic">
                            <BookOpen size={16} className="absolute top-3 right-3 text-purple-500/30" />
                            "{form.bio || "No biography provided yet."}"
                          </div>
                        ) : (
                          <textarea
                            rows={4}
                            className="w-full bg-[#1c1550]/60 px-4 py-3 rounded-2xl border border-purple-800/40 text-white text-xs outline-none focus:border-purple-500 transition-all min-h-[110px] resize-none font-medium leading-relaxed"
                            value={form.bio}
                            onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Tell clients about your background, training approach, and fitness philosophy..."
                            required
                          />
                        )}
                      </div>
                    </div>

                    {/* Specializations Block */}
                    <div className="space-y-3 mt-6">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Dumbbell size={14} className="text-purple-400" /> Areas of Specialization
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {/* If in View mode: show only active specializations */}
                        {!isEditing ? (
                          <>
                            {form.specializations.map((specId) => {
                              const category = categoriesResponse?.find(c => c.categoryId === specId);
                              return (
                                <span
                                  key={specId}
                                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm"
                                >
                                  {category?.name || "Specialization"}
                                </span>
                              );
                            })}
                            {form.specializations.length === 0 && (
                              <span className="text-xs text-slate-500 italic">No specializations selected yet.</span>
                            )}
                          </>
                        ) : (
                          // If in Edit mode: show all categories to toggle
                          <>
                            {categoriesResponse?.map((category) => {
                              const isSelected = form.specializations.includes(category.categoryId);
                              return (
                                <button
                                  key={category.categoryId}
                                  type="button"
                                  onClick={() => handleToggleSpecialization(category.categoryId)}
                                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-900/40 scale-105"
                                      : "bg-purple-950/20 border-purple-800/40 text-purple-200/60 hover:border-purple-600/50 hover:text-white"
                                  } hover:scale-105 active:scale-95`}
                                >
                                  {category.name}
                                </button>
                              );
                            })}
                            {(!categoriesResponse || categoriesResponse.length === 0) && (
                              <span className="text-xs text-slate-500 italic">No categories loaded</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Certifications Management Card */}
                <div className="bg-[#120a32]/60 rounded-3xl p-6 border border-purple-900/20 space-y-4">
                  <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
                    <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                      <FileText size={16} /> Certifications & Documents
                    </h3>
                    {isEditing && (
                      <div>
                        <button
                          type="button"
                          onClick={() => certificationsInputRef.current?.click()}
                          disabled={isUploadingDoc}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white transition disabled:opacity-50 cursor-pointer"
                        >
                          {isUploadingDoc ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Plus size={12} />
                              Add Certificate
                            </>
                          )}
                        </button>
                        <input
                          ref={certificationsInputRef}
                          type="file"
                          accept=".pdf,image/*,.doc,.docx"
                          onChange={handleUploadCertificate}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {form.certifications.map((certUrl, idx) => {
                      const filename = certUrl.split("/").pop() || `Certificate ${idx + 1}`;
                      const displayName = filename.length > 20 ? filename.substring(0, 17) + "..." : filename;
                      return (
                        <div
                          key={certUrl}
                          className="flex items-center justify-between bg-[#1c1550]/20 p-3 rounded-2xl border border-purple-950/30 relative group"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                              <FileText size={20} />
                            </div>
                            <div className="overflow-hidden pr-6">
                              <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                              <p className="text-[10px] text-slate-400">Trainer Document</p>
                            </div>
                          </div>
                          
                          <div className={`flex items-center gap-1 absolute right-2 top-1/2 -translate-y-1/2 transition ${isEditing ? 'opacity-0 group-hover:opacity-100' : ''}`}>
                            <a
                              href={certUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded bg-purple-500/10 text-purple-400 hover:bg-purple-500/25 hover:text-white transition flex items-center justify-center cursor-pointer"
                              title="View"
                            >
                              <Eye size={12} />
                            </a>
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => handleRemoveCertificate(idx)}
                                className="p-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/25 hover:text-red-300 transition flex items-center justify-center cursor-pointer"
                                title="Remove"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {form.certifications.length === 0 && (
                      <div className="col-span-full py-8 text-center text-slate-500 text-xs italic">
                        {isEditing 
                          ? 'No certificates uploaded. Click "Add Certificate" to upload document.'
                          : 'No certifications or documents uploaded yet.'}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              <p className="mt-6 text-xs text-indigo-400 cursor-pointer hover:text-indigo-300 transition">
                Purchase history
              </p>
            </div>
          </div>
      </div>
   
  );
};

export default TrainerProfile;