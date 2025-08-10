// services/questions/questionTypes.ts
export interface Question {
  id: number;
  name: string;
  email: string;
  subject: string;
  category: string;
  textOriginal: string;
  textUk?: string;
  textRu?: string;
  isModerated: boolean;
  createdAt: string;
  targetType: string; // ReviewTargetType — можно сделать enum
  targetId: number;
}

export type QuestionCreateDto = Omit<Question, "id" | "createdAt">;
export type QuestionUpdateDto = Partial<Omit<Question, "id" | "createdAt">>;
