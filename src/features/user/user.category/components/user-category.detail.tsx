import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Dumbbell, Sparkles, Clock, ChevronRight, UserCheck, FolderHeart } from "lucide-react";
import { CategoryDetail, CategoryListItem } from "@/modules/category/types/category.interface";
import { TrainerListItem } from "@/interface/trainer.interface";
import { categoryService } from "@/modules/category/service/category.service";
import { trainerService } from "@/modules/trainer/service/trainer.service";

const resolveImage = (cat: CategoryDetail | CategoryListItem): string =>
  cat.media?.image?.url ?? cat.image ?? "";

const UserCategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [trainers, setTrainers] = useState<TrainerListItem[]>([]);
  const [loadingTrainers, setLoadingTrainers] = useState(false);

  const [recommendedCategories, setRecommendedCategories] = useState<CategoryListItem[]>([]);
  const [loadingRecommended, setLoadingRecommended] = useState(false);

  // 1. Fetch current Category details when URL param id changes
  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setLoading(true);
    setCategory(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

    categoryService
      .getCategoryById(id)
      .then((res) => {
        if (isMounted && res?.data) {
          setCategory(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load category:", err);
        if (isMounted) setError("Category not found.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // 2. Fetch Trainers specializing in this Category & Recommended Categories
  useEffect(() => {
    if (!category || !id) return;

    let isMounted = true;
    setLoadingTrainers(true);
    setLoadingRecommended(true);

    const catNameLower = category.name.toLowerCase().trim();
    const catId = category.categoryId || ((category as unknown as Record<string, unknown>)._id as string) || id;

    // Fetch trainers
    trainerService
      .getTrainers<TrainerListItem>({ limit: 50 })
      .then((res) => {
        if (!isMounted || !res?.data) return;
        const matchingTrainers = res.data.filter((t) =>
          t.specializations?.some(
            (s) =>
              s._id === catId ||
              s.name?.toLowerCase().trim() === catNameLower
          )
        );
        setTrainers(matchingTrainers.length > 0 ? matchingTrainers : res.data.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoadingTrainers(false);
      });

    // Fetch recommended categories
    categoryService
      .getCategories({ limit: 12 })
      .then((res) => {
        if (!isMounted || !res?.data) return;
        const otherCats = res.data.filter(
          (c) => (c.categoryId || c._id) !== catId && c.name.toLowerCase().trim() !== catNameLower
        );
        setRecommendedCategories(otherCats.slice(0, 6));
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoadingRecommended(false);
      });

    return () => {
      isMounted = false;
    };
  }, [category, id]);

  return (
    <div className="text-white min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Navigation Back */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 px-4 py-2 rounded-xl transition duration-200 cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Categories
      </button>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-64 sm:h-80 bg-white/5 rounded-3xl" />
          <div className="h-32 bg-white/5 rounded-3xl" />
        </div>
      ) : error || !category ? (
        <div className="p-16 text-center bg-[#0a0520]/80 rounded-3xl border border-white/10 text-purple-300">
          <UserCheck className="mx-auto text-purple-400 mb-3" size={48} />
          <h2 className="text-xl font-bold text-white mb-1">Category Not Found</h2>
          <p className="text-xs text-white/50">The requested category could not be located.</p>
        </div>
      ) : (
        <>
          {/* Hero Banner */}
          {(() => {
            const imgSrc = resolveImage(category);
            return (
              <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl bg-[#060214]">
                <div className="relative h-64 sm:h-80 md:h-96 w-full">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-950 via-indigo-950 to-[#060214]">
                      <Dumbbell size={80} className="text-purple-500/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09041a] via-[#09041a]/60 to-transparent" />
                </div>

                <div className="relative px-6 sm:px-10 pb-8 -mt-20 sm:-mt-24 z-10 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold">
                    <Sparkles size={14} />
                    Category Details
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase">
                    {category.name}
                  </h1>
                </div>
              </div>
            );
          })()}

          {/* Description Section */}
          {category.description && (
            <div className="bg-[#0a0520]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <FolderHeart size={18} />
                About {category.name}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                {category.description}
              </p>
            </div>
          )}

          {/* Trainers in this Category Section */}
          <div className="space-y-6 pt-4">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
                <Dumbbell className="text-purple-400" size={24} />
                Trainers Specializing in {category.name}
              </h2>
              <p className="text-xs sm:text-sm text-white/50 mt-1">
                Book 1-on-1 sessions with expert coaches experienced in {category.name}
              </p>
            </div>

            {loadingTrainers ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                <div className="h-44 bg-white/5 rounded-3xl" />
                <div className="h-44 bg-white/5 rounded-3xl" />
              </div>
            ) : trainers.length === 0 ? (
              <p className="text-xs text-white/40 italic">No trainers currently assigned to this category.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainers.map((t) => {
                  const targetId = t.profileId || t._id;
                  return (
                    <div
                      key={targetId}
                      onClick={() => navigate(`/trainers/${targetId}`)}
                      className="group relative rounded-3xl overflow-hidden bg-[#0a0520]/80 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-purple-900/30 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={t.profilePic || "https://via.placeholder.com/64"}
                            alt={t.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/30 group-hover:border-purple-400 shadow-md shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h3 className="text-white text-lg font-bold truncate group-hover:text-purple-300 transition">
                              {t.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-purple-400 text-xs mt-0.5 font-medium">
                              <Clock size={13} />
                              <span>{t.experienceInYears} Yrs Experience</span>
                            </div>
                          </div>
                        </div>

                        {t.specializations && t.specializations.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {t.specializations.slice(0, 3).map((sk) => (
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
                        <span>View Profile & Book</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recommended Categories Section */}
          <div className="space-y-6 pt-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
                <Sparkles className="text-purple-400" size={24} />
                Recommended Categories
              </h2>
              <p className="text-xs sm:text-sm text-white/50 mt-1">
                Explore other fitness categories tailored to your goals
              </p>
            </div>

            {loadingRecommended ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                <div className="h-36 bg-white/5 rounded-3xl" />
                <div className="h-36 bg-white/5 rounded-3xl" />
              </div>
            ) : recommendedCategories.length === 0 ? (
              <p className="text-xs text-white/40 italic">No other categories available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedCategories.map((rc) => {
                  const targetCatId = rc.categoryId || rc._id;
                  const catImg = resolveImage(rc);

                  return (
                    <div
                      key={targetCatId}
                      onClick={() => navigate(`/categories/${targetCatId}`)}
                      className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/50 bg-[#0a0520]/80 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-purple-900/30 flex flex-col justify-between"
                      style={{ minHeight: "180px" }}
                    >
                      {catImg ? (
                        <img
                          src={catImg}
                          alt={rc.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#150a38]">
                          <Dumbbell size={48} className="text-purple-600/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#09041a] via-[#09041a]/70 to-transparent" />

                      <div className="relative z-10 p-5 flex flex-col justify-end h-full mt-12">
                        <h3 className="text-white font-extrabold text-lg uppercase tracking-wider group-hover:text-purple-300 transition">
                          {rc.name}
                        </h3>
                        {rc.description && (
                          <p className="text-white/60 text-xs mt-1 line-clamp-1">
                            {rc.description}
                          </p>
                        )}
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

export default UserCategoryDetail;
