import React, { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import type { WorkoutList } from "../../interface/trainer.interface";
import trainerService from "../../services/trainer/trainer.service";
import { useNavigate } from "react-router-dom";

const TrainerOnboardingSkills = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const navigate=useNavigate()

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(s => s !== skillId)
        : [...prev, skillId]
    );
  };

  const { data: workoutList, loading, refetch } = useFetch<WorkoutList[]>(
    () => trainerService.workoutList().then((res) => res.data)
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  console.log("Workout list", workoutList);


  if (loading && !workoutList) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#03000D] to-[#190473] flex items-center justify-center">
        <div className="text-white text-xl">Loading workouts...</div>
      </div>
    );
  }


  if (!workoutList || workoutList.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#03000D] to-[#190473] flex items-center justify-center">
        <div className="text-white text-xl">No workouts available</div>
      </div>
    );
  }

  // Split workouts into two columns
  const midPoint = Math.ceil(workoutList.length / 2);
  const leftColumn = workoutList.slice(0, midPoint);
  const rightColumn = workoutList.slice(midPoint);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#03000D] to-[#190473] flex items-center justify-center p-8">
      <div className="max-w-6xl w-full bg-gradient-to-b from-[#03000D] to-[#190473] rounded-3xl p-12 relative overflow-hidden">
        {/* Background circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="flex items-center gap-16 relative z-10">
          {/* LEFT IMAGE */}
          {/* <div className="flex-shrink-0 relative">
            <div className="w-80 h-80 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-full flex items-end justify-center overflow-hidden">
              <img 
                src="/api/placeholder/320/400" 
                alt="Trainers"
                className="w-full h-full object-cover"
              />
            </div>
          </div> */}

          {/* RIGHT CONTENT */}
          <div className="flex-1">
            {/* TITLE */}
            <h1 className="text-white text-3xl font-bold mb-12 text-center">
              WHAT KIND OF SKILLS YOU HAVE?
            </h1>

            {/* SKILLS GRID - Dynamic from API */}
            <div className="grid grid-cols-2 gap-6 mb-12">
              {/* LEFT COLUMN */}
              <div className="space-y-4">
                {leftColumn.map((workout) => (
                  <Skill
                    key={workout.id}
                    label={workout.workoutName}
                    checked={selectedSkills.includes(workout.id)}
                    onClick={() => toggleSkill(workout.id)}
                  />
                ))}
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-4">
                {rightColumn.map((workout) => (
                  <Skill
                    key={workout.id}
                    label={workout.workoutName}
                    checked={selectedSkills.includes(workout.id)}
                    onClick={() => toggleSkill(workout.id)}
                  />
                ))}
              </div>
            </div>

            {/* BOTTOM SECTION */}
            <div className="flex items-center justify-between">
              {/* DOTS */}
              <div className="flex gap-2">
                
              </div>

              {/* NEXT BUTTON */}
              <button 
                className="bg-transparent border-2 border-white text-white px-8 py-2 rounded-full hover:bg-white hover:text-purple-900 transition-all font-semibold"
               onClick={() => navigate("/trainer/onboarding-experience")}
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
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
        checked ? "border-white bg-white" : "border-white"
      }`}>
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