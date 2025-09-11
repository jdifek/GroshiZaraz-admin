export interface Expert {
  id: number;
  name: string;
  avatar?: string;
  position: string;
  experience: string;
  color?: string;
  totalAnswers: number;
  expertise: string[];
}

export interface ReviewAnswer {
  id: number;
  textOriginal: string;
  textUk?: string;
  textRu?: string;
  isModerated: boolean;
  authorName?: string;
  authorEmail?: string;
  expertId?: number;
  expert?: Expert;
  createdAt: string;
}

export interface Review {
  id: number;
  rating: number;
  textOriginal: string;
  textUk?: string;
  textRu?: string;
  isModerated: boolean;
  targetType: 'mfo' | 'bank' | 'license' | 'site';
  targetId: number;
  createdAt: string;
  answers?: ReviewAnswer[];
}

export interface ReviewsResponse {
  pendingCount: number;
  reviews: Review[];
}