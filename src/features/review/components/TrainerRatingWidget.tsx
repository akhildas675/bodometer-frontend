import React, { useEffect, useState } from "react";
import { Star, Award } from "lucide-react";
import { RatingStars } from "./RatingStars";
import { RatingSummary } from "../types/review.types";
import { reviewService } from "../services/review.service";

interface TrainerRatingWidgetProps {
  summary?: RatingSummary;
  trainerId?: string;
  isOwnTrainer?: boolean;
  className?: string;
  loading?: boolean;
}

const DEFAULT_SUMMARY: RatingSummary = {
  averageRating: 0,
  totalReviews: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

export const TrainerRatingWidget: React.FC<TrainerRatingWidgetProps> = ({
  summary: externalSummary,
  trainerId,
  isOwnTrainer = false,
  className = "",
  loading: externalLoading = false,
}) => {
  const [internalSummary, setInternalSummary] = useState<RatingSummary | null>(null);
  const [internalLoading, setInternalLoading] = useState<boolean>(
    Boolean((trainerId || isOwnTrainer) && !externalSummary)
  );

  useEffect(() => {
    if (!externalSummary && (trainerId || isOwnTrainer)) {
      let isMounted = true;
      setInternalLoading(true);
      const fetchPromise = isOwnTrainer
        ? reviewService.getMyTrainerSummary()
        : reviewService.getTrainerSummary(trainerId!);

      fetchPromise
        .then((res: RatingSummary) => {
          if (isMounted) setInternalSummary(res);
        })
        .catch(() => {
          if (isMounted) setInternalSummary(DEFAULT_SUMMARY);
        })
        .finally(() => {
          if (isMounted) setInternalLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [externalSummary, trainerId, isOwnTrainer]);

  const summary = externalSummary || internalSummary || DEFAULT_SUMMARY;
  const loading = externalLoading || internalLoading;
  const { averageRating, totalReviews, distribution } = summary;

  if (loading) {
    return (
      <div className={`p-6 rounded-3xl bg-white/[0.02] border border-white/10 animate-pulse space-y-4 ${className}`}>
        <div className="h-6 w-32 bg-white/10 rounded-lg" />
        <div className="h-10 w-24 bg-white/10 rounded-xl" />
        <div className="space-y-2 pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 w-full bg-white/5 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  const starLevels: Array<1 | 2 | 3 | 4 | 5> = [5, 4, 3, 2, 1];

  return (
    <div
      className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#120a2e] to-[#09041a] border border-purple-500/20 shadow-xl shadow-purple-950/40 space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400">
            <Award size={16} />
          </span>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Client Reviews & Ratings
          </h3>
        </div>
        <span className="text-xs text-white/50">
          {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
        </span>
      </div>

      {/* Main Rating Score Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
          </span>
          <div className="space-y-1">
            <RatingStars rating={averageRating} size={16} />
            <p className="text-[11px] text-white/50">
              {totalReviews > 0
                ? `Based on ${totalReviews} verified session${totalReviews > 1 ? "s" : ""}`
                : "No reviews yet"}
            </p>
          </div>
        </div>

        {totalReviews > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold self-start sm:self-center">
            <span>{Math.round(((distribution[5] + distribution[4]) / totalReviews) * 100)}% positive rating</span>
          </div>
        )}
      </div>

      {/* 5-Star Distribution Breakdown */}
      <div className="space-y-2.5">
        {starLevels.map((stars) => {
          const count = distribution[stars] || 0;
          const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

          return (
            <div key={stars} className="flex items-center gap-3 text-xs">
              {/* Star Label */}
              <div className="flex items-center gap-1 w-10 shrink-0 text-white/70 font-semibold">
                <span>{stars}</span>
                <Star size={12} className="fill-amber-400 text-amber-400" />
              </div>

              {/* Progress Bar Container */}
              <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-purple-500 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Percentage & Count */}
              <div className="w-16 text-right shrink-0 text-white/40 text-[11px] font-mono">
                {count} ({percentage}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrainerRatingWidget;
