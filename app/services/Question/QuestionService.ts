import $api from "../http";
import {
  Question,
  QuestionCreateDto,
  QuestionUpdateDto,
} from "./questionTypes";

export default class QuestionService {
  // Получить все вопросы
  static async getAllQuestions(
    params?: { onlyModerated?: boolean; sortByModerated?: boolean }
  ): Promise<Question[]> {
    const query = new URLSearchParams();

    if (params?.onlyModerated) query.append("onlyModerated", "true");
    if (params?.sortByModerated) query.append("sortByModerated", "true");

    const url = `/api/questions${query.toString() ? "?" + query.toString() : ""}`;
    return (await $api.get<Question[]>(url)).data;
  }

  // Получить вопрос по ID
  static async getQuestionById(id: number): Promise<Question> {
    return (await $api.get<Question>(`/api/questions/${id}`)).data;
  }

  // Создать новый вопрос
  static async createQuestion(data: QuestionCreateDto): Promise<Question> {
    return (await $api.post<Question>("/api/questions", data)).data;
  }

  // Обновить вопрос
  static async updateQuestion(
    id: number,
    data: QuestionUpdateDto
  ): Promise<Question> {
    return (await $api.put<Question>(`/api/questions/${id}`, data)).data;
  }

  // Удалить вопрос
  static async deleteQuestion(id: number): Promise<void> {
    await $api.delete(`/api/questions/${id}`);
  }
}
