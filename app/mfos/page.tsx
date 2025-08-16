"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Trash2,
  Star,
  Clock,
  CreditCard,
  CheckCircle,
  XCircle,
  Calendar,
  Globe,
  Phone,
  ExternalLink,
  FileText,
  Shield,
  Zap,
  DollarSign,
  Award,
  UserCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import { Mfo } from "../services/mfos/mfoTypes";
import MfoService from "../services/mfos/mfosService";
import MfoModal from "../components/MfoModal";
import Image from "next/image";
import { BlueButton } from "../ui/Buttons/BlueButton";
import { ExpandCollapseButton } from "../ui/Buttons/ExpandCollapseButton";
import { EditButton } from "../ui/Buttons/EditButton";

export default function MfosPage() {
  const [mfos, setMfos] = useState<Mfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedMfo, setSelectedMfo] = useState<Mfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  const fetchMfos = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const data = await MfoService.getAllMfos();
      setMfos(data);
    } catch {
      toast.error("Ошибка при загрузке МФО");
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMfos();
  }, []);

  const openModal = (mode: "create" | "edit", mfo: Mfo | null = null) => {
    setModalMode(mode);
    setSelectedMfo(mfo);
    setIsModalOpen(true);
  };

  const deleteMfo = async (id: number) => {
    if (!confirm("Удалить МФО?")) return;
    try {
      await MfoService.deleteMfo(id);
      toast.success("МФО удалена");
      fetchMfos();
    } catch {
      toast.error("Ошибка при удалении");
    }
  };

  const toggleCardExpansion = (mfoId: number) => {
    setExpandedCardId(expandedCardId === mfoId ? null : mfoId);
  };

  const filteredMfos = mfos.filter(
    (mfo) =>
      mfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mfo.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mfo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Управление МФО
          </h1>
          <p className="text-gray-600">
            Список всех микрофинансовых организаций ({mfos.length})
          </p>
        </div>
        <BlueButton text="Добавить МФО" onClick={() => openModal("create")} />
      </div>

      {/* Поиск */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск МФО по названию, слагу или описанию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Список МФО */}
      <div className="grid gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 animate-pulse space-y-4"
            >
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            </div>
          ))
        ) : error ? (
          <div className="text-center text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl p-4">
            Произошла ошибка при загрузке МФО. Попробуйте позже.
          </div>
        ) : filteredMfos.length === 0 ? (
          <div className="text-center text-gray-500 text-sm bg-gray-50 border border-gray-100 rounded-xl p-4">
            {searchTerm
              ? "МФО не найдены по вашему запросу."
              : "МФО не найдены."}
          </div>
        ) : (
          filteredMfos.map((mfo) => {
            const isExpanded = expandedCardId === mfo.id;

            return (
              <div
                key={mfo.id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-1 min-w-0">
                        {/* Основная информация - всегда видна */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden">
                            <Image
                              unoptimized
                              src={mfo.logo}
                              alt={`${mfo.name} logo`}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {mfo.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              {mfo.isActive ? (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span className="text-sm text-green-600 font-medium">
                                    Активна
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <XCircle className="w-4 h-4 text-red-500" />
                                  <span className="text-sm text-red-600 font-medium">
                                    Неактивна
                                  </span>
                                </div>
                              )}
                              {mfo.licenseNumber && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  Лицензия: {mfo.licenseNumber}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Краткая информация - всегда видна */}
                        <div className="grid md:grid-cols-4 w-[70%] gap-3 mb-4 text-sm">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center gap-1 mb-1">
                              <DollarSign className="w-4 h-4 text-blue-600" />
                              <span className="text-blue-700 font-medium">
                                Сумма
                              </span>
                            </div>
                            <p className="font-semibold text-gray-800">
                              {mfo.minAmount.toLocaleString()} -{" "}
                              {mfo.maxAmount.toLocaleString()} ₴
                            </p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <div className="flex items-center gap-1 mb-1">
                              <Clock className="w-4 h-4 text-purple-600" />
                              <span className="text-purple-700 font-medium">
                                Срок
                              </span>
                            </div>
                            <p className="font-semibold text-gray-800">
                              {mfo.minTerm} - {mfo.maxTerm} дней
                            </p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="w-4 h-4 text-orange-600" />
                              <span className="text-orange-700 font-medium">
                                Рейтинг
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-800">
                                {mfo.rating}
                              </p>
                              <span className="text-xs text-gray-500">
                                ({mfo.reviews})
                              </span>
                            </div>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center gap-1 mb-1">
                              <Award className="w-4 h-4 text-green-600" />
                              <span className="text-green-700 font-medium">
                                Одобрение
                              </span>
                            </div>
                            <p className="font-semibold text-gray-800">
                              {mfo.approvalRate}%
                            </p>
                          </div>
                        </div>

                        {/* Основные преимущества - всегда видны */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {mfo.isFirstLoanZero && (
                            <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              Первый займ 0%
                            </span>
                          )}
                          {mfo.isInstantApproval && (
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Мгновенное одобрение
                            </span>
                          )}
                          <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Решение: {mfo.decisionTime}
                          </span>
                          <span className="bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full text-xs font-medium">
                            {mfo.rateMin}% - {mfo.rateMax}% в день
                          </span>
                        </div>

                        {/* Детальная информация - показывается при разворачивании */}
                        <div
                          className={`space-y-4 transition-all duration-300 overflow-hidden ${
                            isExpanded
                              ? "max-h-none opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          {/* Описание */}
                          {mfo.description && (
                            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">
                                  Описание
                                </span>
                              </div>
                              <p className="text-sm text-blue-600">
                                {mfo.description}
                              </p>
                            </div>
                          )}

                          {/* Требования и условия */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <UserCheck className="w-4 h-4 text-gray-600" />
                                  <span className="text-sm font-medium text-gray-700">
                                    Требования к заемщику
                                  </span>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <p>
                                    <span className="font-medium">
                                      Возраст:
                                    </span>{" "}
                                    {mfo.ageFrom} - {mfo.ageTo} лет
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Гражданство:
                                    </span>{" "}
                                    {mfo.citizenship}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Документы:
                                    </span>{" "}
                                    {mfo.documents}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Clock className="w-4 h-4 text-gray-600" />
                                  <span className="text-sm font-medium text-gray-700">
                                    График работы
                                  </span>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <p>
                                    <span className="font-medium">Будни:</span>{" "}
                                    {mfo.workTimeWeekdays}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Выходные:
                                    </span>{" "}
                                    {mfo.workTimeWeekend}
                                  </p>
                                  <p>
                                    <span className="font-medium">Онлайн:</span>{" "}
                                    {mfo.workTimeOnline}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Дополнительные преимущества */}
                          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                            <div className="flex items-center gap-2 mb-3">
                              <Shield className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-700">
                                Дополнительные преимущества
                              </span>
                            </div>
                            <div className="grid md:grid-cols-3 gap-3">
                              {mfo.isNoIncomeProof && (
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Без справки о доходах</span>
                                </div>
                              )}
                              {mfo.is24Support && (
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Поддержка 24/7</span>
                                </div>
                              )}
                              {mfo.isSafeTransactions && (
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Безопасные транзакции</span>
                                </div>
                              )}
                              {mfo.isFlexibleTerms && (
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Гибкие условия</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Контакты и ссылки */}
                          <div className="grid md:grid-cols-2 gap-4">
                            {(mfo.website || mfo.phone) && (
                              <div className="p-3 bg-indigo-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Globe className="w-4 h-4 text-indigo-600" />
                                  <span className="text-sm font-medium text-indigo-700">
                                    Контакты
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {mfo.website && (
                                    <a
                                      href={mfo.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      Официальный сайт
                                    </a>
                                  )}
                                  {mfo.phone && (
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                      <Phone className="w-3 h-3" />
                                      <span>{mfo.phone}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="p-3 bg-purple-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <CreditCard className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-700">
                                  Технические данные
                                </span>
                              </div>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>
                                  <span className="font-medium">Slug:</span>{" "}
                                  {mfo.slug}
                                </p>
                                <p>
                                  <span className="font-medium">ID:</span>{" "}
                                  {mfo.id}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Мета информация */}
                          <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Создано:{" "}
                                {new Date(mfo.createdAt).toLocaleDateString(
                                  "ru-RU"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Обновлено:{" "}
                                {new Date(mfo.updatedAt).toLocaleDateString(
                                  "ru-RU"
                                )}
                              </span>
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
                        onToggle={() => toggleCardExpansion(mfo.id)}
                      />

                      <EditButton
                        item={mfo}
                        handleClick={(mfo) => openModal("edit", mfo)}
                      />
                      <button
                        onClick={() => deleteMfo(mfo.id)}
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

      {/* Модальное окно */}
      <MfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        mfo={selectedMfo || undefined}
        onSubmitSuccess={fetchMfos}
      />
    </div>
  );
}
