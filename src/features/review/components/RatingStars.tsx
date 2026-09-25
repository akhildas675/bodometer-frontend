import React, { useState } from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  onChange?: (rating: number) => void;
  interactive?: boolean;
  showValue?: boolean;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 18,
  onChange,
  interactive = false,
  showValue = false,
  className = "",
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const activeRating = hoverRating !== null ? hoverRating : rating;
  const isInteractive = interactive && typeof onChange === "function";

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-1">
        {Array.from({ length: maxRating }, (_, idx) => {
          const starValue = idx + 1;
          const isFilled = activeRating >= starValue;
          const isPartiallyFilled = !isFilled && activeRating > idx && activeRating < starValue;

          return (
            <button
              key={starValue}
              type="button"
              disabled={!isInteractive}
              onClick={() => isInteractive && onChange(starValue)}
              onMouseEnter={() => isInteractive && setHoverRating(starValue)}
              onMouseLeave={() => isInteractive && setHoverRating(null)}
              className={`transition-all duration-150 relative ${
                isInteractive
                  ? "cursor-pointer hover:scale-110 active:scale-95 focus:outline-none"
                  : "cursor-default"
              }`}
              title={`${starValue} Star${starValue > 1 ? "s" : ""}`}
            >
              <Star
                size={size}
                className={`${
                  isFilled
                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                    : isPartiallyFilled
                    ? "fill-amber-400/50 text-amber-400"
                    : "fill-white/10 text-white/20"
                } transition-colors`}
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="text-xs font-bold text-amber-300 ml-1">
          {rating > 0 ? rating.toFixed(1) : "0.0"}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
