// services/SiteReviewService.ts
import $api from "../http";
import { Review, ReviewsResponse } from "../reviews/reviewsTypes";

export default class SiteReviewService {
  static async getAllReviews(): Promise<ReviewsResponse[]> {
    const res = await $api.get<ReviewsResponse[]>("/api/site-reviews");
    return res.data;
  }

  static async getReviewById(id: number): Promise<Review> {
    const res = await $api.get<Review>(`/api/site-reviews/${id}`);
    return res.data;
  }

  static async createReview(data: Partial<Review>): Promise<Review> {
    const res = await $api.post<Review>("/api/site-reviews", data);
    return res.data;
  }

  static async updateReview(id: number, data: Partial<Review>): Promise<Review> {
    const res = await $api.put<Review>(`/api/site-reviews/${id}`, data);
    return res.data;
  }

  static async deleteReview(id: number): Promise<void> {
    await $api.delete(`/api/site-reviews/${id}`);
  }

  static async getReviewsByTarget(targetType: string, targetId: number): Promise<Review[]> {
    const res = await $api.get<Review[]>("/api/site-reviews", {
      params: { targetType, targetId },
    });
    return res.data;
  }

  static async getFilteredReviews(filters: {
    targetType?: string;
    isModerated?: boolean;
    rating?: number;
    limit?: number;
    offset?: number;
  }): Promise<{ reviews: Review[]; total: number }> {
    const res = await $api.get<{ reviews: Review[]; total: number }>(
      "/api/site-reviews",
      { params: filters }
    );
    return res.data;
  }

  static async moderateReview(id: number, isModerated: boolean): Promise<Review> {
    const res = await $api.patch<Review>(`/api/site-reviews/${id}/moderate`, {
      isModerated,
    });
    return res.data;
  }
}
