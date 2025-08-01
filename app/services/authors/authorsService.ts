import $api from "../http";
import { Author, AuthorPayload } from "./authorsTypes";

export default class AuthorsService {
  static async createAuthor(params: AuthorPayload): Promise<void> {
    try {
      await $api.post("/api/authors", params);
    } catch (error) {
      console.error("Ошибка при создании автора:", error);
      throw error;
    }
  }

  static async updateAuthor(id: string | number, params: AuthorPayload): Promise<void> {
    try {
      await $api.put(`/api/authors/${id}`, params);
    } catch (error) {
      console.error(`Ошибка при обновлении автора с id=${id}:`, error);
      throw error;
    }
  }

  static async deleteAuthor(id: string): Promise<void> {
    try {
      await $api.delete(`/api/authors/${id}`);
    } catch (error) {
      console.error(`Ошибка при удалении автора с id=${id}:`, error);
      throw error;
    }
  }

  static async getAuthor(id: number): Promise<Author> {
    try {
      const response = await $api.get<Author>(`/api/authors/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении автора с id=${id}:`, error);
      throw error;
    }
  }

  static async getAllAuthors(): Promise<Author[]> {
    try {
      const response = await $api.get<Author[]>("/api/authors");
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении списка авторов:", error);
      throw error;
    }
  }
}
