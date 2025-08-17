/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import QuestionModal from "../components/QuestionModal";
import AnswerModal from "../components/AnswerModal";
import EditAnswerModal from "../components/EditAnswerModal";
import { BlueButton } from "../ui/Buttons/BlueButton";
import QuestionService from "../services/Question/QuestionService";
import { Question } from "../services/Question/questionTypes";
import QuestionCard from "../components/Cards/QuestionCard";

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
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );

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
      const response = await fetch(
        `/api/questions/${selectedQuestionId}/answers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при сохранении ответа");
      }

      setIsAnswerModalOpen(false);
      setSelectedQuestionId(null);
      fetchQuestions();
      toast.success("Ответ успешно добавлен");
    } catch (error) {
      toast.error("Ошибка при добавлении ответа");
    }
  };

  // Функции для редактирования ответов
  const openEditAnswerModal = (answer: any) => {
    setSelectedAnswer(answer);
    setIsEditAnswerModalOpen(true);
  };

  const handleSaveEditAnswer = async (answerId: number, data: any) => {
    try {
      const response = await fetch(
        `
http://localhost:5000/api/question-answers/${answerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при обновлении ответа");
      }

      setIsEditAnswerModalOpen(false);
      setSelectedAnswer(null);
      fetchQuestions();
      toast.success("Ответ успешно обновлён");
    } catch (error) {
      toast.error("Ошибка при обновлении ответа");
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
          filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              isExpanded={expandedCardId === question.id}
              onToggleExpansion={() => toggleCardExpansion(question.id)}
              onEdit={(q) => openModal("edit", q)}
              onDelete={handleDelete}
              onAddAnswer={openAnswerModal}
              onEditAnswer={openEditAnswerModal}
            />
          ))
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
