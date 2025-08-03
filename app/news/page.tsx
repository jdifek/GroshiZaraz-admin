/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Users,
  Calendar,
} from "lucide-react";
import NewsModal from "../components/NewsModal";
import { formatNumber } from "../utils/format";
import { Author } from "../services/authors/authorsTypes";
import AuthorsService from "../services/authors/authorsService";
import { News } from "../services/news/newsTypes";
import NewsService from "../services/news/newsService";
import CategoryService from "../services/categories/categoriesService";
import { Category } from "../services/categories/categoriesTypes";
import { toast } from "react-toastify";

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const fetchNews = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const res = await NewsService.getAllNews();
      setNews(res);
    } catch (err) {
      console.error("Ошибка при загрузке новостей:", err);
      toast.error("Ошибка при загрузке новостей");
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchNews();
    fetchCategories();
    fetchAuthors();
  }, []);


  const fetchCategories = async () => {
    const res = await CategoryService.getAllCategories();
    setCategories(res);
  };

  const fetchAuthors = async () => {
    const data = await AuthorsService.getAllAuthors();
    setAuthors(data);
  };

 
const handleDelete = async (id: number) => {
  try {
    await NewsService.deleteNews(id);
    toast.success("Новость удалена");
    fetchNews();
  } catch (error) {
    console.error("Ошибка при удалении новости:", error);
    toast.error("Не удалось удалить новость");
  }
};
  const openModal = (mode: "create" | "edit" | "view", item: any = null) => {
    setModalMode(mode);
    setSelectedNews(item);
    setIsModalOpen(true);
  };

  const filteredNews = news.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Управление новостями
          </h1>
          <p className="text-gray-600">Создание и редактирование статей</p>
        </div>
        <button
          onClick={() => openModal("create")}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Создать статью
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск новостей..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid gap-6">
      {isLoading ? (
  Array.from({ length: 3 }).map((_, i) => (
    <div
      key={i}
      className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 animate-pulse space-y-4"
    >
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-100 rounded w-1/3"></div>
      <div className="h-4 bg-gray-100 rounded w-full"></div>
      <div className="h-4 bg-gray-100 rounded w-2/3"></div>
    </div>
  ))
) : error ? (
  <div className="text-center text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl p-4">
    Произошла ошибка при загрузке новостей. Попробуйте позже.
  </div>
) : filteredNews.length === 0 ? (
  <div className="text-center text-gray-500 text-sm bg-gray-50 border border-gray-100 rounded-xl p-4">
    Новости не найдены.
  </div>
) : (
  filteredNews.map((article) => (

            <div
              key={article.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          article.published
                            ? "bg-green-50 text-green-600"
                            : "bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        {article.published ? "Опубликовано" : "Черновик"}
                      </span>
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                        {article.NewsCategory?.name || "Без категории"}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {article.body.substring(0, 150)}...
                    </p>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {article.author?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {formatNumber(article.views)} просмотров
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                      {article.readingMinutes && (
                        <span>⏱️ {article.readingMinutes} мин</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal("view", article)}
                      className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openModal("edit", article)}
                      className="w-10 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )))}
      </div>

      <NewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        newsItem={selectedNews}
        onSubmitSuccess={fetchNews}
        categories={categories}
        authors={authors}
      />
    </div>
  );
}
