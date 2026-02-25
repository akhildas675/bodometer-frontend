import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import trainerService from "@/services/trainer/trainer.service";
import authInitService from "@/services/auth/auth-init.service";
import { useAuthStore } from "@/stores/auth.store";

const TrainerOnboardingExperience = () => {
  const navigate = useNavigate();

  const [experience, setExperience] = useState<number | "">("");
  const [certificate, setCertificate] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const loadingToast = toast.loading("Logging out...");
      await authInitService.logout();
      toast.dismiss(loadingToast);
      toast.success("Logged out successfully");
      useAuthStore.getState().clearAuth();
      navigate("/login", { replace: true });
    } catch {
      toast.error("Logout failed");
      useAuthStore.getState().clearAuth();
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const validateForm = (): boolean => {
    if (!experience || experience <= 0) {
      toast.error("Experience must be greater than 0");
      return false;
    }

    if (!certificate) {
      toast.error("Please upload your certificate");
      return false;
    }

    if (bio.trim().length < 20) {
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

    const formData = new FormData();
    formData.append("experienceInYears", String(experience));
    formData.append("bio", bio);
    formData.append("certificate", certificate!);

    await trainerService.submitTrainerProfile(formData);

    
    useAuthStore.getState().setVerificationStatus("pending");

    toast.success("Profile resubmitted! Awaiting admin approval.");
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
    <div className="min-h-screen bg-[#050017] flex items-center justify-center">
      <div className="relative w-full max-w-6xl h-[600px] rounded-3xl overflow-hidden flex bg-linear-to-br from-[#04001a] via-[#07002a] to-[#12043b]">
        {/* LEFT */}
        <div className="w-1/2 hidden md:flex items-center justify-center relative">
          <div className="absolute w-[520px] h-[520px] rounded-full bg-[#0e0235]" />
          <img
            src="/Bg img.png"
            alt="trainer"
            className="relative z-10 h-[520px] object-contain"
          />

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="absolute bottom-8 left-8 z-20
              bg-[#1c255f] hover:bg-[#2d1b6a]
              text-white text-sm font-medium
              px-6 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex-1 relative flex items-center justify-center px-12 text-white">
          <div className="relative z-10 w-full max-w-xl">
            <h1 className="text-center text-xl font-semibold tracking-widest mb-14">
              TELL US ABOUT YOUR PROFESSIONAL INFO
            </h1>

            {/* EXPERIENCE */}
            <div className="mb-10">
              <p className="text-sm mb-3">Enter Your Experience (Years)</p>
              <input
                type="number"
                min={0}
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                className="w-24 bg-[#1c255f] rounded-lg px-4 py-2
                  text-center text-white outline-none"
              />
            </div>

            {/* CERTIFICATE */}
            <div className="mb-10">
              <p className="text-sm mb-3">Upload Your Certificate</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setCertificate(file);
                }}
                className="text-sm"
              />
              {certificate && (
                <p className="text-xs text-green-400 mt-2">
                  {certificate.name}
                </p>
              )}
            </div>

            {/* BIO */}
            <div className="mb-10">
              <p className="text-sm mb-3">Add Bio</p>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write about your experience and expertise"
                className="w-full bg-[#1c255f] rounded-lg px-4 py-4
                  text-sm text-white outline-none h-28 resize-none"
              />
            </div>

            {/* SUBMIT */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700
                py-3 rounded-xl text-white font-semibold
                transition disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerOnboardingExperience;
