import { useAuthStore } from "@/stores/auth.store";
import SidebarLayout from "@/components/ui/app.sidebar/sidebar.layout";
import userServices from "@/services/user/user.services";
import type {
  ProfileUpdatePayload,
  UserProfileInterface,
} from "@/interface/user.interface";
import type { Gender } from "@/constants/identity";
import { useFetch } from "@/hooks/useFetch";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { PenIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const user = useAuthStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const {
    data: profileResponse,
    loading,
    error,
    refetch,
  } = useFetch<{ success: boolean; data: UserProfileInterface }>(
    userServices.getUserProfile,
    true,
  );

  const profile = profileResponse?.data;

  const [form, setForm] = useState<ProfileUpdatePayload>({
    name: "",
    userName: "",
    phoneNumber: null,
    gender: "prefer_not_say" as Gender,
    dateOfBirth: null,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        userName: profile.userName || "",
        phoneNumber: profile.phoneNumber || null,
        gender: profile.gender || "prefer_not_say",
        dateOfBirth: profile.dateOfBirth || null,
      });
      setPreviewUrl(profile.profilePic || "");
    }
  }, [profile]);

  const handleChange =
    (field: keyof ProfileUpdatePayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setForm((prev) => ({
        ...prev,
        [field]: field === "phoneNumber" && value === "" ? null : value,
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
        phoneNumber: profile.phoneNumber || null,
        gender: profile.gender || "prefer_not_say",
        dateOfBirth: profile.dateOfBirth || null,
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
          await userServices.uploadProfilePicture(formData);

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
        dateOfBirth: form.dateOfBirth,
      };

      if (uploadedImageUrl) {
        updatePayload.profilePic = uploadedImageUrl;
      }

      const updateResponse =
        await userServices.updateUserProfile(updatePayload);

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
            style: {
              background: "#ef4444",
              color: "#fff",
            },
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
      <SidebarLayout role="user">
        <div className="min-h-screen bg-[#050017] text-white pt-24 pb-10 flex items-center justify-center">
          <p>Loading profile...</p>
        </div>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout role="user">
        <div className="min-h-screen bg-[#050017] text-white pt-24 pb-10 flex items-center justify-center">
          <p className="text-red-500">Error loading profile</p>
        </div>
      </SidebarLayout>
    );
  }

  if (!profile || !user) {
    return (
      <SidebarLayout role="user">
        <div className="min-h-screen bg-[#050017] text-white pt-24 pb-10 flex items-center justify-center">
          <p>No profile data found</p>
        </div>
      </SidebarLayout>
    );
  }

  const formatDateForInput = (date: Date | string | null | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const displayImage =
    previewUrl ||
    "https://images.unsplash.com/photo-1599058917212-d750089bc07a";

  return (
    <SidebarLayout role="user">
      <div className="min-h-screen bg-[#050017] text-white pt-24 pb-10">
        <div className="flex flex-1 max-w-7xl mx-auto">
          <main className="flex-1 px-10">
            <h1 className="text-lg text-slate-300 mb-6">
              WELCOME{" "}
              <span className="text-indigo-400 font-semibold">
                {profile.name}
              </span>
            </h1>

            <div className="relative bg-linear-to-br from-[#140b3a] to-[#0a0624] rounded-3xl p-8 shadow-xl">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={displayImage}
                      className={`h-14 w-14 rounded-full object-cover border-2 border-purple-500 ${
                        isEditing ? "cursor-pointer hover:opacity-80" : ""
                      } ${isSaving ? "opacity-50" : ""}`}
                      alt="user"
                      onClick={handleProfilePicClick}
                    />
                    {isEditing && (
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full cursor-pointer hover:bg-opacity-50 transition"
                        onClick={handleProfilePicClick}
                      >
                        <span className="text-white text-xs">
                          {isSaving ? "..." : <PenIcon />}
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleProfilePicChange}
                      accept="image/*"
                      className="hidden"
                      disabled={!isEditing || isSaving}
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold">{form.name}</h2>
                    <p className="text-xs text-slate-400">{profile.email}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-1 rounded-full bg-gray-600 hover:bg-gray-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        form="profile-form"
                        className="px-4 py-1 rounded-full bg-purple-600 hover:bg-purple-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="px-4 py-1 rounded-full bg-purple-600 hover:bg-purple-700 transition text-sm"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <form
                id="profile-form"
                className="space-y-4"
                onSubmit={handleUpdate}
              >
                <div className="grid grid-cols-2 gap-8 text-sm">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-400">Name</label>
                    <input
                      className="bg-[#1c1550] px-4 py-3 rounded-lg outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      value={form.name}
                      onChange={handleChange("name")}
                      disabled={!isEditing}
                      placeholder="Enter name"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-400">Username</label>
                    <input
                      className="bg-[#1c1550] px-4 py-3 rounded-lg outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      value={form.userName}
                      onChange={handleChange("userName")}
                      disabled={!isEditing}
                      placeholder="Enter username"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-400">Email</label>
                    <input
                      type="email"
                      className="bg-[#1c1550] px-4 py-3 rounded-lg outline-none opacity-60 cursor-not-allowed"
                      value={profile.email}
                      disabled
                      title="Email cannot be changed"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-400">Phone</label>
                    <input
                      type="tel"
                      className="bg-[#1c1550] px-4 py-3 rounded-lg outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      value={form.phoneNumber || ""}
                      onChange={handleChange("phoneNumber")}
                      disabled={!isEditing}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-400">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="bg-[#1c1550] px-4 py-3 rounded-lg outline-none border-2 border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                      value={formatDateForInput(form.dateOfBirth)}
                      onChange={(e) => {
                        setForm((prev) => ({
                          ...prev,
                          dateOfBirth: e.target.value
                            ? new Date(e.target.value)
                            : null,
                        }));
                      }}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-400">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="bg-[#1c1550] px-4 py-3 rounded-lg outline-none disabled:opacity-60 disabled:cursor-not-allowed"
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
              </form>
              <div className="mt-6 flex gap-4">
                <p className="text-xs text-indigo-400 cursor-pointer hover:text-indigo-300 transition">
                  Purchase history
                </p>
                <span className="text-slate-600">|</span>
                <p
                  onClick={() => navigate("/change-password")}
                  className="text-xs text-indigo-400 cursor-pointer hover:text-indigo-300 transition"
                >
                  Change Password
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default UserProfile;
