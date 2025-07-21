/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { createContext, useState, ReactNode } from 'react';
import { MFO, News, Author, Category, Review, Question, QuestionAnswer, License, Tag, NewsLike } from '../lib/types';

interface DataContextType {
  activeSection: string;
  setActiveSection: (section: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  modalMode: 'create' | 'edit' | 'view';
  setModalMode: (mode: 'create' | 'edit' | 'view') => void;
  selectedItem: any;
  setSelectedItem: (item: any) => void;
  mfos: MFO[];
  setMfos: (mfos: MFO[]) => void;
  news: News[];
  setNews: (news: News[]) => void;
  authors: Author[];
  setAuthors: (authors: Author[]) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  questionAnswers: QuestionAnswer[];
  setQuestionAnswers: (questionAnswers: QuestionAnswer[]) => void;
  licenses: License[];
  setLicenses: (licenses: License[]) => void;
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  newsLikes: NewsLike[];
  setNewsLikes: (newsLikes: NewsLike[]) => void;
  handleDelete: (type: string, id: number) => void;
  handleSave: (type: string, data: any) => void;
}

export const DataContext = createContext<DataContextType>({
  activeSection: 'dashboard',
  setActiveSection: () => {},
  searchTerm: '',
  setSearchTerm: () => {},
  isModalOpen: false,
  setIsModalOpen: () => {},
  modalMode: 'create',
  setModalMode: () => {},
  selectedItem: null,
  setSelectedItem: () => {},
  mfos: [],
  setMfos: () => {},
  news: [],
  setNews: () => {},
  authors: [],
  setAuthors: () => {},
  categories: [],
  setCategories: () => {},
  reviews: [],
  setReviews: () => {},
  questions: [],
  setQuestions: () => {},
  questionAnswers: [],
  setQuestionAnswers: () => {},
  licenses: [],
  setLicenses: () => {},
  tags: [],
  setTags: () => {},
  newsLikes: [],
  setNewsLikes: () => {},
  handleDelete: () => {},
  handleSave: () => {},
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Mock data (same as original)
  const [mfos, setMfos] = useState<MFO[]>([
    {
      id: 1,
      name: 'Lime МФО',
      rating: 4.5,
      reviews: 1250,
      logo: '🟢',
      licenseNumber: 'МФО-001',
      minAmount: 1000,
      maxAmount: 30000,
      minTerm: 5,
      maxTerm: 30,
      rateMin: 0.8,
      rateMax: 2.0,
      approvalRate: 87,
      decisionTime: '15 мин',
      isFirstLoanZero: true,
      isInstantApproval: true,
      phone: '+7 (800) 555-0001',
      website: 'lime-mfo.ru',
      createdAt: '2025-01-15',
      ageFrom: 18,
      ageTo: 70,
      citizenship: 'РФ',
      documents: 'Паспорт РФ',
      description: 'Надежная МФО с выгодными условиями',
      isNoIncomeProof: true,
      is24Support: true,
      isSafeTransactions: true,
      isFlexibleTerms: true,
      workTimeWeekdays: '9:00-18:00',
      workTimeWeekend: '10:00-16:00',
      workTimeOnline: '24/7',
    },
    {
      id: 2,
      name: 'MoneyMan',
      rating: 4.2,
      reviews: 890,
      logo: '💰',
      licenseNumber: 'МФО-002',
      minAmount: 500,
      maxAmount: 25000,
      minTerm: 7,
      maxTerm: 45,
      rateMin: 1.0,
      rateMax: 2.5,
      approvalRate: 82,
      decisionTime: '30 мин',
      isFirstLoanZero: false,
      isInstantApproval: true,
      phone: '+7 (800) 555-0002',
      website: 'moneyman.ru',
      createdAt: '2025-01-10',
      ageFrom: 20,
      ageTo: 65,
      citizenship: 'РФ',
      documents: 'Паспорт РФ',
      description: 'Быстрое оформление займов',
      isNoIncomeProof: false,
      is24Support: false,
      isSafeTransactions: true,
      isFlexibleTerms: false,
      workTimeWeekdays: '8:00-20:00',
      workTimeWeekend: '9:00-17:00',
      workTimeOnline: '24/7',
    },
  ]);

  const [news, setNews] = useState<News[]>([
    {
      id: 1,
      title: 'Альфа-Банк представил новое приложение для айфонов',
      slug: 'alfa-bank-new-ios-app',
      body: 'Обновленное мобильное приложение с расширенным функционалом...',
      published: true,
      views: 36,
      authorId: 1,
      author: { name: 'Ольга Пиходская' },
      newsCategoryId: 1,
      NewsCategory: { name: 'Новости', icon: '📰' },
      readingMinutes: 5,
      createdAt: '2025-07-11',
    },
    {
      id: 2,
      title: 'Что делать, если нечем платить кредит',
      slug: 'credit-payment-problems',
      body: 'Подробная инструкция по решению проблем с просроченными кредитными обязательствами...',
      published: true,
      views: 79100,
      authorId: 2,
      author: { name: 'Ирина Калимулина' },
      newsCategoryId: 2,
      NewsCategory: { name: 'Пособия', icon: '📚' },
      readingMinutes: 8,
      createdAt: '2025-07-11',
    },
  ]);

  const [authors, setAuthors] = useState<Author[]>([
    {
      id: 1,
      name: 'Ольга Пиходская',
      bio: 'Финансовый журналист с 5-летним опытом',
      avatarUrl: null,
      totalViews: 120000,
      totalPosts: 47,
    },
    {
      id: 2,
      name: 'Ирина Калимулина',
      bio: 'Эксперт по банковским продуктам',
      avatarUrl: null,
      totalViews: 200000,
      totalPosts: 63,
    },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Новости', icon: '📰' },
    { id: 2, name: 'Пособия', icon: '📚' },
    { id: 3, name: 'Аналитика', icon: '📊' },
    { id: 4, name: 'Дебетовые карты', icon: '💳' },
  ]);

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      rating: 5,
      textOriginal: 'Отличный сервис, быстро одобрили займ!',
      isModerated: true,
      targetType: 'mfo',
      targetId: 1,
      createdAt: '2025-07-15',
    },
    {
      id: 2,
      rating: 4,
      textOriginal: 'Хорошие условия, но долго рассматривали заявку',
      isModerated: false,
      targetType: 'mfo',
      targetId: 2,
      createdAt: '2025-07-14',
    },
  ]);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      textOriginal: 'Как быстро рассматривается заявка на займ?',
      isModerated: false,
      targetType: 'mfo',
      targetId: 1,
      createdAt: '2025-07-15',
    },
  ]);

  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([
    {
      id: 1,
      questionId: 1,
      textOriginal: 'Заявка рассматривается в течение 15 минут',
      isModerated: true,
      createdAt: '2025-07-15',
    },
  ]);

  const [licenses, setLicenses] = useState<License[]>([
    {
      id: 1,
      number: 'LIC-001',
      issuedAt: '2025-01-01',
      validTill: '2026-01-01',
      mfoId: 1,
    },
  ]);

  const [tags, setTags] = useState<Tag[]>([
    { id: 1, name: 'Финансы' },
    { id: 2, name: 'Кредиты' },
  ]);

  const [newsLikes, setNewsLikes] = useState<NewsLike[]>([
    {
      id: 1,
      newsId: 1,
      createdAt: '2025-07-15',
      ipHash: 'xxx',
      fingerprint: 'yyy',
      cookieId: 'zzz',
    },
  ]);

  const handleDelete = (type: string, id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот элемент?')) return;

    switch (type) {
      case 'mfo':
        setMfos(mfos.filter(item => item.id !== id));
        break;
      case 'news':
        setNews(news.filter(item => item.id !== id));
        break;
      case 'author':
        setAuthors(authors.filter(item => item.id !== id));
        break;
      case 'category':
        setCategories(categories.filter(item => item.id !== id));
        break;
      case 'review':
        setReviews(reviews.filter(item => item.id !== id));
        break;
      case 'question':
        setQuestions(questions.filter(item => item.id !== id));
        break;
      case 'questionAnswer':
        setQuestionAnswers(questionAnswers.filter(item => item.id !== id));
        break;
      case 'license':
        setLicenses(licenses.filter(item => item.id !== id));
        break;
      case 'tag':
        setTags(tags.filter(item => item.id !== id));
        break;
      case 'newsLike':
        setNewsLikes(newsLikes.filter(item => item.id !== id));
        break;
    }
  };

  const handleSave = (type: string, data: any) => {
    switch (type) {
      case 'mfo':
        if (modalMode === 'create') {
          setMfos([...mfos, { ...data, id: mfos.length + 1, createdAt: new Date().toISOString() }]);
        } else {
          setMfos(mfos.map(item => item.id === data.id ? data : item));
        }
        break;
      case 'news':
        if (modalMode === 'create') {
          setNews([...news, { ...data, id: news.length + 1, createdAt: new Date().toISOString() }]);
        } else {
          setNews(news.map(item => item.id === data.id ? data : item));
        }
        break;
      case 'author':
        if (modalMode === 'create') {
          setAuthors([...authors, { ...data, id: authors.length + 1 }]);
        } else {
          setAuthors(authors.map(item => item.id === data.id ? data : item));
        }
        break;
      case 'category':
        if (modalMode === 'create') {
          setCategories([...categories, { ...data, id: categories.length + 1 }]);
        } else {
          setCategories(categories.map(item => item.id === data.id ? data : item));
        }
        break;
      case 'review':
        if (modalMode === 'create') {
          setReviews([...reviews, { ...data, id: reviews.length + 1, createdAt: new Date().toISOString() }]);
        } else {
          setReviews(reviews.map(item => item.id === data.id ? data : item));
        }
        break;
      case 'question':
        if (modalMode === 'create') {
          setQuestions([...questions, { ...data, id: questions.length + 1, createdAt: new Date().toISOString() }]);
        } else {
          setQuestions(questions.map(item => item.id === data.id ? data : item));
        }
        break;
      case 'questionAnswer':
        if (modalMode === 'create') {
          setQuestionAnswers([...questionAnswers, { ...data, id: questionAnswers.length + 1, createdAt: new Date().toISOString() }]);
        } else {
          setQuestionAnswers(questionAnswers.map(item => item.id === data.id ? data : item));
        }
        break;
      case 'license':
        if (modalMode === 'create') {
          setLicenses([...licenses, { ...data, id: licenses.length + 1 }]);
        } else {
          setLicenses(licenses.map(item => item.id === data.id ? data : item));
        }
        break;
      case 'tag':
        if (modalMode === 'create') {
          setTags([...tags, { ...data, id: tags.length + 1 }]);
        } else {
          setTags(tags.map(item => item.id === data.id ? data : item));
        }
        break;
    }
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <DataContext.Provider
      value={{
        activeSection,
        setActiveSection,
        searchTerm,
        setSearchTerm,
        isModalOpen,
        setIsModalOpen,
        modalMode,
        setModalMode,
        selectedItem,
        setSelectedItem,
        mfos,
        setMfos,
        news,
        setNews,
        authors,
        setAuthors,
        categories,
        setCategories,
        reviews,
        setReviews,
        questions,
        setQuestions,
        questionAnswers,
        setQuestionAnswers,
        licenses,
        setLicenses,
        tags,
        setTags,
        newsLikes,
        setNewsLikes,
        handleDelete,
        handleSave,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}