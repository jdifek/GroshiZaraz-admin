import $api from "../http";
import { Expert, ExpertPayload, ExpertShort } from "./expertsTypes";

export default class ExpertsService {
  static async createExpert(params: ExpertPayload): Promise<void> {
    try {
      await $api.post("/api/experts", params);
    } catch (error) {
      console.error("Ошибка при создании эксперта:", error);
      throw error;
    }
  }
  static async getShortExperts(q?: string): Promise<ExpertShort[]> {
    try {
      const response = await $api.get<ExpertShort[]>("/api/experts/short", {
        params: { q },
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении короткого списка экспертов:", error);
      throw error;
    }
  }

  static async updateExpert(
    id: string | number,
    params: ExpertPayload
  ): Promise<void> {
    try {
      await $api.put(`/api/experts/${id}`, params);
    } catch (error) {
      console.error(`Ошибка при обновлении эксперта с id=${id}:`, error);
      throw error;
    }
  }

  static async deleteExpert(id: string | number): Promise<void> {
    try {
      await $api.delete(`/api/experts/${id}`);
    } catch (error) {
      console.error(`Ошибка при удалении эксперта с id=${id}:`, error);
      throw error;
    }
  }

  static async getExpert(id: number): Promise<Expert> {
    try {
      const response = await $api.get<Expert>(`/api/experts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении эксперта с id=${id}:`, error);
      throw error;
    }
  }

  static async getAllExperts(): Promise<Expert[]> {
    try {
      const response = await $api.get<Expert[]>("/api/experts");
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении списка экспертов:", error);
      throw error;
    }
  }
}
