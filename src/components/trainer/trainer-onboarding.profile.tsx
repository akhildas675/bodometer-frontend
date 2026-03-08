import { GENDER } from "@/constants/identity";
import trainerService from "@/services/trainer/trainer.service";
import { useAuthStore } from "@/stores/auth.store";
import { useTrainerOnboardingStore } from "@/stores/trainer-onboarding.store";

import axios from "axios";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const TrainerOnboardingProfile = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [certFileName, setCertFileName] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const { form, updateProfile } = useTrainerOnboardingStore();

  const handleChange =
    (field: keyof typeof form.profile) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        field === "experienceInYears" ? Number(e.target.value) : e.target.value;
      updateProfile({ [field]: value });
    };

  const handleFile =
    (field: "profileImage" | "certifications") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;

      if (field === "profileImage") {
        if (profilePreview) {
          URL.revokeObjectURL(profilePreview);
        }

        setProfileImageFile(file);
        setProfilePreview(file ? URL.createObjectURL(file) : null);
      }

      if (field === "certifications") {
        setCertificateFile(file);
        setCertFileName(file?.name ?? null);
      }
    };

  const validateForm = (): boolean => {
    if (!form.profile.dateOfBirth) {
      toast.error("Please select date of birth");
      return false;
    }

    if (!form.profile.gender) {
      toast.error("Please select gender");
      return false;
    }

    if (!profileImageFile) {
      toast.error("Please upload profile image");
      return false;
    }

    if (
      !form.profile.experienceInYears ||
      form.profile.experienceInYears <= 0
    ) {
      toast.error("Experience must be greater than 0");
      return false;
    }

    if (!certificateFile) {
      toast.error("Please upload your certifications");
      return false;
    }

    if (form.profile.bio.trim().length < 20) {
      toast.error("Bio must be at least 20 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      console.log(
        "profileImageFile instanceof File:",
        profileImageFile instanceof File,
      );
      console.log(
        "certificateFile instanceof File:",
        certificateFile instanceof File,
      );

      const formData = new FormData();

      formData.append("profileImage", profileImageFile!);
      formData.append("certificate", certificateFile!);
      formData.append("dateOfBirth", form.profile.dateOfBirth);
      formData.append("gender", form.profile.gender);
      formData.append("experience", String(form.profile.experienceInYears));
      formData.append("bio", form.profile.bio);

      form.workout.specializationIds.forEach((id) => {
        formData.append("specializationIds", id);
      });

       for (const pair of formData.entries()) {
       console.log("Trainer service.........kikik",pair[0], pair[1]);
     }

      await trainerService.submitTrainerProfile(formData);

      useAuthStore.getState().setVerificationStatus("pending");
      toast.success("Profile submitted! Awaiting admin approval.");
      navigate("/trainer/status", { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Submission failed");
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] flex flex-col items-center justify-center p-8">
      {/* LOGO + LOGOUT */}
      <div className="w-full max-w-6xl mb-6 flex items-center justify-between">
        <img
          src="https://bodometer-assets.s3.eu-north-1.amazonaws.com/Bodometer+Logo+corrected+1.png"
          alt="Bodometer"
          className="h-10 object-contain"
        />
        <button className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-all">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>

      <div className="max-w-6xl w-full bg-linear-to-b from-[#03000D] to-[#190473] rounded-3xl p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 text-white">
          <h1 className="text-white text-3xl font-bold mb-10 text-center">
            TELL US ABOUT YOU
          </h1>

          {/* PROFILE IMAGE */}
          <div className="flex justify-center mb-8">
            <label className="relative h-24 w-24 rounded-full border-2 border-purple-500/60 flex items-center justify-center cursor-pointer">
              <img
                src={
                  profilePreview ??
                  "https://ui-avatars.com/api/?background=6d28d9&color=fff&size=80&name=T"
                }
                alt="profile"
                className="h-20 w-20 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center text-xs border-2 border-[#03000D]">
                ✎
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFile("profileImage")}
                className="hidden"
              />
            </label>
          </div>

          {/* FIELDS */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Date of Birth */}
            <input
              type={form.profile.dateOfBirth ? "date" : "text"}
              value={form.profile.dateOfBirth}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!form.profile.dateOfBirth) e.target.type = "text";
              }}
              onChange={handleChange("dateOfBirth")}
              placeholder="Date of Birth"
              className="w-full px-6 py-3 rounded-full bg-purple-900/30 text-white border border-purple-700/50 text-sm font-medium focus:outline-none focus:border-purple-400 transition-all scheme-dark"
            />

            {/* Gender */}
            <select
              value={form.profile.gender}
              onChange={handleChange("gender")}
              className="w-full px-6 py-3 rounded-full bg-blue-900/30 text-white border border-purple-700/50 text-sm font-medium focus:outline-none focus:border-purple-400 transition-all appearance-none"
            >
              <option value="" disabled>
                Gender
              </option>
              {Object.values(GENDER).map((gender) => (
                <option key={gender} value={gender}>
                  {gender.replace("_", " ")}
                </option>
              ))}
            </select>

            {/* Experience */}
            <input
              type="number"
              value={form.profile.experienceInYears || ""}
              onChange={handleChange("experienceInYears")}
              min={1}
              placeholder="Years of Experience"
              className="w-full px-6 py-3 rounded-full bg-purple-900/30 text-white border border-purple-700/50 text-sm font-medium placeholder-white/60 focus:outline-none focus:border-purple-400 transition-all scheme-dark"
            />

            {/* Certificate Upload */}
            <label className="w-full px-6 py-3 rounded-full bg-purple-900/30 text-white border border-purple-700/50 text-sm font-medium flex items-center justify-between cursor-pointer hover:border-purple-400 transition-all">
              <span
                className={
                  certFileName
                    ? "text-white truncate max-w-[80%]"
                    : "text-white/60"
                }
              >
                {certFileName ?? "Upload Document"}
              </span>
              <span className="text-white/60 text-xs shrink-0">
                {certFileName ? "✓" : "📄"}
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.png"
                className="hidden"
                onChange={handleFile("certifications")}
              />
            </label>

            {/* Bio */}
            <input
              type="text"
              value={form.profile.bio}
              onChange={handleChange("bio")}
              placeholder="About yourself..."
              className="col-span-2 w-full px-6 py-3 rounded-full bg-purple-900/30 text-white border border-purple-700/50 text-sm font-medium placeholder-white/50 focus:outline-none focus:border-purple-400 transition-all"
            />
          </div>

          {/* BOTTOM ROW */}
          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="border-2 border-white/40 text-white/60 px-8 py-2 rounded-full hover:border-white hover:text-white transition-all font-semibold"
            >
              Previous
            </button>

            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-purple-500" />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="border-2 border-white text-white px-8 py-2 rounded-full hover:bg-white hover:text-purple-900 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Finish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerOnboardingProfile;
