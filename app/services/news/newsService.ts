// services/NewsService.ts
import $api from "../http";
import { News, NewsFormData, NewsStatistic } from "./newsTypes";

export default class NewsService {
  static async createNews(data: NewsFormData): Promise<News> {
    const res = await $api.post<News>("/api/news", data);
    return res.data;
  }

  static async updateNews(id: number, data: NewsFormData): Promise<News> {
    const res = await $api.put<News>(`/api/news/${id}`, data);
    return res.data;
  }

  static async getNewsById(id: number): Promise<News> {
    const res = await $api.get<News>(`/api/news/${id}`);
    return res.data;
  }

  static async deleteNews(id: number): Promise<void> {
    await $api.delete(`/api/news/${id}`);
  }

  static async getAllNews(): Promise<News[]> {
    const res = await $api.get<News[]>("/api/news");
    return res.data;
  }
  static async getNewsStatistic(): Promise<NewsStatistic> {
    const res = await $api.get<NewsStatistic>("/api/news/dashboard/statistic");
    return res.data;
  }
}
