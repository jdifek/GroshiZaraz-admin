// services/ReviewService.ts
import $api from "../http";
import { Review } from "./reviewsTypes";

export default class ReviewService {
  static async getAllReviews(): Promise<Review[]> {
    const res = await $api.get<Review[]>("/api/reviews");
    return res.data;
  }

  static async getReviewById(id: number): Promise<Review> {
    const res = await $api.get<Review>(`/api/reviews/${id}`);
    return res.data;
  }

  static async createReview(data: Partial<Review>): Promise<Review> {
    const res = await $api.post<Review>("/api/reviews", data);
    return res.data;
  }

  static async updateReview(id: number, data: Partial<Review>): Promise<Review> {
    const res = await $api.put<Review>(`/api/reviews/${id}`, data);
    return res.data;
  }

  static async deleteReview(id: number): Promise<void> {
    await $api.delete(`/api/reviews/${id}`);
  }

  static async getReviewsByTarget(targetType: string, targetId: number): Promise<Review[]> {
    const res = await $api.get<Review[]>(`/api/reviews`, {
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
      "/api/reviews",
      { params: filters }
    );
    return res.data;
  }

  static async moderateReview(id: number, isModerated: boolean): Promise<Review> {
    const res = await $api.patch<Review>(`/api/reviews/${id}/moderate`, {
      isModerated,
    });
    return res.data;
  }
}
