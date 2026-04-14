import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

const UserOnboardingIntro = () => {
    const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/bmi");
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
      </div>

      <div className="max-w-6xl w-full bg-linear-to-b from-[#03000D] to-[#190473] rounded-3xl p-12 relative overflow-hidden min-h-[480px] flex items-center">
        {/* Background orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-800/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 w-full flex flex-col items-center text-center gap-8">

          {/* PREMIUM BADGE */}
          <div className="inline-flex items-center gap-2 border border-purple-400/40 bg-purple-500/10 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-purple-300 text-xs font-semibold uppercase tracking-widest">
              Premium Member
            </span>
          </div>

          {/* WELCOME */}
          <div className="space-y-3">
            <h1 className="text-white text-5xl font-bold leading-tight">
              Welcome,{" "}
              <span className="text-purple-400">{user?.name}</span>
            </h1>
            <p className="text-white/50 text-lg font-light max-w-xl">
              Your transformation starts here. Let's build a plan that's
              perfectly tailored to <span className="text-white/80">you</span>.
            </p>
          </div>

          {/* SLOGAN */}
          <div className="border-t border-b border-white/10 py-5 px-8 space-y-1">
            <p className="text-white/30 text-xs uppercase tracking-[0.3em] font-semibold">
              Bodometer
            </p>
            <p className="text-white text-xl font-semibold tracking-wide">
              "Track. Train. Transform."
            </p>
          </div>

          {/* STEPS PREVIEW */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {[
                "BMI",
                "Workout Type",
                "Workout goal",
                "Workout Time",
                "Health Details",
                "Daily Habits",
              "Workout History",
            ].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border border-white/20 text-white/30 text-xs flex items-center justify-center font-semibold">
                    {i + 1}
                  </span>
                  <span className="text-white/40 text-sm">{step}</span>
                </div>
                {i < 4 && (
                  <span className="text-white/15 text-xs">›</span>
                )}
              </div>
            ))}
          </div>

          {/* LET'S GO BUTTON */}
          <button
            onClick={handleStart}
            className="mt-2 border-2 border-white text-white px-12 py-3 rounded-full font-bold text-lg tracking-wide transition-all hover:bg-white hover:text-purple-900 hover:scale-105 active:scale-95"
          >
            Let's Go →
          </button>

          <p className="text-white/20 text-xs">
            Takes about 3 minutes to complete
          </p>

        </div>
      </div>
    </div>
  );
};

export default UserOnboardingIntro;