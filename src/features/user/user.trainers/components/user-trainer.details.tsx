import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { trainerService } from "@/modules/trainer/service/trainer.service";
import { subscriptionService } from "@/modules/subscription/service/subscription.service";
import { USER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/user.ui-constant.routes";
import { TrainerDetail, TrainerListItem } from "@/interface/trainer.interface";
import {
  Dumbbell,
  ArrowLeft,
  Clock,
  Loader2,
  Sparkles,
  ShieldCheck,
  Award,
  CheckCircle2,
  CalendarDays,
  UserCheck,
  ChevronRight,
} from "lucide-react";

const UserTrainerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState<TrainerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingSub, setCheckingSub] = useState(false);
  const [recommendedTrainers, setRecommendedTrainers] = useState<TrainerListItem[]>([]);
  const [loadingRecommended, setLoadingRecommended] = useState(false);

  // 1. Fetch trainer whenever URL parameter id changes
  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setLoading(true);
    setTrainer(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

    trainerService
      .getTrainerById(id)
      .then((res) => {
        if (isMounted && res?.data) {
          setTrainer(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load trainer details:", err);
        if (isMounted) setTrainer(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // 2. Fetch recommended trainers sharing at least 1 skill
  useEffect(() => {
    if (!trainer) return;

    let isMounted = true;
    setLoadingRecommended(true);

    trainerService
      .getTrainers<TrainerListItem>({ limit: 50 })
      .then((res) => {
        if (!isMounted || !res?.data) return;

        const currentId = trainer._id;
        const currentSkillIds = new Set(
          trainer.specializations?.map((s) => s._id) || [],
        );
        const currentSkillNames = new Set(
          trainer.specializations?.map((s) => s.name?.toLowerCase().trim()) || [],
        );

        const otherTrainers = res.data.filter(
          (t) => t._id !== currentId && t.profileId !== currentId,
        );

        const skillMatches = otherTrainers.filter((t) =>
          t.specializations?.some(
            (s) =>
              currentSkillIds.has(s._id) ||
              currentSkillNames.has(s.name?.toLowerCase().trim()),
          ),
        );

        const finalRecommendations =
          skillMatches.length > 0 ? skillMatches : otherTrainers;

        setRecommendedTrainers(finalRecommendations.slice(0, 6));
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoadingRecommended(false);
      });

    return () => {
      isMounted = false;
    };
  }, [trainer]);

  const handleBookSession = async () => {
    if (!trainer) return;
    setCheckingSub(true);
    try {
      const res = await subscriptionService.getActiveSubscription();
      if (res?.data) {
        navigate(`/trainers/${trainer._id}/book`);
      } else {
        toast.error("Active subscription required to book a session. Redirecting to subscription plans...");
        navigate(USER_UI_ROUTES.USER_SUBSCRIPTIONS);
      }
    } catch {
      toast.error("Active subscription required to book a session. Redirecting to subscription plans...");
      navigate(USER_UI_ROUTES.USER_SUBSCRIPTIONS);
    } finally {
      setCheckingSub(false);
    }
  };

  return (
    <div className="text-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Navigation Back */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 px-4 py-2 rounded-xl transition duration-200 cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Trainers
      </button>

      {loading ? (
        <div className="space-y-6 animate-pulse max-w-5xl mx-auto">
          <div className="h-64 bg-white/5 rounded-3xl" />
          <div className="h-48 bg-white/5 rounded-3xl" />
        </div>
      ) : !trainer ? (
        <div className="p-16 text-center bg-[#0a0520]/80 rounded-3xl border border-white/10 text-purple-300">
          <UserCheck className="mx-auto text-purple-400 mb-3" size={48} />
          <h2 className="text-xl font-bold text-white mb-1">Trainer Not Found</h2>
          <p className="text-xs text-white/50">The trainer profile you are looking for does not exist or has been removed.</p>
        </div>
      ) : (
        <>
          {/* Hero Banner Card */}
          <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl bg-[#060214]">
            {/* Cover Banner */}
            <div className="relative h-64 sm:h-80 md:h-96 w-full">
              {trainer.coverPhoto ? (
                <img
                  src={trainer.coverPhoto}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-purple-950 via-indigo-950 to-[#060214]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#09041a] via-[#09041a]/60 to-transparent" />
            </div>

            {/* Profile Info Row */}
            <div className="relative px-6 sm:px-10 pb-8 -mt-20 sm:-mt-24 z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                {/* Avatar + Main Details */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                  <div className="relative group">
                    <img
                      src={trainer.profilePic || "https://via.placeholder.com/150"}
                      alt={trainer.name}
                      className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-[#09041a] shadow-2xl shadow-purple-600/30 ring-4 ring-purple-500/40"
                    />
                    <span className="absolute bottom-2 right-2 bg-emerald-500 text-black p-1.5 rounded-full ring-4 ring-[#09041a]" title="Verified Trainer">
                      <ShieldCheck size={16} />
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                        {trainer.name}
                      </h1>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold">
                        <ShieldCheck size={13} />
                        Certified Coach
                      </span>
                    </div>

                    {/* Quick Badges */}
                    <div className="flex items-center gap-4 text-xs sm:text-sm text-white/70 flex-wrap">
                      <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                        <Clock size={15} className="text-purple-400" />
                        <span className="font-semibold text-white">{trainer.experienceInYears} Years</span>
                        <span className="text-white/40">Experience</span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                        <Award size={15} className="text-indigo-400" />
                        <span className="font-semibold text-white">{trainer.specializations?.length || 0}</span>
                        <span className="text-white/40">Specializations</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary CTA Button */}
                <div className="w-full md:w-auto">
                  <button
                    onClick={handleBookSession}
                    disabled={checkingSub}
                    className="w-full md:w-auto bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-3"
                  >
                    {checkingSub ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <CalendarDays size={20} />
                    )}
                    <span>Book Coaching Session</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <div className="bg-[#0a0520]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                <h2 className="text-lg font-bold text-white uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <Sparkles size={18} />
                  About Coach
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                  {trainer.bio || "This trainer has not provided a detailed bio yet. Book a session to consult directly!"}
                </p>
              </div>

              {/* Specializations Section */}
              {trainer.specializations && trainer.specializations.length > 0 && (
                <div className="bg-[#0a0520]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider text-purple-400 flex items-center gap-2">
                    <Dumbbell size={18} />
                    Specializations & Skills
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {trainer.specializations.map((spec) => (
                      <div
                        key={spec._id}
                        className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/20 hover:border-purple-500/40 rounded-2xl transition duration-200"
                      >
                        <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300 shrink-0">
                          <Dumbbell size={16} />
                        </div>
                        <span className="text-sm font-semibold text-white truncate">
                          {spec.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Column: Highlights */}
            <div className="space-y-6">
              <div className="bg-[#0a0520]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-5 shadow-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="text-emerald-400" size={20} />
                  Coaching Highlights
                </h3>

                <div className="space-y-4 text-xs sm:text-sm text-white/80">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">1-on-1 Personalized Session</p>
                      <p className="text-xs text-white/50">Tailored workout & fitness plan</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Verified Qualifications</p>
                      <p className="text-xs text-white/50">{trainer.experienceInYears}+ Years Certified Experience</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Flexible Cancellation Policy</p>
                      <p className="text-xs text-white/50">Instant wallet credit on cancellation</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={handleBookSession}
                    disabled={checkingSub}
                    className="w-full bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Check Available Slots</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Trainers Section */}
          <div className="pt-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
                  <Sparkles className="text-purple-400" size={24} />
                  Recommended Trainers (Same Skill)
                </h2>
                <p className="text-xs sm:text-sm text-white/50 mt-1">
                  Trainers sharing expertise in {trainer.specializations?.map((s) => s.name).join(", ") || "coaching"}
                </p>
              </div>
            </div>

            {loadingRecommended ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                <div className="h-44 bg-white/5 rounded-3xl" />
                <div className="h-44 bg-white/5 rounded-3xl" />
                <div className="h-44 bg-white/5 rounded-3xl" />
              </div>
            ) : recommendedTrainers.length === 0 ? (
              <p className="text-xs text-white/40 italic">No other trainers currently available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedTrainers.map((rt) => {
                  const targetId = rt.profileId || rt._id;
                  const sharedSkills = rt.specializations?.filter((s) =>
                    trainer.specializations?.some(
                      (ts) => ts._id === s._id || ts.name.toLowerCase() === s.name.toLowerCase(),
                    ),
                  ) || [];

                  return (
                    <div
                      key={targetId}
                      onClick={() => navigate(`/trainers/${targetId}`)}
                      className="group relative rounded-3xl overflow-hidden bg-[#0a0520]/80 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-purple-900/30 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={rt.profilePic || "https://via.placeholder.com/64"}
                            alt={rt.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/30 group-hover:border-purple-400 shadow-md shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h3 className="text-white text-lg font-bold truncate group-hover:text-purple-300 transition">
                              {rt.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-purple-400 text-xs mt-0.5 font-medium">
                              <Clock size={13} />
                              <span>{rt.experienceInYears} Yrs Experience</span>
                            </div>
                          </div>
                        </div>

                        {sharedSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {sharedSkills.map((sk) => (
                              <span
                                key={sk._id}
                                className="text-[10px] font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-300 px-2.5 py-1 rounded-full"
                              >
                                {sk.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-purple-400 font-semibold group-hover:text-white transition">
                        <span>View Trainer Profile</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserTrainerDetails;
