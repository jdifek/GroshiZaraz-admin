/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Trash2, 
  FileText, 
  Eye, 
  ChevronDown,
  ChevronUp,
  User,
  Globe,
  Star,
  Award,
  Users,
  TrendingUp,
  Clock,
  Mail,
  MessageCircle,
  Linkedin,
  Twitter,
  Tag,
  Edit2,
  Link
} from "lucide-react";
import AuthorModal from "../components/AuthorModal";
import { formatNumber } from "../utils/format";
import AuthorsService from "../services/authors/authorsService";
import { Author } from "../services/authors/authorsTypes";
import { toast } from "react-toastify";
import { VioletButton } from "../ui/Buttons/VioletButton";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const data = await AuthorsService.getAllAuthors();
      setAuthors(data);
    } catch (error) {
      console.error("Ошибка при загрузке авторов:", error);
      toast.error("Ошибка при загрузке авторов");
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить автора?")) return;
    try {
      await AuthorsService.deleteAuthor(id);
      setAuthors(authors.filter((author) => author.id !== Number(id)));
      toast.success("Автор успешно удалён");
    } catch (error) {
      console.error("Ошибка при удалении автора:", error);
      toast.error("Не удалось удалить автора");
    }
  };

  const openModal = (mode: "create" | "edit", author: any = null) => {
    setModalMode(mode);
    setSelectedAuthor(author);
    setIsModalOpen(true);
  };

  const toggleCardExpansion = (authorId: number) => {
    setExpandedCardId(expandedCardId === authorId ? null : authorId);
  };

  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.nameUk?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.expertise?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопка */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Управление авторами
          </h1>
          <p className="text-gray-600">
            Добавление и редактирование авторов ({authors.length})
          </p>
        </div>
        <VioletButton text="Добавить автора" onClick={() => openModal("create")} />
      </div>

      {/* Поиск */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск авторов, должностей, экспертизы..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Список авторов */}
      <div className="grid gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 animate-pulse space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="text-center text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl p-4">
            Произошла ошибка при загрузке авторов. Попробуйте позже.
          </div>
        ) : filteredAuthors.length === 0 ? (
          <div className="text-center text-gray-500 text-sm bg-gray-50 border border-gray-100 rounded-xl p-4">
            {searchTerm
              ? "Авторы не найдены по вашему запросу."
              : "Авторы не найдены."}
          </div>
        ) : (
          filteredAuthors.map((author) => {
            const isExpanded = expandedCardId === author.id;
            
            return (
              <div
                key={author.id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
                           style={{backgroundColor: author.color || '#8b5cf6'}}>
                        {author.avatar || author.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Основная информация - всегда видна */}
                        <div className="flex items-start gap-3 mb-3 flex-wrap">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                              {author.name}
                            </h3>
                            {author.nameUk && author.nameUk !== author.name && (
                              <div className="flex items-center gap-2 mb-2">
                                <Globe className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-blue-600">UK: {author.nameUk}</span>
                              </div>
                            )}
                            {author.position && (
                              <p className="text-sm text-gray-600 font-medium mb-2">{author.position}</p>
                            )}
                          </div>
                        </div>

                        {/* Краткая информация - всегда видна */}
                        <div className="mb-4 text-sm text-gray-600 space-y-2">
                          <div className="line-clamp-2">
                            {author.bio}
                          </div>
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span>{author.totalPosts || 0} статей</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4 text-gray-400" />
                              <span>{formatNumber(author.totalViews || 0)} просмотров</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span>{formatNumber(author.followers || 0)} подписчиков</span>
                            </div>
                          </div>
                        </div>

                        {/* Детальная информация - показывается при разворачивании */}
                        <div className={`space-y-4 transition-all duration-300 overflow-hidden ${
                          isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          {/* Полная биография */}
                          <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700">
                                Биография
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed mb-3">
                              {author.bio}
                            </p>
                            {author.bioUk && author.bioUk !== author.bio && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <Globe className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-700">
                                    Биография UK
                                  </span>
                                </div>
                                <p className="text-sm text-blue-700 leading-relaxed">
                                  {author.bioUk}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Должность и опыт */}
                          {(author.position || author.experience) && (
                            <div className="p-4 bg-violet-50 rounded-lg border-l-4 border-violet-400">
                              <div className="flex items-center gap-2 mb-3">
                                <Star className="w-4 h-4 text-violet-600" />
                                <span className="text-sm font-medium text-violet-700">
                                  Карьера и опыт
                                </span>
                              </div>
                              
                              {author.position && (
                                <div className="mb-3">
                                  <div className="text-sm font-medium text-violet-800 mb-1">Должность:</div>
                                  <div className="text-sm text-violet-700">{author.position}</div>
                                  {author.positionUk && author.positionUk !== author.position && (
                                    <div className="text-xs text-violet-600 mt-1">UK: {author.positionUk}</div>
                                  )}
                                </div>
                              )}
                              
                              {author.experience && (
                                <div>
                                  <div className="text-sm font-medium text-violet-800 mb-1">Опыт работы:</div>
                                  <div className="text-sm text-violet-700">{author.experience}</div>
                                  {author.experienceUk && author.experienceUk !== author.experience && (
                                    <div className="text-xs text-violet-600 mt-1">UK: {author.experienceUk}</div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Экспертиза */}
                          {author.expertise && author.expertise.length > 0 && (
                            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                              <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">
                                  Экспертиза
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {author.expertise.map((skill, index) => (
                                  <span key={index} className="px-3 py-1 bg-white text-blue-700 text-sm rounded-full border border-blue-200">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                              
                              {author.expertiseUk && author.expertiseUk.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-blue-200">
                                  <div className="text-sm font-medium text-blue-800 mb-2">Экспертиза UK:</div>
                                  <div className="flex flex-wrap gap-2">
                                    {author.expertiseUk.map((skill, index) => (
                                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Достижения */}
                          {author.achievements && author.achievements.length > 0 && (
                            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                              <div className="flex items-center gap-2 mb-3">
                                <Award className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">
                                  Достижения
                                </span>
                              </div>
                              <div className="space-y-2 mb-3">
                                {author.achievements.map((achievement, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                                    <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                                    <span>{achievement}</span>
                                  </div>
                                ))}
                              </div>
                              
                              {author.achievementsUk && author.achievementsUk.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-green-200">
                                  <div className="text-sm font-medium text-green-800 mb-2">Достижения UK:</div>
                                  <div className="space-y-2">
                                    {author.achievementsUk.map((achievement, index) => (
                                      <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                                        <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                                        <span>{achievement}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Статистика */}
                          <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                            <div className="flex items-center gap-2 mb-3">
                              <TrendingUp className="w-4 h-4 text-orange-600" />
                              <span className="text-sm font-medium text-orange-700">
                                Статистика
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              <div className="text-center p-3 bg-white rounded-lg">
                                <div className="text-lg font-bold text-gray-800">
                                  {formatNumber(author.totalViews || 0)}
                                </div>
                                <div className="text-xs text-gray-500">Всего просмотров</div>
                              </div>
                              <div className="text-center p-3 bg-white rounded-lg">
                                <div className="text-lg font-bold text-gray-800">
                                  {author.totalPosts || 0}
                                </div>
                                <div className="text-xs text-gray-500">Всего статей</div>
                              </div>
                              <div className="text-center p-3 bg-white rounded-lg">
                                <div className="text-lg font-bold text-gray-800">
                                  {formatNumber(author.followers || 0)}
                                </div>
                                <div className="text-xs text-gray-500">Подписчиков</div>
                              </div>
                            </div>
                          </div>

                          {/* Контактная информация */}
                          {(author.email || author.telegram || author.linkedin || author.twitter) && (
                            <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
                              <div className="flex items-center gap-2 mb-3">
                                <Mail className="w-4 h-4 text-indigo-600" />
                                <span className="text-sm font-medium text-indigo-700">
                                  Контакты и социальные сети
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {author.email && (
                                  <a href={`mailto:${author.email}`} 
                                     className="flex items-center gap-2 p-2 bg-white rounded-lg text-indigo-700 hover:text-indigo-900 transition-colors">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-sm truncate">Email</span>
                                  </a>
                                )}
                                {author.telegram && (
                                  <a href={`https://t.me/${author.telegram}`} 
                                     target="_blank" rel="noopener noreferrer"
                                     className="flex items-center gap-2 p-2 bg-white rounded-lg text-indigo-700 hover:text-indigo-900 transition-colors">
                                    <MessageCircle className="w-4 h-4" />
                                    <span className="text-sm truncate">Telegram</span>
                                  </a>
                                )}
                                {author.linkedin && (
                                  <a href={`https://linkedin.com/in/${author.linkedin}`} 
                                     target="_blank" rel="noopener noreferrer"
                                     className="flex items-center gap-2 p-2 bg-white rounded-lg text-indigo-700 hover:text-indigo-900 transition-colors">
                                    <Linkedin className="w-4 h-4" />
                                    <span className="text-sm truncate">LinkedIn</span>
                                  </a>
                                )}
                                {author.twitter && (
                                  <a href={`https://twitter.com/${author.twitter}`} 
                                     target="_blank" rel="noopener noreferrer"
                                     className="flex items-center gap-2 p-2 bg-white rounded-lg text-indigo-700 hover:text-indigo-900 transition-colors">
                                    <Twitter className="w-4 h-4" />
                                    <span className="text-sm truncate">Twitter</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          )}

                          {/* SEO и служебная информация */}
                          <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                            <div className="flex items-center gap-2 mb-3">
                              <Link className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700">
                                Служебная информация
                              </span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3 text-xs text-gray-600">
                              <div>
                                <span className="font-medium">ID:</span> {author.id}
                              </div>
                              {author.slug && (
                                <div>
                                  <span className="font-medium">Slug:</span> /{author.slug}
                                </div>
                              )}
                              {author.color && (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Цвет:</span> 
                                  <div className="w-4 h-4 rounded border" style={{backgroundColor: author.color}}></div>
                                  <span className="font-mono text-xs">{author.color}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Кнопки управления */}
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      {/* Кнопка разворачивания/сворачивания */}
                      <button
                        onClick={() => toggleCardExpansion(author.id)}
                        className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center transition-colors"
                        title={isExpanded ? "Свернуть" : "Развернуть"}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => openModal("edit", author)}
                        className="w-10 h-10 bg-violet-50 hover:bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center transition-colors"
                        title="Редактировать"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(author.id.toString())}
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
      <AuthorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        author={selectedAuthor}
        onSubmitSuccess={fetchAuthors}
      />
    </div>
  );
}