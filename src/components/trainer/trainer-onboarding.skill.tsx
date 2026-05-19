import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useFetch } from "@/hooks/useFetch";
import type { CategoryListItem } from "@/interface/user.interface";
import trainerService from "@/services/trainer/trainer.service";
import { toast } from "sonner";
import authInitService from "@/services/auth/auth-init.service";
import { useAuthStore } from "@/stores/auth.store";
import { useTrainerOnboardingStore } from "@/stores/trainer-onboarding.store";

const TrainerOnboardingSkills = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { form, setWorkouts } = useTrainerOnboardingStore();

  const selectedSkills = form.workout.specializationIds;

  const toggleSkill = (skillId: string) => {
    const updated = selectedSkills.includes(skillId)
      ? selectedSkills.filter((s) => s !== skillId)
      : [...selectedSkills, skillId];

    setWorkouts([...updated]);
  };
  const navigate = useNavigate();

  const {
    data: categoryList,
    loading,
    refetch,
  } = useFetch<CategoryListItem[]>(() =>
    trainerService.getCategories().then((res) => res.data),
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const loadingToast = toast.loading("Logging out...");

      await authInitService.logout();

      toast.dismiss(loadingToast);
      toast.success("Logged out successfully!");
      setTimeout(() => {
        navigate("/", { replace: true });
        setTimeout(() => {
          useAuthStore.getState().clearAuth();
        }, 150);
      }, 1500);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed, but you've been signed out locally");
      setTimeout(() => {
        navigate("/", { replace: true });
        setTimeout(() => {
          useAuthStore.getState().clearAuth();
        }, 150);
      }, 1500);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNext = () => {
    if (selectedSkills.length === 0) {
      toast.error("Select at least one category");
      return;
    }

    navigate("/trainer/onboarding/profile");
  };

  if (loading && !categoryList) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] flex items-center justify-center">
        <div className="text-white text-xl">Loading categories...</div>
      </div>
    );
  }

  if (!categoryList || categoryList.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] flex items-center justify-center">
        <div className="text-white text-xl">No categories available</div>
      </div>
    );
  }

  const midPoint = Math.ceil(categoryList.length / 2);
  const leftColumn = categoryList.slice(0, midPoint);
  const rightColumn = categoryList.slice(midPoint);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] flex flex-col items-center justify-center p-8">
      {/* LOGO + LOGOUT ROW */}
      <div className="w-full max-w-6xl mb-6 flex items-center justify-between">
        <img
          src="https://bodometer-assets.s3.eu-north-1.amazonaws.com/Bodometer+Logo+corrected+1.png"
          alt="Bodometer"
          className="h-10 object-contain"
        />
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-all"
        >
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
        {/* Background blur circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="flex items-center gap-16 relative z-10">
          <div className="flex-1">
            {/* TITLE */}
            <h1 className="text-white text-3xl font-bold mb-12 text-center">
              WHAT KIND OF SKILLS YOU HAVE?
            </h1>

            {/* SKILLS GRID */}
            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="space-y-4">
                {leftColumn.map((category) => (
                  <Skill
                    key={category.categoryId}
                    label={category.name}
                    checked={selectedSkills.includes(category.categoryId)}
                    onClick={() => toggleSkill(category.categoryId)}
                  />
                ))}
              </div>
              <div className="space-y-4">
                {rightColumn.map((category) => (
                  <Skill
                    key={category.categoryId}
                    label={category.name}
                    checked={selectedSkills.includes(category.categoryId)}
                    onClick={() => toggleSkill(category.categoryId)}
                  />
                ))}
              </div>
            </div>

            {/* BOTTOM ROW — dots centered, next right */}
            <div className="flex items-center justify-between">
              <div className="flex-1" />

              {/* Stepper dots — centered */}
              <div className="flex gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                <span className="h-2 w-2 rounded-full bg-white/30" />
              </div>

              <div className="flex-1 flex justify-end">
                <button
                  disabled={selectedSkills.length === 0}
                  onClick={handleNext}
                  className={`border-2 px-8 py-2 rounded-full font-semibold transition-all ${
                    selectedSkills.length > 0
                      ? "border-white text-white hover:bg-white hover:text-purple-900 cursor-pointer"
                      : "border-white/20 text-white/30 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerOnboardingSkills;

/* ---------- Skill pill ---------- */
type SkillProps = {
  label: string;
  checked?: boolean;
  onClick?: () => void;
};

const Skill = ({ label, checked, onClick }: SkillProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full px-6 py-3 rounded-full flex items-center justify-between transition-all ${
        checked
          ? "bg-purple-600 text-white"
          : "bg-purple-900/30 text-white border border-purple-700/50"
      } hover:bg-purple-600 hover:scale-105`}
    >
      <span className="text-sm font-medium">{label}</span>
      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          checked ? "border-white bg-white" : "border-white"
        }`}
      >
        {checked && (
          <svg
            className="w-4 h-4 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
    </button>
  );
};
