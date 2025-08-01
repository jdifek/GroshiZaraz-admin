import { News } from "../news/newsTypes";

export interface AuthorPayload {
  name: string;
  nameUk: string;
  bio?: string;
  bioUk?: string;
  expertise: string[];
  expertiseUk: string[];
  achievements: string[];
  achievementsUk: string[];
  followers: number;
  totalViews: number;
  totalPosts: number;
}


export interface Author {
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
  followers: number;
  color?: string;
  totalViews: number;
  totalPosts: number;
  expertise: string[];
  expertiseUk: string[];
  achievements: string[];
  achievementsUk: string[];
  telegram?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
  articles: News[];
}
