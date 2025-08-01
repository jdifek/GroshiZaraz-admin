import $api from "../http";
import {
  Category,
  CategoryCreateDto,
  CategoryUpdateDto,
} from "./categoriesTypes";

export default class CategoryService {
  // Получить все категории
  static async getAllCategories() {
    return (await $api.get<Category[]>("/api/category")).data;
  }

  // Создать новую категорию
  static async createCategory(data: CategoryCreateDto): Promise<Category> {
    return (await $api.post<Category>("/api/category", data)).data;
  }

  // Обновить существующую категорию
  static async updateCategory(id: number, data: CategoryUpdateDto) {
    return (await $api.put<Category>(`/api/category/${id}`, data)).data;
  }

  // Удалить категорию
  static async deleteCategory(id: number) {
    return await $api.delete(`/api/category/${id}`);
  }

  // Получить категорию по ID (если нужно)
  static async getCategoryById(id: number) {
    return await $api.get<Category>(`/api/category/${id}`);
  }
}
