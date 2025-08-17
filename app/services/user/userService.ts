import $api from "../http";
import { User, UserPayload } from "./userTypes";

export default class UserService {
  static async createUser(params: UserPayload): Promise<void> {
    try {
      await $api.post('/api/users', params);
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
      throw error;
    }
  }

  static async updateUser(id: number, params: Partial<UserPayload>): Promise<void> {
    try {
      await $api.put(`/api/users/${id}`, params);
    } catch (error) {
      console.error(`Ошибка при обновлении пользователя с id=${id}:`, error);
      throw error;
    }
  }

  static async deleteUser(id: number): Promise<void> {
    try {
      await $api.delete(`/api/users/${id}`);
    } catch (error) {
      console.error(`Ошибка при удалении пользователя с id=${id}:`, error);
      throw error;
    }
  }

  static async getUser(id: number): Promise<User> {
    try {
      const response = await $api.get<User>(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении пользователя с id=${id}:`, error);
      throw error;
    }
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      const response = await $api.get<User[]>('/api/users');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении списка пользователей:', error);
      throw error;
    }
  }
}
