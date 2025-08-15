"use client";

import { useEffect, useState } from "react";
import { 
  Search, 
  Calendar, 
  MessageSquare,
  Tag,
  User,
  Mail,
  Globe,
  HelpCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { SiteQuestion } from "../services/siteQuestions/siteQuestionsTypes";
import SiteQuestionService from "../services/siteQuestions/SiteQuestionService";
import QuestionModal from "../components/QuestionModal";
import { BlueButton } from "../ui/Buttons/BlueButton";
import { TrashButton } from "../ui/Buttons/TrashButton";
import { EditButton } from "../ui/Buttons/EditButton";
import { ExpandCollapseButton } from "../ui/Buttons/ExpandCollapseButton";

export default function QuestionsServicePage() {
  const [questions, setQuestions] = useState<SiteQuestion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<SiteQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const data = await SiteQuestionService.getAllQuestions();
      setQuestions(data);
    } catch {
      toast.error("Ошибка при загрузке вопросов");
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSave = async (data: Partial<SiteQuestion>) => {
    try {
      if (modalMode === "create") {
        await SiteQuestionService.createQuestion(data);
      } else if (modalMode === "edit" && selectedItem) {
        await SiteQuestionService.updateQuestion(selectedItem.id, data);
      }
      setIsModalOpen(false);
      setSelectedItem(null);
      fetchQuestions();
    } catch {
      toast.error("Ошибка при сохранении вопроса");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить вопрос?")) return;
    try {
      await SiteQuestionService.deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      toast.success("Вопрос удалён");
    } catch {
      toast.error("Ошибка при удалении");
    }
  };

  const openModal = (
    mode: "create" | "edit",
    item: SiteQuestion | null = null
  ) => {
    setModalMode(mode);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const toggleCardExpansion = (questionId: number) => {
    setExpandedCardId(expandedCardId === questionId ? null : questionId);
  };

  const filteredQuestions = questions.filter((q) =>
    q.textOriginal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопка */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Управление вопросами сайта
          </h1>
          <p className="text-gray-600">
            Модерация и управление вопросами пользователей о сайте ({questions.length})
          </p>
        </div>
        <BlueButton text="Добавить вопрос" onClick={() => openModal("create")} />
      </div>

      {/* Поиск */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск вопросов, имён, email, категорий..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Список вопросов */}
      <div className="grid gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 animate-pulse space-y-4"
            >
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            </div>
          ))
        ) : error ? (
          <div className="text-center text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl p-4">
            Произошла ошибка при загрузке вопросов. Попробуйте позже.
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center text-gray-500 text-sm bg-gray-50 border border-gray-100 rounded-xl p-4">
            {searchTerm
              ? "Вопросы не найдены по вашему запросу."
              : "Вопросы не найдены."}
          </div>
        ) : (
          filteredQuestions.map((question) => {
            const isExpanded = expandedCardId === question.id;
            
            return (
              <div
                key={question.id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-purple-50 rounded-xl">
                        <HelpCircle className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Основная информация - всегда видна */}
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {question.subject || "Без темы"}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                question.isModerated
                                  ? "bg-green-50 text-green-600"
                                  : "bg-yellow-50 text-yellow-600"
                              }`}
                            >
                              {question.isModerated ? "Одобрено" : "На модерации"}
                            </span>
                            <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                              {question.category || "Общий вопрос"}
                            </span>
                          </div>
                        </div>

                        {/* Краткая информация - всегда видна */}
                        <div className="mb-4 text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-700">Автор:</span> 
                            <span>{question.name || "Неизвестен"}</span>
                            {question.email && (
                              <>
                                <Mail className="w-4 h-4 text-gray-400 ml-2" />
                                <span>{question.email}</span>
                              </>
                            )}
                          </div>
                          <div className="line-clamp-2 text-gray-600">
                            {question.textOriginal}
                          </div>
                        </div>

                        {/* Детальная информация - показывается при разворачивании */}
                        <div className={`space-y-4 transition-all duration-300 overflow-hidden ${
                          isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          {/* Полный текст вопроса */}
                          <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700">
                                Оригинальный текст вопроса
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {question.textOriginal}
                            </p>
                          </div>

                          {/* Переводы, если есть */}
                          {(question.textUk || question.textRu) && (
                            <div className="grid md:grid-cols-2 gap-4">
                              {question.textUk && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-700">
                                      Украинский перевод
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                                    {question.textUk}
                                  </p>
                                </div>
                              )}
                              {question.textRu && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-red-600" />
                                    <span className="text-sm font-medium text-red-700">
                                      Русский перевод
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                                    {question.textRu}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Информация о категории */}
                          {question.category && (
                            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                              <div className="flex items-center gap-2 mb-2">
                                <Tag className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-700">
                                  Категория вопроса
                                </span>
                              </div>
                              <p className="text-sm text-purple-800 font-medium">
                                {question.category}
                              </p>
                            </div>
                          )}

                          {/* Ответы, если есть */}
                          {question.answers && question.answers.length > 0 && (
                            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                              <div className="flex items-center gap-2 mb-3">
                                <MessageSquare className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">
                                  Ответы ({question.answers.length})
                                </span>
                              </div>
                              <div className="space-y-2">
                                {question.answers.map((answer, index) => (
                                  <div key={index} className="p-3 bg-white rounded-lg border">
                                    <p className="text-sm text-gray-700">{answer}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Мета информация */}
                          <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Создан: {new Date(question.createdAt).toLocaleDateString("ru-RU", {
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
                              <span>ID: {question.id}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              <span>Тип: {question.targetType}</span>
                            </div>
                            {question.targetId && (
                              <div className="flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                <span>Target ID: {question.targetId}</span>
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
  onToggle={() => toggleCardExpansion(question.id)}
/>
                      
                      <EditButton
                        item={question}
                        handleClick={(q) => openModal("edit", q)}
                      />
                      <TrashButton id={question.id} handleClick={handleDelete} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Модалка */}
      <QuestionModal
        isOpen={isModalOpen}
        mode={modalMode}
        question={selectedItem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}