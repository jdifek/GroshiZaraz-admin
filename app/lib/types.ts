export interface MFO {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  logo: string;
  licenseNumber: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  rateMin: number;
  rateMax: number;
  approvalRate: number;
  decisionTime: string;
  isFirstLoanZero: boolean;
  isInstantApproval: boolean;
  phone: string;
  website: string;
  createdAt: string;
  ageFrom: number;
  ageTo: number;
  citizenship: string;
  documents: string;
  description: string;
  isNoIncomeProof: boolean;
  is24Support: boolean;
  isSafeTransactions: boolean;
  isFlexibleTerms: boolean;
  workTimeWeekdays: string;
  workTimeWeekend: string;
  workTimeOnline: string;
}

export interface News {
  id: number;
  title: string;
  slug: string;
  body: string;
  published: boolean;
  views: number;
  authorId: number;
  author: { name: string };
  newsCategoryId: number;
  NewsCategory: { name: string; icon: string };
  readingMinutes: number;
  createdAt: string;
}

export interface Author {
  id: number;
  name: string;
  bio: string;
  avatarUrl: string | null;
  totalViews: number;
  totalPosts: number;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Review {
  id: number;
  rating: number;
  textOriginal: string;
  isModerated: boolean;
  targetType: string;
  targetId: number;
  createdAt: string;
}

export interface Question {
  id: number;
  textOriginal: string;
  isModerated: boolean;
  targetType: string;
  targetId: number;
  createdAt: string;
}

export interface QuestionAnswer {
  id: number;
  questionId: number;
  textOriginal: string;
  isModerated: boolean;
  createdAt: string;
}

export interface License {
  id: number;
  number: string;
  issuedAt: string;
  validTill: string;
  mfoId: number;
}

export interface Tag {
  id: number;
  name: string;
}

export interface NewsLike {
  id: number;
  newsId: number;
  createdAt: string;
  ipHash: string;
  fingerprint: string;
  cookieId: string;
}