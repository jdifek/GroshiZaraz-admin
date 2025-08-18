import $api from "../http";
import { MfoSatelliteKey, MfoSatelliteKeyPayload } from "./mfoSatelliteKeyTypes";

export default class MfoSatelliteKeyService {
  static async createSatelliteKey(params: MfoSatelliteKeyPayload): Promise<void> {
    try {
      await $api.post('/api/mfo-satellite-keys', params);
    } catch (error) {
      console.error('Ошибка при создании ключа сателлита:', error);
      throw error;
    }
  }
  static async searchSatelliteKeys(query: string): Promise<Pick<MfoSatelliteKey, 'id' | 'keyUk' | 'keyRu'>[]> {
    try {
      const response = await $api.get<Pick<MfoSatelliteKey, 'id' | 'keyUk' | 'keyRu'>[]>(
        '/api/mfo-satellite-keys/short',
        { params: { q: query } }
      );
      return response.data;
    } catch (error) {
      console.error(`Ошибка при поиске ключей сателлитов по запросу "${query}":`, error);
      throw error;
    }
  }

  static async updateSatelliteKey(id: number, params: MfoSatelliteKeyPayload): Promise<void> {
    try {
      await $api.put(`/api/mfo-satellite-keys/${id}`, params);
    } catch (error) {
      console.error(`Ошибка при обновлении ключа сателлита с id=${id}:`, error);
      throw error;
    }
  }

  static async deleteSatelliteKey(id: number): Promise<void> {
    try {
      await $api.delete(`/api/mfo-satellite-keys/${id}`);
    } catch (error) {
      console.error(`Ошибка при удалении ключа сателлита с id=${id}:`, error);
      throw error;
    }
  }

  static async getSatelliteKey(id: number): Promise<MfoSatelliteKey> {
    try {
      const response = await $api.get<MfoSatelliteKey>(`/api/mfo-satellite-keys/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении ключа сателлита с id=${id}:`, error);
      throw error;
    }
  }

  static async getAllSatelliteKeys(): Promise<MfoSatelliteKey[]> {
    try {
      const response = await $api.get<MfoSatelliteKey[]>('/api/mfo-satellite-keys');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении списка ключей сателлитов:', error);
      throw error;
    }
  }
}
