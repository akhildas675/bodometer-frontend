import React from "react";
import { useNavigate } from "react-router-dom";

const TrainerOnboardingAbout = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#050017] flex items-center justify-center">
      <div className="relative w-full max-w-6xl h-[600px] rounded-3xl overflow-hidden flex bg-gradient-to-br from-[#04001a] via-[#07002a] to-[#12043b]">

        {/* LEFT IMAGE SECTION */}
        <div className="w-1/2 hidden md:flex items-center justify-center relative">
          {/* big background circle */}
          <div className="absolute w-[520px] h-[520px] rounded-full bg-[#2d1b6a]" />

          <img
            src="https://images.unsplash.com/photo-1599058917212-d750089bc07a"
            alt="trainer"
            className="relative z-10 h-[520px] object-contain"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 relative flex items-center justify-center px-12 text-white">
          {/* background circles */}
          <div className="absolute -top-40 -right-40 w-[420px] h-[420px] rounded-full bg-[#2d1b6a] opacity-40" />
          <div className="absolute bottom-[-200px] right-[80px] w-[460px] h-[460px] rounded-full bg-[#24116b] opacity-40" />

          <div className="relative z-10 w-full max-w-xl">
            {/* TITLE */}
            <h1 className="text-center text-xl font-semibold tracking-widest mb-3">
              TELL US ABOUT YOU
            </h1>
            <p className="text-center text-xs text-slate-300 mb-8">
              Help us personalize your experience by filling out your basic details.
            </p>

            {/* PROFILE IMAGE */}
            <div className="flex justify-center mb-10">
              <div className="relative h-24 w-24 rounded-full border-2 border-purple-500 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1599058917212-d750089bc07a"
                  alt="profile"
                  className="h-20 w-20 rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center text-xs">
                  ✎
                </div>
              </div>
            </div>

            {/* INPUTS */}
            <div className="space-y-5 mb-10">
              <div className="bg-[#1c255f] rounded-lg px-5 py-3 text-sm text-slate-300">
                Date of Birth
              </div>

              <div className="bg-[#1c255f] rounded-lg px-5 py-3 text-sm text-slate-300">
                Gender
              </div>
            </div>

            {/* UPDATE BUTTON */}
            <button className="w-full mb-8 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#a855f7] py-3 text-sm font-semibold shadow-lg shadow-purple-900/50">
              Update
            </button>

            {/* STEPPER */}
            <div className="flex justify-center gap-2 mb-6">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
            </div>

            {/* NEXT */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/trainer/onboarding-skill")}
                className="text-xs text-indigo-300 px-4 py-1 rounded-full bg-[#1c1550] hover:bg-[#2a2075] transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrainerOnboardingAbout;