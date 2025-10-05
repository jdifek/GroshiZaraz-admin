import $api from "../http";
import { Mfo } from "./mfoTypes";

export default class MfoService {
  static async createMfo(data: FormData): Promise<void> {
    try {
      await $api.post('/api/mfos', data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error('Ошибка при создании МФО:', error);
      throw error;
    }
  }
  
  static async updateMfo(id: number, data: FormData): Promise<void> {
    try {
      await $api.put(`/api/mfos/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error('Ошибка при обновлении МФО:', error);
      throw error;
    }
  }
  

  static async deleteMfo(id: number): Promise<void> {
    try {
      await $api.delete(`/api/mfos/${id}`);
    } catch (error) {
      console.error(`Ошибка при удалении МФО с id=${id}:`, error);
      throw error;
    }
  }

  static async getMfo(id: number): Promise<Mfo> {
    try {
      const response = await $api.get<Mfo>(`/api/mfos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении МФО с id=${id}:`, error);
      throw error;
    }
  }

  static async getAllMfos(): Promise<Mfo[]> {
    try {
      const response = await $api.get<Mfo[]>('/api/mfos');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении списка МФО:', error);
      throw error;
    }
  }
  
}
