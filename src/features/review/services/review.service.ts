import { api } from "@/infrastructure/api/protected-client";
import { ApiResponse } from "@/types/api.types";
import {
  CreateReviewRequest,
  PaginatedReviews,
  RatingSummary,
  ReviewEligibility,
  ReviewItem,
  ReviewPaginationMeta,
  ReviewQueryParams,
  UpdateReviewRequest,
} from "../types/review.types";

const REVIEW_BASE_URL = "/reviews";

class ReviewService {
  async checkEligibility(bookingId: string): Promise<ReviewEligibility> {
    const response = await api.get<ApiResponse<ReviewEligibility>>(
      `${REVIEW_BASE_URL}/eligibility/${bookingId}`
    );
    return (
      response.data?.data || {
        eligible: false,
        bookingId,
        reason: "Could not verify eligibility.",
      }
    );
  }

  async createReview(data: CreateReviewRequest): Promise<ReviewItem> {
    const response = await api.post<ApiResponse<ReviewItem>>(
      REVIEW_BASE_URL,
      data
    );
    return response.data?.data;
  }

  async getReviewById(reviewId: string): Promise<ReviewItem> {
    const response = await api.get<ApiResponse<ReviewItem>>(
      `${REVIEW_BASE_URL}/${reviewId}`
    );
    return response.data?.data;
  }

  async getMyReviews(
    params?: ReviewQueryParams
  ): Promise<{ reviews: ReviewItem[]; pagination: ReviewPaginationMeta }> {
    const response = await api.get<
      ApiResponse<{ reviews: ReviewItem[]; pagination: ReviewPaginationMeta }>
    >(`${REVIEW_BASE_URL}/my-reviews`, { params });
    return response.data?.data || { reviews: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 } };
  }

  async updateReview(
    reviewId: string,
    data: UpdateReviewRequest
  ): Promise<ReviewItem> {
    const response = await api.patch<ApiResponse<ReviewItem>>(
      `${REVIEW_BASE_URL}/${reviewId}`,
      data
    );
    return response.data?.data;
  }

  async deleteReview(reviewId: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`${REVIEW_BASE_URL}/${reviewId}`);
  }

  async getTrainerReviews(
    trainerId: string,
    params?: ReviewQueryParams
  ): Promise<PaginatedReviews> {
    const response = await api.get<ApiResponse<PaginatedReviews>>(
      `${REVIEW_BASE_URL}/trainer/${trainerId}`,
      { params }
    );
    return (
      response.data?.data || {
        reviews: [],
        pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 },
      }
    );
  }

  async getTrainerSummary(trainerId: string): Promise<RatingSummary> {
    const response = await api.get<ApiResponse<RatingSummary>>(
      `${REVIEW_BASE_URL}/trainer/${trainerId}/summary`
    );
    return (
      response.data?.data || {
        averageRating: 0,
        totalReviews: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      }
    );
  }

  async getMyTrainerReviews(
    params?: ReviewQueryParams
  ): Promise<PaginatedReviews> {
    const response = await api.get<ApiResponse<PaginatedReviews>>(
      `${REVIEW_BASE_URL}/trainer`,
      { params }
    );
    return (
      response.data?.data || {
        reviews: [],
        pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 },
      }
    );
  }

  async getMyTrainerSummary(): Promise<RatingSummary> {
    const response = await api.get<ApiResponse<RatingSummary>>(
      `${REVIEW_BASE_URL}/trainer/summary`
    );
    return (
      response.data?.data || {
        averageRating: 0,
        totalReviews: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      }
    );
  }
}

export const reviewService = new ReviewService();
export default reviewService;
