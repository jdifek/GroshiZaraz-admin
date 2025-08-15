/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import {
  Search,
  Trash2,
  Eye,
  Users,
  Calendar,
  FileText,
  Globe,
  Clock,
  User,
  Tag,
  BookOpen,
  Award,
  Mail,
  MessageCircle,
  Linkedin,
  Twitter,
  TrendingUp,
  Link
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
import { GreenButton } from "../ui/Buttons/GreenButton";
import { ExpandCollapseButton } from "../ui/Buttons/ExpandCollapseButton";
import { EditButton } from "../ui/Buttons/EditButton";

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
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  
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
    if (!confirm("Удалить новость?")) return;
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

  const toggleCardExpansion = (newsId: number) => {
    setExpandedCardId(expandedCardId === newsId ? null : newsId);
  };

  const filteredNews = news.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.titleUk?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.NewsCategory?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      {/* Заголовок и кнопка */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Управление новостями
          </h1>
          <p className="text-gray-600">
            Создание и редактирование статей ({news.length})
          </p>
        </div>
        <GreenButton text="Добавить новость" onClick={() => openModal("create")} />
      </div>

      {/* Поиск */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск новостей, авторов, категорий..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Список новостей */}
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
            {searchTerm
              ? "Новости не найдены по вашему запросу."
              : "Новости не найдены."}
          </div>
        ) : (
          filteredNews.map((article) => {
            const isExpanded = expandedCardId === article.id;
            
            return (
              <div
                key={article.id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-green-50 rounded-xl">
                        <FileText className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Основная информация - всегда видна */}
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-2">
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
                              {article.NewsCategory?.icon} {article.NewsCategory?.name || "Без категории"}
                            </span>
                          </div>
                        </div>

                        {/* Краткая информация - всегда видна */}
                        <div className="mb-4 text-sm text-gray-600 space-y-2">
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-gray-700">{article.author?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4 text-gray-400" />
                              <span>{formatNumber(article.views)} просмотров</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>{new Date(article.createdAt).toLocaleDateString("ru-RU")}</span>
                            </div>
                            {article.readingMinutes && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{article.readingMinutes} мин чтения</span>
                              </div>
                            )}
                          </div>
                          <div className="line-clamp-2 text-gray-600">
                            {article.body.substring(0, 200)}...
                          </div>
                        </div>

                        {/* Детальная информация - показывается при разворачивании */}
                        <div className={`space-y-4 transition-all duration-300 overflow-hidden ${
                          isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          {/* Полный контент */}
                          <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700">
                                Содержание статьи
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {article.body}
                            </p>
                          </div>

                          {/* Украинский контент, если есть */}
                          {(article.titleUk || article.bodyUk) && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">
                                  Украинская версия
                                </span>
                              </div>
                              
                              {article.titleUk && (
                                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                  <div className="text-sm font-medium text-blue-800 mb-1">Заголовок UK:</div>
                                  <div className="text-sm text-blue-700">{article.titleUk}</div>
                                </div>
                              )}
                              
                              {article.bodyUk && (
                                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                  <div className="text-sm font-medium text-blue-800 mb-1">Содержание UK:</div>
                                  <div className="text-sm text-blue-700 leading-relaxed">{article.bodyUk}</div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* SEO информация */}
                          {(article.slug || article.slugUk) && (
                            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                              <div className="flex items-center gap-2 mb-3">
                                <Link className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-700">
                                  SEO информация
                                </span>
                              </div>
                              <div className="grid md:grid-cols-2 gap-3 text-xs">
                                {article.slug && (
                                  <div>
                                    <span className="font-medium text-purple-800">Slug RU:</span>
                                    <div className="text-purple-700 bg-white px-2 py-1 rounded mt-1">/{article.slug}</div>
                                  </div>
                                )}
                                {article.slugUk && (
                                  <div>
                                    <span className="font-medium text-purple-800">Slug UK:</span>
                                    <div className="text-purple-700 bg-white px-2 py-1 rounded mt-1">/{article.slugUk}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Детальная информация об авторе */}
                          {article.author && (
                            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                              <div className="flex items-center gap-2 mb-3">
                                <User className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">
                                  Информация об авторе
                                </span>
                              </div>
                              
                              <div className="flex items-start gap-4 p-3 bg-white rounded-lg border">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                     style={{backgroundColor: article.author.color || '#3b82f6'}}>
                                  {article.author.avatar}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="text-base font-semibold text-gray-800">
                                      {article.author.name}
                                    </h4>
                                    {article.author.nameUk && (
                                      <span className="text-sm text-blue-600">({article.author.nameUk})</span>
                                    )}
                                  </div>
                                  
                                  {article.author.position && (
                                    <p className="text-sm text-gray-600 mb-2">{article.author.position}</p>
                                  )}
                                  
                                  {article.author.bio && (
                                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">{article.author.bio}</p>
                                  )}

                                  {/* Статистика автора */}
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500 mb-3">
                                    <div className="flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      <span>{formatNumber(article.author.followers || 0)} подписчиков</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <TrendingUp className="w-3 h-3" />
                                      <span>{formatNumber(article.author.totalViews || 0)} просмотров</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <BookOpen className="w-3 h-3" />
                                      <span>{article.author.totalPosts || 0} статей</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{article.author.experience || "Нет данных"}</span>
                                    </div>
                                  </div>

                                  {/* Экспертиза */}
                                  {article.author.expertise && article.author.expertise.length > 0 && (
                                    <div className="mb-3">
                                      <div className="text-xs font-medium text-gray-700 mb-1">Экспертиза:</div>
                                      <div className="flex flex-wrap gap-1">
                                        {article.author.expertise.map((skill, index) => (
                                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                            {skill}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Достижения */}
                                  {article.author.achievements && article.author.achievements.length > 0 && (
                                    <div className="mb-3">
                                      <div className="text-xs font-medium text-gray-700 mb-1">Достижения:</div>
                                      <div className="space-y-1">
                                        {article.author.achievements.slice(0, 3).map((achievement, index) => (
                                          <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                                            <Award className="w-3 h-3 text-yellow-500" />
                                            <span>{achievement}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Социальные сети */}
                                  <div className="flex items-center gap-3 text-xs">
                                    {article.author.email && (
                                      <a href={`mailto:${article.author.email}`} 
                                         className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                                        <Mail className="w-3 h-3" />
                                        <span>Email</span>
                                      </a>
                                    )}
                                    {article.author.telegram && (
                                      <a href={`https://t.me/${article.author.telegram}`} 
                                         target="_blank" rel="noopener noreferrer"
                                         className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                                        <MessageCircle className="w-3 h-3" />
                                        <span>Telegram</span>
                                      </a>
                                    )}
                                    {article.author.linkedin && (
                                      <a href={`https://linkedin.com/in/${article.author.linkedin}`} 
                                         target="_blank" rel="noopener noreferrer"
                                         className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                                        <Linkedin className="w-3 h-3" />
                                        <span>LinkedIn</span>
                                      </a>
                                    )}
                                    {article.author.twitter && (
                                      <a href={`https://twitter.com/${article.author.twitter}`} 
                                         target="_blank" rel="noopener noreferrer"
                                         className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                                        <Twitter className="w-3 h-3" />
                                        <span>Twitter</span>
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Мета информация */}
                          <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-gray-100 flex-wrap">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Создано: {new Date(article.createdAt).toLocaleDateString("ru-RU", {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Обновлено: {new Date(article.updatedAt).toLocaleDateString("ru-RU", {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              <span>ID: {article.id}</span>
                            </div>
                            {article.authorId && (
                              <div className="flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                <span>Author ID: {article.authorId}</span>
                              </div>
                            )}
                            {article.newsCategoryId && (
                              <div className="flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                <span>Category ID: {article.newsCategoryId}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Кнопки управления */}
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      {/* Кнопка разворачивания/сворачивания */}
                      <ExpandCollapseButton
  isExpanded={isExpanded}
  onToggle={() => toggleCardExpansion(article.id)}
/>

                      <button
                        onClick={() => openModal("view", article)}
                        className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center transition-colors"
                        title="Просмотр"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                         
                      <EditButton
                        item={article}
                        handleClick={(article) => openModal("edit", article)}
                      />
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Модалка */}
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