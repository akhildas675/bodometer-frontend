import React, { useState } from "react";
import { X, Sparkles, MessageSquare, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { RatingStars } from "./RatingStars";
import { reviewService } from "../services/review.service";
import { ReviewItem } from "../types/review.types";

interface ReviewModalProps {
  isOpen: boolean;
  bookingId: string;
  videoSessionId?: string;
  trainerName?: string;
  onClose: () => void;
  onSuccess?: (review: ReviewItem) => void;
}

const MAX_FEEDBACK_LENGTH = 1000;

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  bookingId,
  videoSessionId,
  trainerName = "your trainer",
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating || rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5 stars.");
      return;
    }

    if (feedback.trim().length > MAX_FEEDBACK_LENGTH) {
      setError(`Feedback cannot exceed ${MAX_FEEDBACK_LENGTH} characters.`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const review = await reviewService.createReview({
        bookingId,
        videoSessionId,
        rating,
        feedback: feedback.trim() || undefined,
      });

      toast.success("Thank you for your feedback! Review submitted.");
      if (onSuccess) {
        onSuccess(review);
      }
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to submit review. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingLabel = (val: number): string => {
    switch (val) {
      case 5:
        return "Outstanding! Couldn't be better.";
      case 4:
        return "Great session, very helpful!";
      case 3:
        return "Good, met my expectations.";
      case 2:
        return "Fair, but has room for improvement.";
      case 1:
        return "Unsatisfactory experience.";
      default:
        return "Select your rating";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0e0826] border border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/60 overflow-hidden text-white">
        {/* Decorative Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-600/30 blur-3xl pointer-events-none rounded-full" />

        {/* Header */}
        <div className="flex items-start justify-between relative z-10 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400">
                <Sparkles size={16} />
              </span>
              <h2 className="text-xl font-extrabold tracking-tight text-white">
                Rate Your Session
              </h2>
            </div>
            <p className="text-xs text-white/60 mt-1">
              How was your experience with{" "}
              <span className="text-purple-300 font-semibold">{trainerName}</span>?
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition cursor-pointer disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6 relative z-10">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Star Selection Section */}
          <div className="flex flex-col items-center justify-center py-4 px-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <span className="text-xs uppercase tracking-wider font-bold text-white/40">
              Tap stars to rate
            </span>
            <RatingStars
              rating={rating}
              size={32}
              interactive={!submitting}
              onChange={(newRating) => {
                setRating(newRating);
                setError(null);
              }}
            />
            <p className="text-xs font-semibold text-purple-200 text-center animate-fadeIn">
              {getRatingLabel(rating)}
            </p>
          </div>

          {/* Optional Feedback */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-bold text-white/80">
                <MessageSquare size={14} className="text-purple-400" />
                Feedback (Optional)
              </label>
              <span className="text-[11px] text-white/40">
                {feedback.length}/{MAX_FEEDBACK_LENGTH}
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={MAX_FEEDBACK_LENGTH}
              value={feedback}
              disabled={submitting}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share details about what went well or how the session could be improved..."
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50 transition resize-none disabled:opacity-50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 shadow-lg shadow-purple-600/30 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
