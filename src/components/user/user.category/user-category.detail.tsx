import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Dumbbell } from "lucide-react";
import userServices from "@/services/user/user.services";
import { useFetch } from "@/hooks/useFetch";

import type { CategoryDetail } from "@/interface/user.interface";
import type { ApiResponse } from "@/interface/api-response.interface";

const resolveImage = (cat: CategoryDetail): string =>
  cat.media?.image?.url ?? cat.image ?? "";

// ── Skeleton ──────────────────────────────────────────────────────────────
const DetailSkeleton = () => (
  <div className="animate-pulse">
    {/* Hero */}
    <div className="w-full rounded-2xl bg-[#140b3a] mb-8" style={{ height: "360px" }} />
    {/* Title */}
    <div className="h-8 w-1/3 bg-white/10 rounded-lg mb-4" />
    {/* Description lines */}
    <div className="space-y-3">
      <div className="h-4 w-full bg-white/10 rounded" />
      <div className="h-4 w-5/6 bg-white/10 rounded" />
      <div className="h-4 w-4/6 bg-white/10 rounded" />
    </div>
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────
const UserCategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useFetch<ApiResponse<CategoryDetail>>(
    useCallback(() => userServices.getCategoryById(id!), [id]),
    !!id
  );

  const category = data?.data ?? null;

  return (
    <div className="text-white min-h-screen max-w-4xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-purple-400 hover:text-white mb-6 transition text-sm"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Loading */}
      {loading && <DetailSkeleton />}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-24 text-red-400">
          Failed to load category. Please try again.
        </div>
      )}

      {/* Content */}
      {!loading && !error && category && (() => {
        const imgSrc = resolveImage(category);
        return (
          <>
            {/* Hero image */}
            <div
              className="relative w-full rounded-2xl overflow-hidden border border-purple-700/30 mb-8"
              style={{ height: "360px" }}
            >
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#1a0f45]">
                  <Dumbbell size={72} className="text-purple-600/30" />
                </div>
              )}

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0624]/80 via-transparent to-transparent" />

              {/* Name overlay on image */}
              <div className="absolute bottom-0 left-0 right-0 px-8 pb-7">
                <h1 className="text-4xl font-extrabold tracking-widest uppercase text-white drop-shadow-lg">
                  {category.name}
                </h1>
              </div>
            </div>

            {/* Description */}
            {category.description && (
              <div className="bg-indigo-900/40 border border-purple-800/30 rounded-2xl p-6 backdrop-blur">
                <h2 className="text-purple-300 text-xs font-semibold uppercase tracking-widest mb-3">
                  About
                </h2>
                <p className="text-white/80 text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
};

export default UserCategoryDetail;