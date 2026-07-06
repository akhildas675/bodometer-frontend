import { GENDER } from "@/constants/identity";
import { trainerService } from "@/modules/trainer/service/trainer.service";
import { useAuthStore } from "@/stores/auth.store";
import { useTrainerOnboardingStore } from "@/stores/trainer-onboarding.store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { parseApiError } from "@/api/error.helper";

const GENDER_LABELS: Record<string, string> = {
  [GENDER.MALE]: "Male",
  [GENDER.FEMALE]: "Female",
  [GENDER.OTHER]: "Other",
  [GENDER.PREFER_NOT_SAY]: "Prefer Not to Say",
};

const TrainerOnboardingProfile = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile image
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  // Cover photo
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  // Certificate
  const [certFileName, setCertFileName] = useState<string | null>(null);
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
    (field: "profileImage" | "coverImage" | "certifications") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;

      if (field === "profileImage") {
        if (profilePreview) URL.revokeObjectURL(profilePreview);
        setProfileImageFile(file);
        setProfilePreview(file ? URL.createObjectURL(file) : null);
      }

      if (field === "coverImage") {
        if (coverPreview) URL.revokeObjectURL(coverPreview);
        setCoverImageFile(file);
        setCoverPreview(file ? URL.createObjectURL(file) : null);
      }

      if (field === "certifications") {
        setCertificateFile(file);
        setCertFileName(file?.name ?? null);
      }
    };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      if (coverImageFile) {
        formData.append("coverImage", coverImageFile);
      }
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }
      if (certificateFile) {
        formData.append("certificate", certificateFile);
      }
      if (form.profile.dateOfBirth) {
        formData.append("dateOfBirth", form.profile.dateOfBirth);
      }
      if (form.profile.gender) {
        formData.append("gender", form.profile.gender);
      }
      if (form.profile.experienceInYears !== undefined && form.profile.experienceInYears !== null) {
        formData.append("experience", String(form.profile.experienceInYears));
      }
      if (form.profile.bio) {
        formData.append("bio", form.profile.bio);
      }

      form.workout.specializationIds.forEach((id) => {
        formData.append("specializationIds", id);
      });

      const res = await trainerService.submitTrainerProfile(formData);
      useTrainerOnboardingStore.getState().reset();

      useAuthStore.getState().setVerificationStatus("pending");
      toast.success(res.message);
      navigate("/trainer/status", { replace: true });
    } catch (error: unknown) {
      const apiError = parseApiError(error);
      toast.error(apiError.message);
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

          {/* COVER PHOTO + PROFILE IMAGE */}
          <div className="mb-8">
            {/* Cover Photo */}
            <label className="relative w-full rounded-2xl border-2 border-dashed border-purple-500/60 bg-purple-900/20 cursor-pointer hover:border-purple-400 transition-all overflow-hidden"
              style={{ display: "block", height: "144px" }}>
              {/* Centered content wrapper */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ paddingBottom: "36px" }}>
                {!coverPreview && (
                  <>
                    <svg
                      className="w-7 h-7 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.5} />
                      <circle cx="8.5" cy="8.5" r="1.5" strokeWidth={1.5} />
                      <path
                        d="M21 15l-5-5L5 21"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-purple-300 text-sm font-medium">
                      Upload Cover Photo
                    </span>
                    <span className="text-white/30 text-xs">
                      Recommended: 1200 × 300px
                    </span>
                  </>
                )}
              </div>

              {/* Cover preview image */}
              {coverPreview && (
                <>
                  <img
                    src={coverPreview}
                    alt="cover"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 text-white text-sm font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
                      </svg>
                      Change Cover Photo
                    </div>
                  </div>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFile("coverImage")}
                className="hidden"
              />
            </label>

            {/* Profile Image — overlapping the cover at the bottom center */}
            <div className="flex justify-center -mt-10 relative z-10">
              <label className="relative h-24 w-24 rounded-full border-2 border-purple-500/60 flex items-center justify-center cursor-pointer shadow-lg shadow-black/40">
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
              className="w-full px-6 py-3 rounded-full bg-purple-900/30 text-white border border-purple-700/50 text-sm font-medium focus:outline-none focus:border-purple-400 transition-all appearance-none cursor-pointer pr-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a78bfa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 1.25rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.25rem 1.25rem'
              }}
            >
              <option value="" disabled className="bg-[#0e0a30] text-white/60">
                Gender
              </option>
              {Object.values(GENDER).map((gender) => (
                <option key={gender} value={gender} className="bg-[#0e0a30] text-white">
                  {GENDER_LABELS[gender]}
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