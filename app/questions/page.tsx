/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Calendar,
  MessageSquare,
  Tag,
  User,
  Mail,
  Building2,
  Star,
  Clock,
  Globe,
  CheckCircle,
  AlertCircle,
  Phone,
  ExternalLink,
  Edit3,
} from "lucide-react";
import { toast } from "react-toastify";
import QuestionModal from "../components/QuestionModal";
import AnswerModal from "../components/AnswerModal";
import EditAnswerModal from "../components/EditAnswerModal"; // Импорт новой модалки
import { BlueButton } from "../ui/Buttons/BlueButton";
import { TrashButton } from "../ui/Buttons/TrashButton";
import { EditButton } from "../ui/Buttons/EditButton";
import QuestionService from "../services/Question/QuestionService";
import { Question } from "../services/Question/questionTypes";
import { ExpandCollapseButton } from "../ui/Buttons/ExpandCollapseButton";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  
  // Состояние для модалки ответов
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);

  // Состояние для модалки редактирования ответов
  const [isEditAnswerModalOpen, setIsEditAnswerModalOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const data = await QuestionService.getAllQuestions();
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

  const handleSave = async (data: Partial<Question>) => {
    try {
      if (modalMode === "create") {
        await QuestionService.createQuestion(data);
      } else if (modalMode === "edit" && selectedItem) {
        await QuestionService.updateQuestion(selectedItem.id, data);
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
      await QuestionService.deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      toast.success("Вопрос удалён");
    } catch {
      toast.error("Ошибка при удалении");
    }
  };

  const openModal = (mode: "create" | "edit", item: Question | null = null) => {
    setModalMode(mode);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const toggleCardExpansion = (questionId: number) => {
    setExpandedCardId(expandedCardId === questionId ? null : questionId);
  };

  // Функции для работы с ответами
  const openAnswerModal = (questionId: number) => {
    setSelectedQuestionId(questionId);
    setIsAnswerModalOpen(true);
  };

  const handleSaveAnswer = async (data: any) => {
    if (!selectedQuestionId) return;
    
    try {
      const response = await fetch(`/api/questions/${selectedQuestionId}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при сохранении ответа');
      }
      
      setIsAnswerModalOpen(false);
      setSelectedQuestionId(null);
      fetchQuestions();
      toast.success('Ответ успешно добавлен');
    } catch (error) {
      toast.error('Ошибка при добавлении ответа');
    }
  };

  // Функции для редактирования ответов
  const openEditAnswerModal = (answer: any) => {
    setSelectedAnswer(answer);
    setIsEditAnswerModalOpen(true);
  };

  const handleSaveEditAnswer = async (answerId: number, data: any) => {
    try {
      const response = await fetch(`/api/questions/answers/${answerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при обновлении ответа');
      }
      
      setIsEditAnswerModalOpen(false);
      setSelectedAnswer(null);
      fetchQuestions();
      toast.success('Ответ успешно обновлён');
    } catch (error) {
      toast.error('Ошибка при обновлении ответа');
    }
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.textOriginal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопка */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Управление общими вопросами
          </h1>
          <p className="text-gray-600">
            Модерация и управление вопросами пользователей ({questions.length})
          </p>
        </div>
        <BlueButton
          text="Добавить вопрос"
          onClick={() => openModal("create")}
        />
      </div>

      {/* Поиск */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск вопросов, имён, email..."
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
                      <div className="p-3 bg-blue-50 rounded-xl">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
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
                              {question.isModerated
                                ? "Одобрено"
                                : "На модерации"}
                            </span>
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                              {question.category || question.targetType}
                            </span>
                          </div>
                        </div>

                        {/* Краткая информация - всегда видна */}
                        <div className="mb-4 text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-700">
                              Автор:
                            </span>
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
                        <div
                          className={`space-y-4 transition-all duration-300 overflow-hidden ${
                            isExpanded
                              ? "max-h-none opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          {/* Полный текст вопроса */}
                          <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700">
                                Текст вопроса
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
                                      Перевод UK
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                                    {question.textUk}
                                  </p>
                                </div>
                              )}
                              {question.textRu && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-red-600" />
                                    <span className="text-sm font-medium text-red-700">
                                      Перевод RU
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-lg">
                                    {question.textRu}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Ответы на вопрос */}
                          {question.answers && question.answers.length > 0 ? (
                            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                              <div className="flex items-center gap-2 mb-3">
                                <MessageSquare className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">
                                  Ответы ({question.answers.length})
                                </span>
                                <button
                                  onClick={() => openAnswerModal(question.id)}
                                  className="ml-auto px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 transition-colors"
                                >
                                  + Добавить ответ
                                </button>
                              </div>
                              <div className="space-y-3">
                                {question.answers.map((answer) => (
                                  <div
                                    key={answer.id}
                                    className={`p-3 rounded-lg border ${
                                      answer.expert 
                                        ? 'bg-blue-50 border-blue-200' 
                                        : 'bg-white border-gray-200'
                                    }`}
                                  >
                                    {/* Информация об авторе ответа */}
                                    <div className="flex items-center gap-2 mb-2">
                                      {answer.expert ? (
                                        <>
                                          {answer.expert.avatar && (
                                            <img
                                              src={answer.expert.avatar}
                                              alt={answer.expert.name}
                                              className="w-6 h-6 rounded-full"
                                            />
                                          )}
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-blue-700">
                                              {answer.expert.name}
                                            </span>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                              Эксперт
                                            </span>
                                          </div>
                                          {answer.expert.position && (
                                            <span className="text-xs text-gray-500">
                                              • {answer.expert.position}
                                            </span>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          <User className="w-4 h-4 text-gray-500" />
                                          <span className="text-sm font-medium text-gray-600">
                                            {answer.authorName || 'Пользователь'}
                                          </span>
                                          {answer.authorEmail && (
                                            <span className="text-xs text-gray-500">
                                              • {answer.authorEmail}
                                            </span>
                                          )}
                                        </>
                                      )}
                                      <span className="text-xs text-gray-400 ml-auto">
                                        {new Date(answer.createdAt).toLocaleDateString('ru-RU')}
                                      </span>
                                      
                                      {/* Кнопка редактирования ответа */}
                                      <button
                                        onClick={() => openEditAnswerModal(answer)}
                                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors ml-2"
                                        title="Редактировать ответ"
                                      >
                                        <Edit3 className="w-4 h-4" />
                                      </button>
                                    </div>
                                    
                                    {/* Текст ответа */}
                                    <p className={`text-sm ${
                                      answer.expert ? 'text-blue-800' : 'text-gray-700'
                                    }`}>
                                      {answer.textOriginal}
                                    </p>

                                    {/* Статус модерации */}
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className={`px-2 py-1 rounded-full text-xs ${
                                        answer.isModerated
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-yellow-100 text-yellow-700'
                                      }`}>
                                        {answer.isModerated ? 'Одобрено' : 'На модерации'}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            /* Кнопка добавления первого ответа */
                            <div className="mt-4">
                              <button
                                onClick={() => openAnswerModal(question.id)}
                                className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors"
                              >
                                + Добавить первый ответ на вопрос
                              </button>
                            </div>
                          )}

                          {/* Информация о связанном МФО */}
                          {question.mfo && (
                            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                              <div className="flex items-center gap-2 mb-3">
                                <Building2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">
                                  Связанное МФО
                                </span>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                                <img
                                  src={question.mfo.logo}
                                  alt={question.mfo.name}
                                  className="w-12 h-12 rounded object-cover"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="text-base font-semibold text-gray-800">
                                      {question.mfo.name}
                                    </p>
                                    {question.mfo.isActive ? (
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <AlertCircle className="w-4 h-4 text-red-500" />
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500 mb-2">
                                    <span className="flex items-center gap-1">
                                      <Star className="w-3 h-3" />
                                      {question.mfo.rating} (
                                      {question.mfo.reviews} отзывов)
                                    </span>
                                    <span>
                                      {question.mfo.minAmount}-
                                      {question.mfo.maxAmount}₴
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {question.mfo.decisionTime}
                                    </span>
                                    <span>
                                      Одобрение: {question.mfo.approvalRate}%
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {question.mfo.isFirstLoanZero && (
                                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                        0% первый займ
                                      </span>
                                    )}
                                    {question.mfo.isInstantApproval && (
                                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                        Мгновенное одобрение
                                      </span>
                                    )}
                                    {question.mfo.is24Support && (
                                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                        24/7 поддержка
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-500 mb-1">
                                    Лицензия
                                  </p>
                                  <p className="text-sm font-medium text-gray-700">
                                    {question.mfo.licenseNumber}
                                  </p>
                                  {question.mfo.website && (
                                    <a
                                      href={question.mfo.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs mt-1"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      Сайт
                                    </a>
                                  )}
                                </div>
                              </div>

                              {/* Дополнительная информация о МФО */}
                              <div className="mt-3 grid md:grid-cols-2 gap-3 text-xs text-gray-600">
                                <div>
                                  <span className="font-medium">Возраст:</span>{" "}
                                  {question.mfo.ageFrom}-{question.mfo.ageTo}{" "}
                                  лет
                                </div>
                                <div>
                                  <span className="font-medium">
                                    Документы:
                                  </span>{" "}
                                  {question.mfo.documents}
                                </div>
                                <div>
                                  <span className="font-medium">
                                    Гражданство:
                                  </span>{" "}
                                  {question.mfo.citizenship}
                                </div>
                                {question.mfo.phone && (
                                  <div className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    <span>{question.mfo.phone}</span>
                                  </div>
                                )}
                              </div>

                              {question.mfo.description && (
                                <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                                  <span className="font-medium">Описание:</span>{" "}
                                  {question.mfo.description}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Мета информация */}
                          <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Создан:{" "}
                                {new Date(
                                  question.createdAt
                                ).toLocaleDateString("ru-RU")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              <span>ID: {question.targetId}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              <span>Тип: {question.targetType}</span>
                            </div>
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
                      <TrashButton
                        id={question.id}
                        handleClick={handleDelete}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Модалка для вопросов */}
      <QuestionModal
        isOpen={isModalOpen}
        mode={modalMode}
        question={selectedItem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      {/* Модалка для ответов */}
      <AnswerModal
        isOpen={isAnswerModalOpen}
        onClose={() => {
          setIsAnswerModalOpen(false);
          setSelectedQuestionId(null);
        }}
        onSave={handleSaveAnswer}
        questionId={selectedQuestionId || 0}
      />

      {/* Модалка для редактирования ответов */}
      <EditAnswerModal
        isOpen={isEditAnswerModalOpen}
        onClose={() => {
          setIsEditAnswerModalOpen(false);
          setSelectedAnswer(null);
        }}
        onSave={handleSaveEditAnswer}
        answer={selectedAnswer}
      />
    </div>
  );
}