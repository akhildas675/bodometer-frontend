import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userServices from "@/services/user/user.services";
import type { TrainerDetail } from "@/interface/user.interface";
import { Dumbbell, ArrowLeft, Clock } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import type { ApiResponse } from "@/interface/api-response.interface";

const UserTrainerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();


  const { data, loading, refetch } = useFetch<ApiResponse<TrainerDetail>>(
    useCallback(() => userServices.getTrainerById(id!), [id]),
    !!id,
  );

  useEffect(() => {
    if (id) {
      refetch();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id, refetch]);

  const trainer = data?.data ?? null;

  return (
   
      <div className="text-white max-w-3xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-400 hover:text-white text-sm mb-6 transition"
        >
          <ArrowLeft size={16} />
          Back to Trainers
        </button>

        {loading ? (
          <div className="text-center text-purple-300 py-20">Loading...</div>
        ) : !trainer ? (
          <div className="text-center text-purple-300 py-20">
            Trainer not found.
          </div>
        ) : (
          <>
            <div className="bg-[#0d0b1f] border border-white/5 rounded-2xl overflow-hidden">
            {/* Cover Photo */}
            <div className="relative h-48 w-full">
              {trainer.coverPhoto ? (
                <img
                  src={trainer.coverPhoto}
                  alt="cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-r from-[#1a0f3c] to-[#0a0624]" />
              )}
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Profile Pic overlapping cover */}
            <div className="relative px-6">
              <div className="-mt-10 mb-4">
                <img
                  src={trainer.profilePic || "https://via.placeholder.com/80"}
                  alt={trainer.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-[#0d0b1f] shadow-lg"
                />
              </div>

              {/* Name + Experience */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-white text-2xl font-bold">
                    {trainer.name}
                  </h1>
                  <div className="flex items-center gap-1 text-purple-400 text-sm mt-1">
                    <Clock size={13} />
                    <span>
                      {trainer.experienceInYears} yr
                      {trainer.experienceInYears !== 1 ? "s" : ""} experience
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/trainers/${trainer._id}/book`)}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition mt-1"
                >
                  Book Session
                </button>
              </div>

              {/* Bio */}
              {trainer.bio && (
                <div className="mb-5">
                  <h2 className="text-white/60 text-xs uppercase tracking-widest mb-2">
                    About
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {trainer.bio}
                  </p>
                </div>
              )}

              {/* Specializations */}
              {trainer.specializations.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-white/60 text-xs uppercase tracking-widest mb-2">
                    Specializations
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {trainer.specializations.map((spec) => (
                      <span
                        key={spec._id}
                        className="flex items-center gap-1.5 px-3 py-1 bg-indigo-900/60 text-indigo-300 rounded-full text-sm"
                      >
                        <Dumbbell size={11} />
                        {spec.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Related Trainers */}
          {trainer.relatedTrainers && trainer.relatedTrainers.length > 0 && (
            <div className="mt-10 mb-10">
              <h2 className="text-white/80 text-xl font-bold tracking-wide mb-6">
                Related Trainers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {trainer.relatedTrainers.map((rt) => (
                  <div 
                    key={rt._id}
                    onClick={() => navigate(`/trainers/${rt._id}`)}
                    className="flex items-center gap-4 p-4 bg-[#0d0b1f] hover:bg-[#13102b] rounded-2xl border border-white/5 hover:border-purple-500/40 cursor-pointer transition-all shadow-md hover:shadow-purple-900/20 hover:-translate-y-1"
                  >
                    <img 
                      src={rt.profilePic || "https://via.placeholder.com/64"}
                      alt={rt.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#2a264f]"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white text-lg font-bold truncate">{rt.name}</h3>
                      <div className="flex items-center gap-1.5 text-purple-400 text-sm mt-1">
                        <Clock size={14} />
                        <span>{rt.experienceInYears} yrs experience</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          </>
        )}
      </div>
   
  );
};

export default UserTrainerDetails;