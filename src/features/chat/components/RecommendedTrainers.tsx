import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";
import { trainerService } from "@/features/trainer/services/trainer.service";
import { TrainerListItem } from "@/features/trainer/types/trainer.types";
import { USER_UI_ROUTES } from "@/constants/routes/user.routes";

const FALLBACK_TRAINERS: Array<{
  _id: string;
  profileId: string;
  name: string;
  role: string;
  rating: string;
  reviewsCount: number;
  profilePic: string;
}> = [
  {
    _id: "rec-1",
    profileId: "sarah-johnson",
    name: "Sarah Johnson",
    role: "Strength Coach",
    rating: "4.9",
    reviewsCount: 120,
    profilePic:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=600&auto=format&fit=crop",
  },
  {
    _id: "rec-2",
    profileId: "mike-rodriguez",
    name: "Mike Rodriguez",
    role: "HIIT Specialist",
    rating: "4.8",
    reviewsCount: 98,
    profilePic:
      "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=600&auto=format&fit=crop",
  },
  {
    _id: "rec-3",
    profileId: "emma-davis",
    name: "Emma Davis",
    role: "Yoga Instructor",
    rating: "4.9",
    reviewsCount: 145,
    profilePic:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
  },
  {
    _id: "rec-4",
    profileId: "chris-wilson",
    name: "Chris Wilson",
    role: "Nutrition Coach",
    rating: "4.7",
    reviewsCount: 87,
    profilePic:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
  },
];

export const RecommendedTrainers: React.FC = () => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState<TrainerListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    trainerService
      .getTrainers<TrainerListItem>({ page: 1, limit: 4 })
      .then((res) => {
        if (!isMounted) return;
        if (res.data && res.data.length > 0) {
          setTrainers(res.data.slice(0, 4));
        }
      })
      .catch((err) => {
        console.warn("Could not load dynamic recommended trainers:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleViewProfile = (profileId: string) => {
    navigate(`/trainers/${profileId}`);
  };

  const handleViewAll = () => {
    navigate(USER_UI_ROUTES.USER_TRAINERS);
  };

  const displayList =
    trainers.length > 0
      ? trainers.map((t, idx) => ({
          _id: t._id || `t-${idx}`,
          profileId: t.profileId || t._id,
          name: t.name,
          role:
            t.specializations?.[0]?.name ||
            (t.experienceInYears
              ? `${t.experienceInYears}+ Yrs Coach`
              : "Certified Coach"),
          rating: (4.7 + (idx % 3) * 0.1).toFixed(1),
          reviewsCount: 85 + idx * 23,
          profilePic:
            t.profilePic ||
            t.coverPhoto ||
            FALLBACK_TRAINERS[idx % FALLBACK_TRAINERS.length].profilePic,
        }))
      : FALLBACK_TRAINERS;

  return (
    <div className="w-full mt-8">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Recommended Trainers
          </h3>
          <p className="text-xs text-white/50 mt-0.5">
            Get personalized training from expert coaches
          </p>
        </div>

        <button
          onClick={handleViewAll}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1c1240] hover:bg-purple-700/40 text-purple-300 hover:text-white border border-purple-500/30 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          <span>View All Trainers</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && trainers.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-[#0d072b]/95 p-3 space-y-3 animate-pulse"
              >
                <div className="h-44 w-full rounded-xl bg-white/5" />
                <div className="h-4 bg-white/10 rounded w-2/3" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
                <div className="h-8 bg-white/5 rounded-lg mt-2" />
              </div>
            ))
          : displayList.map((trainer) => (
              <div
                key={trainer._id}
                className="bg-[#0d072b]/95 border border-white/10 hover:border-purple-500/40 rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col justify-between shadow-lg hover:-translate-y-0.5"
              >
                {/* Photo */}
                <div className="h-44 w-full relative overflow-hidden bg-purple-950/30">
                  <img
                    src={trainer.profilePic}
                    alt={trainer.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d072b] via-transparent to-transparent opacity-80" />
                </div>

                {/* Details */}
                <div className="p-4 pt-2 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h4 className="text-white font-bold text-sm truncate">
                      {trainer.name}
                    </h4>
                    <p className="text-xs text-white/50 truncate mt-0.5">
                      {trainer.role}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
                    <div className="flex items-center gap-1 text-xs text-white/70 font-medium">
                      <Star
                        size={13}
                        className="text-amber-400 fill-amber-400 shrink-0"
                      />
                      <span>{trainer.rating}</span>
                      <span className="text-white/40">
                        ({trainer.reviewsCount})
                      </span>
                    </div>

                    <button
                      onClick={() => handleViewProfile(trainer.profileId)}
                      className="px-3 py-1.5 bg-[#1c1240] hover:bg-purple-600 text-white text-xs font-semibold rounded-lg border border-white/10 transition cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};
