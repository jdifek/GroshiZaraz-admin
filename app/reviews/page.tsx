/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import { BlueButton } from "../ui/Buttons/BlueButton";
import ReviewCard from "../components/Cards/ReviewCard";
import ReviewModal from "../components/ReviewModal";
import ReviewAnswerModal from "../components/ReviewAnswerModal";
import EditReviewAnswerModal from "../components/EditReviewAnswerModal";
import reviewsService from "../services/reviews/reviewsService";
import { Review } from "../services/reviews/reviewsTypes";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  // Состояние для модалки ответов
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  // Состояние для модалки редактирования ответов
  const [isEditAnswerModalOpen, setIsEditAnswerModalOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const data = await reviewsService.getAllReviews();
      setReviews(data);
    } catch {
      toast.error("Ошибка при загрузке отзывов");
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSave = async (data: Partial<Review>) => {
    try {
      if (modalMode === "create") {
        await reviewsService.createReview(data);
      } else if (modalMode === "edit" && selectedItem) {
        await reviewsService.updateReview(selectedItem.id, data);
      }
      setIsModalOpen(false);
      setSelectedItem(null);
      fetchReviews();
    } catch {
      toast.error("Ошибка при сохранении отзыва");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить отзыв?")) return;
    try {
      await reviewsService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Отзыв удалён");
    } catch {
      toast.error("Ошибка при удалении");
    }
  };

  const openModal = (mode: "create" | "edit", item: Review | null = null) => {
    setModalMode(mode);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const toggleCardExpansion = (reviewId: number) => {
    setExpandedCardId(expandedCardId === reviewId ? null : reviewId);
  };

  // Функции для работы с ответами
  const openAnswerModal = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    setIsAnswerModalOpen(true);
  };

  const handleSaveAnswer = async (data: any) => {
    if (!selectedReviewId) return;
  
    try {
      const payload = {
        reviewId: selectedReviewId,
        ...data, // просто берём всё, что вернула модалка
      };
  
      const response = await fetch(
        `http://localhost:5000/api/review-answers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) {
        throw new Error("Ошибка при сохранении ответа");
      }
  
      setIsAnswerModalOpen(false);
      setSelectedReviewId(null);
      fetchReviews();
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
        `http://localhost:5000/api/review-answers/${answerId}`,
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
      fetchReviews();
      toast.success("Ответ успешно обновлён");
    } catch (error) {
      toast.error("Ошибка при обновлении ответа");
    }
  };

  // Функция для удаления ответа
  const handleDeleteAnswer = async (answerId: number) => {
    if (!confirm("Удалить ответ?")) return;
    
    try {
      const response = await fetch(
        `http://localhost:5000/api/review-answers/${answerId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при удалении ответа");
      }

      fetchReviews();
      toast.success("Ответ успешно удалён");
    } catch (error) {
      toast.error("Ошибка при удалении ответа");
    }
  };

  const filteredReviews = reviews.filter(
    (r) =>
      r.textOriginal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rating.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопка */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Управление отзывами
          </h1>
          <p className="text-gray-600">
            Модерация и управление отзывами пользователей ({reviews.length})
          </p>
        </div>
        <BlueButton
          text="Добавить отзыв"
          onClick={() => openModal("create")}
        />
      </div>

      {/* Поиск */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск отзывов, рейтинга..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Список отзывов */}
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
            Произошла ошибка при загрузке отзывов. Попробуйте позже.
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center text-gray-500 text-sm bg-gray-50 border border-gray-100 rounded-xl p-4">
            {searchTerm
              ? "Отзывы не найдены по вашему запросу."
              : "Отзывы не найдены."}
          </div>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isExpanded={expandedCardId === review.id}
              onToggleExpansion={() => toggleCardExpansion(review.id)}
              onEdit={(r) => openModal("edit", r)}
              onDelete={handleDelete}
              onAddAnswer={openAnswerModal}
              onEditAnswer={openEditAnswerModal}
              onDeleteAnswer={handleDeleteAnswer}
            />
          ))
        )}
      </div>

      {/* Модалка для отзывов */}
      <ReviewModal
        isOpen={isModalOpen}
        mode={modalMode}
        review={selectedItem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      {/* Модалка для ответов */}
      <ReviewAnswerModal
        isOpen={isAnswerModalOpen}
        onClose={() => {
          setIsAnswerModalOpen(false);
          setSelectedReviewId(null);
        }}
        onSave={handleSaveAnswer}
        reviewId={selectedReviewId || 0}
      />

      {/* Модалка для редактирования ответов */}
      <EditReviewAnswerModal
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