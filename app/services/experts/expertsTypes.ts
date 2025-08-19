// expertsTypes.ts
export interface Expert {
  id: number;
  name: string;
  nameUk?: string;
  slug: string;
  avatar: string;
  bio?: string;
  bioUk?: string;
  position: string;
  positionUk?: string;
  experience: string;
  experienceUk?: string;
  isActive: boolean;
  color?: string;
  totalAnswers: number;
  expertise: string[];
  expertiseUk: string[];
  achievements: string[];
  achievementsUk: string[];
  telegram?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpertPayload = Omit<Expert, "id" | "createdAt" | "updatedAt" | "totalAnswers">;
export interface ExpertShort {
  id: number;
  name: string;
  slug: string;
  avatar?: string; // если хочешь в short тоже возвращать
}