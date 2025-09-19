/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
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
  Trash2,
  ThumbsUp,
} from "lucide-react";
import { Review } from "@/app/services/reviews/reviewsTypes";
import DashedButton from "@/app/ui/Buttons/DashedButton";
import { ExpandCollapseButton } from "@/app/ui/Buttons/ExpandCollapseButton";
import { EditButton } from "@/app/ui/Buttons/EditButton";
import { TrashButton } from "@/app/ui/Buttons/TrashButton";

interface ReviewCardProps {
  review: Review;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onEdit: (review: Review) => void;
  onDelete: (id: number) => void;
  onAddAnswer: (reviewId: number) => void;
  onEditAnswer: (answer: any) => void;
  onDeleteAnswer: (answerId: number) => void;
}

export default function ReviewCard({
  review,
  isExpanded,
  onToggleExpansion,
  onEdit,
  onDelete,
  onAddAnswer,
  onEditAnswer,
  onDeleteAnswer,
}: ReviewCardProps) {
  // Функция для отображения звездного рейтинга
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 bg-orange-50 rounded-xl">
              <ThumbsUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              {/* Основная информация - всегда видна */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <span className="text-lg font-semibold text-gray-800">
                    {review.rating}/5
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      review.isModerated
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    {review.isModerated ? "Одобрено" : "На модерации"}
                  </span>
                  <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                    {review.targetType === "mfo" ? "МФО" : review.targetType}
                  </span>
                </div>
              </div>

              {/* Краткая информация - всегда видна */}
              <div className="mb-4 text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-700">Автор:</span>
                  <span>{review.authorName || "Анонимный отзыв"}</span>
                  {review.authorEmail && (
                    <>
                      <Mail className="w-4 h-4 text-gray-400 ml-2" />
                      <span>{review.authorEmail}</span>
                    </>
                  )}
                </div>
                <div className="line-clamp-2 text-gray-600">
                  {review.textOriginal}
                </div>
              </div>

              {/* Детальная информация - показывается при разворачивании */}
              <div
                className={`space-y-4 transition-all duration-300 overflow-hidden ${
                  isExpanded ? "max-h-none opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {/* Полный текст отзыва */}
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Текст отзыва
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {review.textOriginal}
                  </p>
                </div>

                {/* Переводы, если есть */}
                {(review.textUk || review.textRu) && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {review.textUk && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">
                            Перевод UK
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                          {review.textUk}
                        </p>
                      </div>
                    )}
                    {review.textRu && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-700">
                            Перевод RU
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-lg">
                          {review.textRu}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Ответы на отзыв */}
                {review.answers && review.answers.length > 0 ? (
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        Ответы ({review.answers.length})
                      </span>
                      <button
                        onClick={() => onAddAnswer(review.id)}
                        className="ml-auto px-3 py-1 cursor-pointer bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 transition-colors"
                      >
                        + Добавить ответ
                      </button>
                    </div>
                    <div className="space-y-3">
                      {review.answers.map((answer) => (
                        <div
                          key={answer.id}
                          className={`p-3 rounded-lg border ${
                            answer.expert
                              ? "bg-blue-50 border-blue-200"
                              : "bg-white border-gray-200"
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
                                  {answer.authorName || "Пользователь"}
                                </span>
                                {answer.authorEmail && (
                                  <span className="text-xs text-gray-500">
                                    • {answer.authorEmail}
                                  </span>
                                )}
                              </>
                            )}
                            <span className="text-xs text-gray-400 ml-auto">
                              {new Date(answer.createdAt).toLocaleDateString(
                                "ru-RU"
                              )}
                            </span>

                            {/* Кнопки редактирования и удаления ответа */}
                            <div className="flex items-center gap-1 ml-2">
                              <button
                                onClick={() => onEditAnswer(answer)}
                                className="p-1 cursor-pointer text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Редактировать ответ"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteAnswer(answer.id)}
                                className="p-1 text-gray-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Удалить ответ"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Текст ответа */}
                          <p
                            className={`text-sm ${
                              answer.expert ? "text-blue-800" : "text-gray-700"
                            }`}
                          >
                            {answer.textOriginal}
                          </p>

                          {/* Статус модерации */}
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                answer.isModerated
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {answer.isModerated ? "Одобрено" : "На модерации"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Кнопка добавления первого ответа */
                  <DashedButton onClick={() => onAddAnswer(review.id)} />
                )}

                {/* Информация о связанном МФО */}
                {review.mfo && (
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        Связанное МФО
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <img
                        src={review.mfo.logo}
                        alt={review.mfo.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-base font-semibold text-gray-800">
                            {review.mfo.name}
                          </p>
                          {review.mfo.isActive ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {review.mfo.rating} ({review.mfo.reviews}{" "}
                            отзывов)
                          </span>
                          <span>
                            {review.mfo.minAmount}-{review.mfo.maxAmount}₴
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {review.mfo.decisionTime}
                          </span>
                          <span>Одобрение: {review.mfo.approvalRate}%</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {review.mfo.isFirstLoanZero && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              0% первый займ
                            </span>
                          )}
                          {review.mfo.isInstantApproval && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              Мгновенное одобрение
                            </span>
                          )}
                          {review.mfo.is24Support && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                              24/7 поддержка
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Лицензия</p>
                        <p className="text-sm font-medium text-gray-700">
                          {review.mfo.licenseNumber}
                        </p>
                        {review.mfo.website && (
                          <a
                            href={review.mfo.website}
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
                        {review.mfo.ageFrom}-{review.mfo.ageTo} лет
                      </div>
                      <div>
                        <span className="font-medium">Документы:</span>{" "}
                        {review.mfo.documents}
                      </div>
                      <div>
                        <span className="font-medium">Гражданство:</span>{" "}
                        {review.mfo.citizenship}
                      </div>
                      {review.mfo.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{review.mfo.phone}</span>
                        </div>
                      )}
                    </div>

                    {review.mfo.description && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600 
                        whitespace-pre-wrap break-all">
          <span className="font-medium">Описание:</span>{" "}
          {review.mfo.description}
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
                      {new Date(review.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>ID: {review.targetId}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Тип: {review.targetType}</span>
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
              onToggle={onToggleExpansion}
            />

            <EditButton item={review} handleClick={onEdit} />
            <TrashButton id={review.id} handleClick={onDelete} />
          </div>
        </div>
      </div>
    </div>
  );
}