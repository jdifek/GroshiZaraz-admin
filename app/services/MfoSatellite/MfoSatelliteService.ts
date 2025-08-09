import $api from "../http";
import { MfoSatellite, MfoSatellitePayload } from "./mfoSatelliteTypes";

export default class MfoSatelliteService {
  static async createSatellite(params: MfoSatellitePayload): Promise<void> {
    try {
      await $api.post('/api/mfo-satellites', params);
    } catch (error) {
      console.error('Ошибка при создании сателлита:', error);
      throw error;
    }
  }

  static async updateSatellite(id: number, params: MfoSatellitePayload): Promise<void> {
    try {
      await $api.put(`/api/mfo-satellites/${id}`, params);
    } catch (error) {
      console.error(`Ошибка при обновлении сателлита с id=${id}:`, error);
      throw error;
    }
  }

  static async deleteSatellite(id: number): Promise<void> {
    try {
      await $api.delete(`/api/mfo-satellites/${id}`);
    } catch (error) {
      console.error(`Ошибка при удалении сателлита с id=${id}:`, error);
      throw error;
    }
  }

  static async getSatellite(id: number): Promise<MfoSatellite> {
    try {
      const response = await $api.get<MfoSatellite>(`/api/mfo-satellites/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении сателлита с id=${id}:`, error);
      throw error;
    }
  }

  static async getAllSatellites(): Promise<MfoSatellite[]> {
    try {
      const response = await $api.get<MfoSatellite[]>('/api/mfo-satellites');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении списка сателлитов:', error);
      throw error;
    }
  }
}
