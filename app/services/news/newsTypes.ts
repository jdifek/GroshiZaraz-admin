import { Author } from "../authors/authorsTypes";

export interface NewsCategory {
  id: number;
  name: string;
  nameUk: string;
  icon?: string;
  news: News[]; // если не загружается вложенно — можно сделать optional или убрать
}
export interface NewsStatistic {
  totalViews: {

    totalViews: number;
    totalNews: number;
  }
}
export interface News {
  id: number;
  title: string;
  titleUk: string;
  slug: string;
  slugUk: string;
  body: string;
  bodyUk: string;
  published: boolean;
  createdAt: string; // или Date, если ты парсишь
  updatedAt: string;
  views: number;
  readingMinutes?: number;

  authorId: number;
  author: Author;

  newsCategoryId?: number;
  NewsCategory?: NewsCategory;
}


export interface NewsFormData {
  title: string;
  titleUk: string;
  slug: string;
  slugUk: string;
  body: string;
  bodyUk: string;
  published: boolean;
  views: number;
  readingMinutes?: number;
  authorId: number;
  newsCategoryId?: number;
  createdAt: string;
}