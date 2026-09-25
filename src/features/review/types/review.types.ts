export type ReviewStatus = "ACTIVE" | "HIDDEN" | "REMOVED";

export type RatingValue = 1 | 2 | 3 | 4 | 5;

export interface ReviewAuthor {
  id: string;
  name: string;
  profilePic: string | null;
}

export interface ReviewItem {
  id: string;
  bookingId: string;
  videoSessionId?: string;
  userId: string;
  trainerId: string;
  rating: number;
  feedback?: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  author?: ReviewAuthor;
}

export interface CreateReviewRequest {
  bookingId: string;
  videoSessionId?: string;
  rating: number;
  feedback?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  feedback?: string;
}

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface RatingSummary {
  averageRating: number;
  totalReviews: number;
  distribution: RatingDistribution;
}

export interface ReviewEligibility {
  eligible: boolean;
  bookingId: string;
  videoSessionId?: string;
  trainerId?: string;
  reason?: string;
  existingReviewId?: string;
}

export interface ReviewPaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface PaginatedReviews {
  reviews: ReviewItem[];
  pagination: ReviewPaginationMeta;
  summary?: RatingSummary;
}

export interface ReviewQueryParams {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "rating";
  sortOrder?: "asc" | "desc";
  rating?: number;
}
