import $api from "../http";
import {
  SiteQuestion,
  SiteQuestionCreateDto,
  SiteQuestionUpdateDto,
} from "./siteQuestionsTypes";

export default class SiteQuestionService {
  // Получить все вопросы
  static async getAllQuestions(params?: { onlyModerated?: boolean; sortByModerated?: boolean }): Promise<SiteQuestion[]> {
    const query = new URLSearchParams();

    if (params?.onlyModerated) query.append("onlyModerated", "true");
    if (params?.sortByModerated) query.append("sortByModerated", "true");

    const url = `/api/site-questions${query.toString() ? "?" + query.toString() : ""}`;
    return (await $api.get<SiteQuestion[]>(url)).data;
  }

  // Получить вопрос по ID
  static async getQuestionById(id: number): Promise<SiteQuestion> {
    return (await $api.get<SiteQuestion>(`/api/site-questions/${id}`)).data;
  }

  // Создать новый вопрос
  static async createQuestion(data: SiteQuestionCreateDto): Promise<SiteQuestion> {
    return (await $api.post<SiteQuestion>("/api/site-questions", data)).data;
  }

  // Обновить вопрос
  static async updateQuestion(id: number, data: SiteQuestionUpdateDto): Promise<SiteQuestion> {
    return (await $api.put<SiteQuestion>(`/api/site-questions/${id}`, data)).data;
  }

  // Удалить вопрос
  static async deleteQuestion(id: number): Promise<void> {
    await $api.delete(`/api/site-questions/${id}`);
  }
}
