import { useEffect, useState, useRef } from "react";
import { PenIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import SidebarLayout from "@/components/ui/app.sidebar/sidebar.layout";

import { useAuthStore } from "@/stores/auth.store";
import { useFetch } from "@/hooks/useFetch";

import type { Gender } from "@/constants/identity";
import type {
  ProfileUpdatePayload,
  TrainerProfileInterface,
} from "@/interface/trainer.interface";

import trainerService from "@/services/trainer/trainer.service";

const TrainerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useAuthStore((state) => state.user);

  const [form, setForm] = useState({
    name: "",
    userName: "",
    email: "",
    phoneNumber: "" as string | null,
    gender: "prefer_not_say" as Gender,
    dateOfBirth: "" as string | null,
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
      });
      setPreviewUrl(profile.profilePic || "");
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
      });
      setPreviewUrl(profile.profilePic || "");
    }
    setSelectedImage(null);
    setIsEditing(false);
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

    toast.success("Image selected. Click Save to upload.");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.gender || form.gender === "prefer_not_say") {
      toast.error("Please select your gender before updating profile");
      return;
    }

    if (!form.dateOfBirth) {
      toast.error("Please enter your date of birth before updating profile");
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading("Updating profile...");

    try {
      let uploadedImageUrl: string | undefined;

      if (selectedImage) {
        toast.loading("Uploading image...", { id: loadingToast });

        const formData = new FormData();
        formData.append("file", selectedImage);

        const uploadResponse =
          await trainerService.uploadProfilePicture(formData);

        if (uploadResponse.success && uploadResponse.data.url) {
          uploadedImageUrl = uploadResponse.data.url;
          toast.loading("Image uploaded. Saving profile...", {
            id: loadingToast,
          });
        } else {
          throw new Error("Failed to upload image");
        }
      }

      const updatePayload: ProfileUpdatePayload = {
        name: form.name,
        userName: form.userName,
        phoneNumber: form.phoneNumber,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth) : null,
      };

      if (uploadedImageUrl) {
        updatePayload.profilePic = uploadedImageUrl;
      }

      const updateResponse =
        await trainerService.updateTrainerProfile(updatePayload);

      if (updateResponse.success) {
        await refetch();
        setSelectedImage(null);
        setIsEditing(false);
        toast.success("Profile updated successfully!", { id: loadingToast });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);

      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.message || "Failed to update profile";
        const statusCode = error.response.status;

        if (statusCode === 403) {
          toast.error(errorMessage, {
            id: loadingToast,
            duration: 5000,
          });
        } else if (statusCode === 400) {
          toast.error(errorMessage, { id: loadingToast });
        } else if (statusCode === 401) {
          toast.error("Session expired. Please login again.", {
            id: loadingToast,
          });
        } else if (statusCode === 409) {
          toast.error(errorMessage, { id: loadingToast });
        } else {
          toast.error(errorMessage, { id: loadingToast });
        }
      } else if (error instanceof Error) {
        toast.error(error.message, { id: loadingToast });
      } else {
        toast.error("An unexpected error occurred. Please try again.", {
          id: loadingToast,
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <SidebarLayout role="trainer">
        <div className="min-h-screen bg-[#050017] text-white pt-24 pb-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout role="trainer">
        <div className="min-h-screen bg-[#050017] text-white pt-24 pb-10 flex items-center justify-center">
          <p className="text-red-400">
            Failed to load profile. Please try again.
          </p>
        </div>
      </SidebarLayout>
    );
  }

  if (!profile || !user) {
    return (
      <SidebarLayout role="trainer">
        <div className="min-h-screen bg-[#050017] text-white pt-24 pb-10 flex items-center justify-center">
          <p>No profile data found</p>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout role="trainer">
      <div className="min-h-screen bg-[#050017] text-white pt-24 pb-10">
        <div className="flex flex-1 max-w-7xl mx-auto">
          <main className="flex-1 px-10">
            <h1 className="text-lg text-slate-300 mb-6">
              WELCOME{" "}
              <span className="text-indigo-400 font-semibold">
                {form.name || "Trainer"}
              </span>
            </h1>

            <div className="relative bg-linear-to-br from-[#140b3a] to-[#0a0624] rounded-3xl p-8 shadow-xl">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
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
                      className="h-14 w-14 rounded-full object-cover border-2 border-purple-500 cursor-pointer"
                      alt="user"
                      onClick={handleProfilePicClick}
                    />
                    {isEditing && (
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full cursor-pointer"
                        onClick={handleProfilePicClick}
                      >
                        <PenIcon size={14} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold">{form.name}</h2>
                    <p className="text-xs text-slate-400">{form.email}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {isEditing && (
                    <>
                      <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        type="button"
                        className="px-4 py-1 rounded-full bg-gray-600 hover:bg-gray-700 transition text-sm disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdate}
                        disabled={isSaving}
                        type="button"
                        className="px-4 py-1 rounded-full bg-purple-600 hover:bg-purple-700 transition text-sm disabled:opacity-50 flex items-center gap-2"
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
                      className="px-4 py-1 rounded-full bg-purple-600 hover:bg-purple-700 transition text-sm"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-8 text-sm">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-400">Name</label>
                    <input
                      className="bg-[#1c1550] px-4 py-3 rounded-lg outline-none disabled:opacity-60"
                      value={form.name}
                      onChange={handleChange("name")}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-400">Username</label>
                    <input
                      className="bg-[#1c1550] px-4 py-3 rounded-lg outline-none disabled:opacity-60"
                      value={form.userName}
                      onChange={handleChange("userName")}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-400">Email</label>
                    <input
                      type="email"
                      className="bg-[#1c1550] px-4 py-3 rounded-lg outline-none opacity-60 cursor-not-allowed"
                      value={form.email}
                      disabled
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-400">Phone</label>
                    <input
                      type="tel"
                      className="bg-[#1c1550] px-4 py-3 rounded-lg outline-none disabled:opacity-60"
                      value={form.phoneNumber || ""}
                      onChange={handleChange("phoneNumber")}
                      disabled={!isEditing}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-400">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className="bg-[#1c1550] px-4 py-3 rounded-lg outline-none disabled:opacity-60"
                      value={form.dateOfBirth || ""}
                      onChange={handleChange("dateOfBirth")}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-400">Gender</label>
                    <select
                      className="bg-[#1c1550] px-4 py-3 rounded-lg outline-none disabled:opacity-60"
                      value={form.gender}
                      onChange={handleChange("gender")}
                      disabled={!isEditing}
                      required
                    >
                      <option value="prefer_not_say">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-xs text-indigo-400 cursor-pointer hover:text-indigo-300 transition">
                Purchase history
              </p>
            </div>
          </main>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default TrainerProfile;