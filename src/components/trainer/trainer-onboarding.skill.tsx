import React, { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import type { WorkoutList } from "../../interface/trainer.interface";
import trainerService from "../../services/trainer/trainer.service";

const TrainerOnboardingSkills = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "Strength Training",
    "Functional Fitness",
    "Cardio",
    "Core & Stability",
    "Pilates & Control"
  ]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const {data:workoutList,loading,refetch}=useFetch<WorkoutList[]>(()=>trainerService.workoutList().then((res)=>res.data))

  useEffect(()=>{
    refetch()
  },[])

  console.log("Workout list",workoutList)
  if(!loading) return null



  return (
    <div className="min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] flex items-center justify-center p-8">
      <div className="max-w-6xl w-full bg-linear-to-b from-[#03000D] to-[#190473]] rounded-3xl p-12 relative overflow-hidden">
        {/* Background circles */}
       

        <div className="flex items-center gap-16 relative z-10">
          {/* LEFT IMAGE */}
          <div className="flex-shrink-0 relative">
            <div className="w-80 h-80 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-full flex items-end justify-center overflow-hidden">
              <img 
                src="/api/placeholder/320/400" 
                alt="Trainers"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1">
            {/* TITLE */}
            <h1 className="text-white text-3xl font-bold mb-12 text-center">
              WHAT KIND OF SKILLS YOU HAVE?
            </h1>

            {/* SKILLS GRID */}
            <div className="grid grid-cols-2 gap-6 mb-12">
              {/* LEFT COLUMN */}
              <div className="space-y-4">
                <Skill 
                  label="Strength Training" 
                  checked={selectedSkills.includes("Strength Training")}
                  onClick={() => toggleSkill("Strength Training")}
                />
                <Skill 
                  label="Yoga & Flexibility" 
                  checked={selectedSkills.includes("Yoga & Flexibility")}
                  onClick={() => toggleSkill("Yoga & Flexibility")}
                />
                <Skill 
                  label="Functional Fitness" 
                  checked={selectedSkills.includes("Functional Fitness")}
                  onClick={() => toggleSkill("Functional Fitness")}
                />
                <Skill 
                  label="Cardio" 
                  checked={selectedSkills.includes("Cardio")}
                  onClick={() => toggleSkill("Cardio")}
                />
                <Skill 
                  label="Bodyweight" 
                  checked={selectedSkills.includes("Bodyweight")}
                  onClick={() => toggleSkill("Bodyweight")}
                />
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-4">
                <Skill 
                  label="Mind-Body Balance" 
                  checked={selectedSkills.includes("Mind-Body Balance")}
                  onClick={() => toggleSkill("Mind-Body Balance")}
                />
                <Skill 
                  label="Core & Stability" 
                  checked={selectedSkills.includes("Core & Stability")}
                  onClick={() => toggleSkill("Core & Stability")}
                />
                <Skill 
                  label="Mobility & Stretch" 
                  checked={selectedSkills.includes("Mobility & Stretch")}
                  onClick={() => toggleSkill("Mobility & Stretch")}
                />
                <Skill 
                  label="HIIT & Power Burn" 
                  checked={selectedSkills.includes("HIIT & Power Burn")}
                  onClick={() => toggleSkill("HIIT & Power Burn")}
                />
                <Skill 
                  label="Pilates & Control" 
                  checked={selectedSkills.includes("Pilates & Control")}
                  onClick={() => toggleSkill("Pilates & Control")}
                />
              </div>
            </div>

            {/* BOTTOM SECTION */}
            <div className="flex items-center justify-between">
              {/* DOTS */}
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              </div>

              {/* NEXT BUTTON */}
              <button className="bg-transparent border-2 border-white text-white px-8 py-2 rounded-full hover:bg-white hover:text-purple-900 transition-all font-semibold">
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