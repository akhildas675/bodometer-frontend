import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { TRAiNER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/trainer.ui-constant.routes";
import authInitService from "@/services/auth/auth-init.service";
import { toast } from "sonner";
import { LogOut, Sparkles, ArrowRight, Award, Activity } from "lucide-react";

const TrainerOnboardingIntro = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleStart = () => {
    navigate(TRAiNER_UI_ROUTES.TRAINER_CATEGORIES);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    try {
      setIsLoggingOut(true);
      const loadingToast = toast.loading("Logging out...");
      try {
        await authInitService.logout();
      } catch (error) {
        console.error("Logout API error:", error);
      }
      toast.dismiss(loadingToast);
      toast.success("Logged out successfully");
      setTimeout(() => {
        navigate("/", { replace: true });
        setTimeout(() => {
          useAuthStore.getState().clearAuth();
        }, 150);
      }, 1500);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
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

  return (
    <div className="min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] flex flex-col items-center justify-center p-8">
      {/* TOP BAR */}
      <div className="w-full max-w-6xl mb-6 flex items-center justify-between">
        <img
          src="https://bodometer-assets.s3.eu-north-1.amazonaws.com/Bodometer+Logo+corrected+1.png"
          alt="Bodometer"
          className="h-10 object-contain"
        />
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 cursor-pointer"
        >
          <LogOut size={16} className={isLoggingOut ? "animate-spin" : ""} />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>

      <div className="max-w-6xl w-full bg-linear-to-b from-[#03000D] to-[#190473] rounded-3xl p-12 relative overflow-hidden min-h-[580px] flex items-center border border-purple-500/20 shadow-2xl">
        {/* Background orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-800/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 w-full flex flex-col items-center text-center gap-8">
          
          {/* ELITE TRAINER BADGE */}
          <div className="inline-flex items-center gap-2 border border-purple-400/40 bg-purple-500/10 rounded-full px-4 py-1.5 hover:scale-105 transition-all">
            <Sparkles size={14} className="text-purple-400 animate-pulse" />
            <span className="text-purple-300 text-xs font-semibold uppercase tracking-widest">
              Elite Trainer Partner
            </span>
          </div>

          {/* WELCOME */}
          <div className="space-y-4">
            <h1 className="text-white text-5xl font-bold leading-tight tracking-wide">
              Welcome to the Team,{" "}
              <span className="text-purple-400 font-extrabold">{user?.name || "Coach"}</span>
            </h1>
            <p className="text-white/60 text-lg font-light max-w-2xl mx-auto leading-relaxed">
              Empower others, showcase your fitness expertise, and grow your personal brand. 
              Let's complete your onboarding so you can start transforming lives.
            </p>
          </div>

          {/* SLOGAN */}
          <div className="border-t border-b border-white/10 py-5 px-8 space-y-1 my-2">
            <p className="text-white/30 text-xs uppercase tracking-[0.3em] font-semibold">
              Bodometer
            </p>
            <p className="text-white text-xl font-semibold tracking-wide italic">
              "Track. Train. Transform."
            </p>
          </div>

          {/* STEPS PREVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl text-left my-4">
            {/* STEP 1 */}
            <div className="bg-purple-950/20 border border-purple-800/30 hover:border-purple-600/50 p-6 rounded-2xl flex gap-4 transition-all duration-300 hover:scale-[1.02]">
              <div className="bg-purple-600/20 border border-purple-500/30 p-3 rounded-xl h-fit shrink-0 text-purple-400">
                <Activity size={24} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Step 1</span>
                  <span className="text-white/20">•</span>
                  <span className="text-white font-semibold">Training Specializations</span>
                </div>
                <p className="text-white/45 text-sm leading-relaxed">
                  Select the categories you specialize in (such as Strength, Cardio, Yoga, and more) to match you with correct clients.
                </p>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="bg-purple-950/20 border border-purple-800/30 hover:border-purple-600/50 p-6 rounded-2xl flex gap-4 transition-all duration-300 hover:scale-[1.02]">
              <div className="bg-purple-600/20 border border-purple-500/30 p-3 rounded-xl h-fit shrink-0 text-purple-400">
                <Award size={24} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Step 2</span>
                  <span className="text-white/20">•</span>
                  <span className="text-white font-semibold">Professional Profile</span>
                </div>
                <p className="text-white/45 text-sm leading-relaxed">
                  Provide your biography, years of training experience, upload your certificates, and configure your profile images.
                </p>
              </div>
            </div>
          </div>

          {/* LET'S GO BUTTON */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleStart}
              className="group border-2 border-white text-white px-12 py-3 rounded-full font-bold text-lg tracking-wide transition-all duration-300 hover:bg-white hover:text-[#190473] hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-950/50"
            >
              Start Onboarding
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-white/30 text-xs tracking-wider">
              Takes approximately 2–3 minutes to complete
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TrainerOnboardingIntro;
