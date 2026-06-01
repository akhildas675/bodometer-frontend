import React from "react";
import { Activity } from "lucide-react";

const UserWorkoutProgression = () => {
  return (
    <div className="max-w-7xl mx-auto text-white w-full px-4 md:px-8 py-6 space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wide bg-linear-to-r from-white to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <Activity className="w-8 h-8 text-purple-400" />
            Workout Progression
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Track your fitness milestones and analyze your growth over time.
          </p>
        </div>
      </div>

      {/* ── Content Container ── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
        <p className="text-white/40 italic">
          Progression analytics will be implemented here.
        </p>
      </div>
    </div>
  );
};

export default UserWorkoutProgression;
