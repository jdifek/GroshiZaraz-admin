export interface SiteQuestion {
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
  targetType: string; // может быть enum ReviewTargetType, если нужен
  targetId: number;
}

export interface SiteQuestionCreateDto {
  name: string;
  email: string;
  subject: string;
  category: string;
  textOriginal: string;
  textUk?: string;
  textRu?: string;
  targetType: string;
  targetId: number;
}

export interface SiteQuestionUpdateDto {
  subject?: string;
  category?: string;
  textOriginal?: string;
  textUk?: string;
  textRu?: string;
  isModerated?: boolean;
}

export interface SiteQuestionUpdateDto {
  subject?: string;
  category?: string;
  textOriginal?: string;
  textUk?: string;
  textRu?: string;
  isModerated?: boolean;
}
