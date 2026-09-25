import React, { useCallback, useEffect, useRef, useState } from "react";
import { User, MessageSquare, Filter, ArrowUpDown } from "lucide-react";
import { RatingStars } from "./RatingStars";
import Pagination from "@/components/ui/Pagination";
import { reviewService } from "../services/review.service";
import {
  PaginatedReviews,
  ReviewItem,
  ReviewPaginationMeta,
} from "../types/review.types";

interface TrainerReviewsListProps {
  trainerId?: string;
  isOwnTrainer?: boolean;
  className?: string;
}

export const TrainerReviewsList: React.FC<TrainerReviewsListProps> = ({
  trainerId,
  isOwnTrainer = false,
  className = "",
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [pagination, setPagination] = useState<ReviewPaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6,
  });
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<"createdAt" | "rating">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState<boolean>(true);

  const isFetchingRef = useRef<boolean>(false);

  const fetchReviews = useCallback(async () => {
    if (isFetchingRef.current) return;
    if (!trainerId && !isOwnTrainer) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        sortBy,
        sortOrder,
        rating: ratingFilter,
      };

      const result: PaginatedReviews = isOwnTrainer
        ? await reviewService.getMyTrainerReviews(params)
        : await reviewService.getTrainerReviews(trainerId!, params);

      setReviews(result.reviews || []);
      setPagination(result.pagination);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [
    trainerId,
    isOwnTrainer,
    pagination.currentPage,
    pagination.itemsPerPage,
    sortBy,
    sortOrder,
    ratingFilter,
  ]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleRatingFilterChange = (val?: number) => {
    setRatingFilter(val);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSortChange = (field: "createdAt" | "rating", order: "asc" | "desc") => {
    setSortBy(field);
    setSortOrder(order);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const formatDate = (isoString: string): string => {
    try {
      return new Date(isoString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Controls Bar: Filters & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
        {/* Star Rating Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-white/50 mr-2">
            <Filter size={13} />
            <span>Filter:</span>
          </div>
          <button
            type="button"
            onClick={() => handleRatingFilterChange(undefined)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
              ratingFilter === undefined
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            All
          </button>
          {[5, 4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              type="button"
              onClick={() => handleRatingFilterChange(stars)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                ratingFilter === stars
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{stars}★</span>
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-1 text-xs text-white/50">
            <ArrowUpDown size={13} />
            <span>Sort:</span>
          </div>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [f, o] = e.target.value.split("-") as ["createdAt" | "rating", "asc" | "desc"];
              handleSortChange(f, o);
            }}
            className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="createdAt-desc" className="bg-[#0e0826] text-white">Newest First</option>
            <option value="createdAt-asc" className="bg-[#0e0826] text-white">Oldest First</option>
            <option value="rating-desc" className="bg-[#0e0826] text-white">Highest Rating</option>
            <option value="rating-asc" className="bg-[#0e0826] text-white">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-28 bg-white/10 rounded" />
                  <div className="h-2.5 w-16 bg-white/5 rounded" />
                </div>
              </div>
              <div className="h-3 w-20 bg-white/10 rounded" />
              <div className="h-10 w-full bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-white/[0.02] border border-white/5 text-center space-y-3">
          <div className="p-3 rounded-2xl bg-white/5 text-white/40">
            <MessageSquare size={24} />
          </div>
          <h4 className="text-sm font-bold text-white">No reviews found</h4>
          <p className="text-xs text-white/50 max-w-sm">
            {ratingFilter !== undefined
              ? `There are no ${ratingFilter}-star reviews matching this filter.`
              : "No reviews have been published for this trainer yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 hover:border-purple-500/30 transition-all duration-200 flex flex-col justify-between space-y-3 shadow-lg shadow-black/20"
            >
              {/* Reviewer Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {item.author?.profilePic ? (
                    <img
                      src={item.author.profilePic}
                      alt={item.author.name}
                      className="w-10 h-10 rounded-full object-cover border border-purple-500/30"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-xs">
                      {item.author?.name ? item.author.name.charAt(0).toUpperCase() : <User size={16} />}
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {item.author?.name || "Verified Client"}
                    </h4>
                    <span className="text-[10px] text-white/40">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>

                <RatingStars rating={item.rating} size={13} />
              </div>

              {/* Feedback Content */}
              {item.feedback ? (
                <p className="text-xs text-white/70 italic leading-relaxed pt-1">
                  "{item.feedback}"
                </p>
              ) : (
                <p className="text-[11px] text-white/30 italic pt-1">
                  (Rating submitted without written comments)
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {!loading && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default TrainerReviewsList;
