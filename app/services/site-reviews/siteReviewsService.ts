import { Review, ReviewsResponse } from "../reviews/reviewsTypes";

const API_BASE_URL = "http://localhost:5000/api";

class SiteReviewService {
  // Получить все отзывы
  async getAllReviews(): Promise<ReviewsResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/site-reviews`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching site-reviews:", error);
      throw error;
    }
  }

  // Получить отзыв по ID
  async getReviewById(id: number): Promise<Review> {
    try {
      const response = await fetch(`${API_BASE_URL}/site-reviews/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching review:", error);
      throw error;
    }
  }

  // Создать новый отзыв
  async createReview(reviewData: Partial<Review>): Promise<Review> {
    try {
      const response = await fetch(`${API_BASE_URL}/site-reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  }

  // Обновить отзыв
  async updateReview(id: number, reviewData: Partial<Review>): Promise<Review> {
    try {
      const response = await fetch(`${API_BASE_URL}/site-reviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  }

  // Удалить отзыв
  async deleteReview(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/site-reviews/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  }

  // Получить отзывы по targetType и targetId
  async getReviewsByTarget(targetType: string, targetId: number): Promise<Review[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/site-reviews?targetType=${targetType}&targetId=${targetId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching site-reviews by target:", error);
      throw error;
    }
  }

  // Получить отзывы с фильтрацией
  async getFilteredReviews(filters: {
    targetType?: string;
    isModerated?: boolean;
    rating?: number;
    limit?: number;
    offset?: number;
  }): Promise<{ reviews: Review[]; total: number }> {
    try {
      const searchParams = new URLSearchParams();
      
      if (filters.targetType) searchParams.append('targetType', filters.targetType);
      if (filters.isModerated !== undefined) searchParams.append('isModerated', filters.isModerated.toString());
      if (filters.rating) searchParams.append('rating', filters.rating.toString());
      if (filters.limit) searchParams.append('limit', filters.limit.toString());
      if (filters.offset) searchParams.append('offset', filters.offset.toString());

      const response = await fetch(`${API_BASE_URL}/site-reviews?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching filtered site-reviews:", error);
      throw error;
    }
  }

  // Изменить статус модерации отзыва
  async moderateReview(id: number, isModerated: boolean): Promise<Review> {
    try {
      const response = await fetch(`${API_BASE_URL}/site-reviews/${id}/moderate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isModerated }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error moderating review:", error);
      throw error;
    }
  }
}

export default new SiteReviewService();