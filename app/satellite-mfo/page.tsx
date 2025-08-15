/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Trash2,
  Satellite,
  Globe,
  FileText,
  Tag,
  Key,
  Calendar,
  Building2,
  Star,
  Users,
} from "lucide-react";
import MfoSatelliteService from "../services/MfoSatellite/MfoSatelliteService";
import { BlueButton } from "../ui/Buttons/BlueButton";
import { MfoSatellite } from "../services/MfoSatellite/mfoSatelliteTypes";
import { ExpandCollapseButton } from "../ui/Buttons/ExpandCollapseButton";
import { EditButton } from "../ui/Buttons/EditButton";

// Типы данных на основе вашего JSON

const SatelliteModal = ({ isOpen, onClose, mode }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold mb-4">
          {mode === "create" ? "Создать сателлит" : "Редактировать сателлит"}
        </h3>
        <p className="text-gray-600 mb-4">Форма для работы с сателлитами...</p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SatellitesPage() {
  const [satellites, setSatellites] = useState<MfoSatellite[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedSatellite, setSelectedSatellite] =
    useState<MfoSatellite | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedSatelliteId, setExpandedSatelliteId] = useState<number | null>(
    null
  );
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  const fetchSatellites = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const data = await MfoSatelliteService.getAllSatellites();
      setSatellites(data);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSatellites();
  }, []);

  const openModal = (
    mode: "create" | "edit",
    satellite: MfoSatellite | null = null
  ) => {
    setModalMode(mode);
    setSelectedSatellite(satellite);
    setIsModalOpen(true);
  };

  const deleteSatellite = async (id: number) => {
    try {
      await MfoSatelliteService.deleteSatellite(id);
      fetchSatellites();
    } catch {
      // Обработка ошибки
    }
  };

  const toggleCardExpansion = (satelliteId: number) => {
    setExpandedCardId(expandedCardId === satelliteId ? null : satelliteId);
    // Сбрасываем расширение МФО при сворачивании карточки
    if (expandedCardId === satelliteId) {
      setExpandedSatelliteId(null);
    }
  };

  const filteredSatellites = satellites.filter((satellite) => {
    const searchTarget =
      `${satellite.titleUk} ${satellite.titleRu} ${satellite.metaTitleUk} ${satellite.metaTitleRu} ${satellite.descriptionUk} ${satellite.descriptionRu}`.toLowerCase();
    return searchTarget.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 mx-auto ">
      {/* Заголовок */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Управление сателлитами
          </h1>
          <p className="text-gray-600">
            Список всех сателлитов ({satellites.length})
          </p>
        </div>
        <BlueButton
          text="Добавить МФО Сателлита"
          onClick={() => openModal("create")}
        />
      </div>

      {/* Поиск */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск сателлитов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Список */}
      <div className="grid gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 animate-pulse space-y-4"
            >
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))
        ) : error ? (
          <div className="text-center text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl p-4">
            Произошла ошибка при загрузке сателлитов. Попробуйте позже.
          </div>
        ) : filteredSatellites.length === 0 ? (
          <div className="text-center text-gray-500 text-sm bg-gray-50 border border-gray-100 rounded-xl p-4">
            {searchTerm
              ? "Сателлиты не найдены по вашему запросу."
              : "Сателлиты не найдены."}
          </div>
        ) : (
          filteredSatellites.map((satellite) => {
            const isExpanded = expandedCardId === satellite.id;

            return (
              <div
                key={satellite.id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-purple-50 rounded-xl">
                        <Satellite className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Основная информация - всегда видна */}
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {satellite.titleUk}
                          </h3>
                          {satellite.titleUk !== satellite.titleRu && (
                            <span className="text-sm text-gray-500">
                              / {satellite.titleRu}
                            </span>
                          )}
                        </div>

                        {/* Краткая информация - всегда видна */}
                        <div className="mb-4 text-sm text-gray-600 space-y-1">
                          <div>
                            <span className="font-medium text-gray-700">
                              Slug:
                            </span>{" "}
                            {satellite.slugUk}
                            {satellite.slugUk !== satellite.slugRu &&
                              ` / ${satellite.slugRu}`}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              МФО:
                            </span>{" "}
                            {satellite.mfoLinks?.length || 0} связанных
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
                          {/* Связь с ключом */}
                          {satellite.key && (
                            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                              <div className="flex items-center gap-2 mb-2">
                                <Key className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">
                                  Родительский ключ
                                </span>
                              </div>
                              <p className="text-sm text-blue-600">
                                {satellite.key.keyUk}{" "}
                                {satellite.key.keyUk !== satellite.key.keyRu &&
                                  `/ ${satellite.key.keyRu}`}
                              </p>
                            </div>
                          )}

                          {/* Основная информация в сетке */}
                          <div className="grid md:grid-cols-2 gap-4">
                            {/* Meta Title */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 mb-2">
                                <Globe className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-gray-700">
                                  Meta Title
                                </span>
                              </div>
                              <div className="pl-6 space-y-1">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium text-blue-600">
                                    UK:
                                  </span>{" "}
                                  {satellite.metaTitleUk}
                                </p>
                                {satellite.metaTitleUk !==
                                  satellite.metaTitleRu && (
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium text-red-600">
                                      RU:
                                    </span>{" "}
                                    {satellite.metaTitleRu}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* URL Slugs */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 mb-2">
                                <Tag className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-gray-700">
                                  URL Slugs
                                </span>
                              </div>
                              <div className="pl-6 space-y-1">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium text-blue-600">
                                    UK:
                                  </span>
                                  <span className="ml-2 px-2 py-1 bg-white border rounded text-xs font-mono">
                                    {satellite.slugUk}
                                  </span>
                                </p>
                                {satellite.slugUk !== satellite.slugRu && (
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium text-red-600">
                                      RU:
                                    </span>
                                    <span className="ml-2 px-2 py-1 bg-white border rounded text-xs font-mono">
                                      {satellite.slugRu}
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Описания */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-medium text-gray-700">
                                  Описания
                                </span>
                              </div>
                              <div className="pl-6 space-y-2">
                                <div>
                                  <span className="text-xs font-medium text-blue-600 block mb-1">
                                    UK:
                                  </span>
                                  <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded-lg">
                                    {satellite.descriptionUk}
                                  </p>
                                </div>
                                {satellite.descriptionUk !==
                                  satellite.descriptionRu && (
                                  <div>
                                    <span className="text-xs font-medium text-red-600 block mb-1">
                                      RU:
                                    </span>
                                    <p className="text-sm text-gray-600 bg-red-50 p-2 rounded-lg">
                                      {satellite.descriptionRu}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 mb-2">
                                <Globe className="w-4 h-4 text-indigo-600" />
                                <span className="text-sm font-medium text-gray-700">
                                  Meta Description
                                </span>
                              </div>
                              <div className="pl-6 space-y-2">
                                <div>
                                  <span className="text-xs font-medium text-blue-600 block mb-1">
                                    UK:
                                  </span>
                                  <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded-lg">
                                    {satellite.metaDescUk}
                                  </p>
                                </div>
                                {satellite.metaDescUk !==
                                  satellite.metaDescRu && (
                                  <div>
                                    <span className="text-xs font-medium text-red-600 block mb-1">
                                      RU:
                                    </span>
                                    <p className="text-sm text-gray-600 bg-red-50 p-2 rounded-lg">
                                      {satellite.metaDescRu}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* МФО ссылки */}
                          {satellite.mfoLinks &&
                            satellite.mfoLinks.length > 0 && (
                              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                                <div className="flex items-center gap-2 mb-3">
                                  <Building2 className="w-4 h-4 text-green-600" />
                                  <span className="text-sm font-medium text-green-700">
                                    Связанные МФО ({satellite.mfoLinks.length})
                                  </span>
                                </div>
                                <div className="grid gap-2">
                                  {(expandedSatelliteId === satellite.id
                                    ? satellite.mfoLinks
                                    : satellite.mfoLinks.slice(0, 3)
                                  ).map((link) => (
                                    <div
                                      key={link.id}
                                      className="flex items-center gap-3 p-2 bg-white rounded-lg border"
                                    >
                                      <img
                                        src={link.mfo.logo}
                                        alt={link.mfo.name}
                                        className="w-8 h-8 rounded object-cover"
                                      />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800">
                                          {link.mfo.name}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                          <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3" />
                                            {link.mfo.rating}
                                          </span>
                                          <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {link.mfo.reviews} отзывов
                                          </span>
                                          <span>
                                            {link.mfo.minAmount}-
                                            {link.mfo.maxAmount}₴
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {satellite.mfoLinks.length > 3 && (
                                  <button
                                    onClick={() =>
                                      setExpandedSatelliteId(
                                        expandedSatelliteId === satellite.id
                                          ? null
                                          : satellite.id
                                      )
                                    }
                                    className="text-green-600 text-xs mt-1 cursor-pointer underline"
                                  >
                                    {expandedSatelliteId === satellite.id
                                      ? "Свернуть"
                                      : `Показать все (${satellite.mfoLinks.length})`}
                                  </button>
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
                                  satellite.createdAt
                                ).toLocaleDateString("ru-RU")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Обновлён:{" "}
                                {new Date(
                                  satellite.updatedAt
                                ).toLocaleDateString("ru-RU")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      {/* Кнопка разворачивания/сворачивания */}
                      <ExpandCollapseButton
                        isExpanded={isExpanded}
                        onToggle={() => toggleCardExpansion(satellite.id)}
                      />

                      <EditButton
                        item={satellite}
                        handleClick={(satellite) =>
                          openModal("edit", satellite)
                        }
                      />
                      <button
                        onClick={() => deleteSatellite(satellite.id)}
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
      <SatelliteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        satelliteData={selectedSatellite || undefined}
        onSubmitSuccess={fetchSatellites}
      />
    </div>
  );
}
