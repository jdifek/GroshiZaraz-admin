/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Trash2,
  Key,
  Satellite,
  Calendar,
  Globe,
  FileText,
  Tag,
  Building2,
  Star,
  Users,
  Plus,
} from "lucide-react";
import MfoSatelliteKeyService from "../services/MfoSatelliteKey/MfoSatelliteKeyService";
import { BlueButton } from "../ui/Buttons/BlueButton";
import { MfoSatelliteKey } from "../services/MfoSatelliteKey/mfoSatelliteKeyTypes";
import { EditButton } from "../ui/Buttons/EditButton";
import { DeleteButton } from "../ui/Buttons/DeleteButton";
import { ExpandCollapseButton } from "../ui/Buttons/ExpandCollapseButton";
import SatelliteKeyModal from "../components/SatelliteKeyModal";
import { Mfo } from "../services/MfoSatellite/mfoSatelliteTypes";
import MfoSelectorModal from "../components/MfoSelectorModal";

export default function SatelliteKeysPage() {
  const [keys, setKeys] = useState<MfoSatelliteKey[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedKey, setSelectedKey] = useState<MfoSatelliteKey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedKeyId, setExpandedKeyId] = useState<number | null>(null);
  const [expandedMfoListId, setExpandedMfoListId] = useState<number | null>(
    null
  );
  const [isMfoModalOpen, setIsMfoModalOpen] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);
  const fetchKeys = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const data = await MfoSatelliteKeyService.getAllSatelliteKeys();
      setKeys(data);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const openModal = (
    mode: "create" | "edit",
    key: MfoSatelliteKey | null = null
  ) => {
    setModalMode(mode);
    setSelectedKey(key);
    setIsModalOpen(true);
  };

  const deleteKey = async (id: number) => {
    try {
      await MfoSatelliteKeyService.deleteSatelliteKey(id);
      fetchKeys();
    } catch {
      // Обработка ошибки
    }
  };

  const toggleCardExpansion = (keyId: number) => {
    setExpandedKeyId(expandedKeyId === keyId ? null : keyId);
    // Сбрасываем расширение МФО при сворачивании карточки
    if (expandedKeyId === keyId) {
      setExpandedMfoListId(null);
    }
  };

  const addMfoToKey = (keyId: number) => {
    setCurrentItemId(keyId);
    setIsMfoModalOpen(true);
  };


  const removeMfoFromKey = async (keyId: number, mfoId: number) => {
    try {
      await MfoSatelliteKeyService.removeMfoFromKey(keyId, mfoId);
      console.log(`Удаляем МФО ${mfoId} из ключа ${keyId}`);
      fetchKeys(); // Обновляем данные
    } catch (error) {
      console.error("Ошибка при удалении МФО:", error);
    }
  };
  const filteredKeys = keys.filter((key) => {
    const searchTarget =
      `${key.keyUk} ${key.keyRu} ${key.slugUk} ${key.slugRu}`.toLowerCase();
    return searchTarget.includes(searchTerm.toLowerCase());
  });
  const handleMfoAdd = async (mfo: Mfo) => {
    if (!currentItemId) return;

    try {
      // Здесь вызов API для добавления МФО к ключу
      await MfoSatelliteKeyService.addMfoToKey(currentItemId, mfo.id);
      console.log(`Добавляем МФО ${mfo.name} к ключу ${currentItemId}`);
      fetchKeys(); // Обновляем данные
    } catch (error) {
      console.error("Ошибка при добавлении МФО:", error);
    }
  };

  const handleMfoRemove = async (mfoId: number) => {
    if (!currentItemId) return;

    try {
      // await MfoSatelliteKeyService.removeMfoFromKey(currentItemId, mfoId);
      console.log(`Удаляем МФО ${mfoId} из ключа ${currentItemId}`);
      fetchKeys(); // Обновляем данные
    } catch (error) {
      console.error("Ошибка при удалении МФО:", error);
    }
  };

  return (
    <div className="space-y-6  mx-auto ">
      {/* Заголовок */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Управление ключами сателлита
          </h1>
          <p className="text-gray-600">
            Список всех ключей сателлита ({keys.length})
          </p>
        </div>
        <BlueButton
          text="Добавить МФО-ключ Сателлита"
          onClick={() => openModal("create")}
        />
      </div>

      {/* Поиск */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск ключей..."
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
            Произошла ошибка при загрузке ключей. Попробуйте позже.
          </div>
        ) : filteredKeys.length === 0 ? (
          <div className="text-center text-gray-500 text-sm bg-gray-50 border border-gray-100 rounded-xl p-4">
            {searchTerm
              ? "Ключи не найдены по вашему запросу."
              : "Ключи не найдены."}
          </div>
        ) : (
          filteredKeys.map((key) => {
            const isExpanded = expandedKeyId === key.id;

            return (
              <div
                key={key.id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-blue-50 rounded-xl">
                        <Key className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {key.keyUk}
                          </h3>
                          {key.keyUk !== key.keyRu && (
                            <span className="text-sm text-gray-500">
                              / {key.keyRu}
                            </span>
                          )}
                        </div>

                        {/* Краткая информация - всегда видна */}
                        <div className="mb-4 text-sm text-gray-600 space-y-1">
                          <div>
                            <span className="font-medium text-gray-700">
                              Slug:
                            </span>{" "}
                            {key.slugUk}
                            {key.slugUk !== key.slugRu && ` / ${key.slugRu}`}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Satellite className="w-4 h-4" />
                              <span>
                                {key.satellites?.length || 0} сателлит
                                {key.satellites?.length === 1
                                  ? ""
                                  : key.satellites && key.satellites?.length > 4
                                  ? "ов"
                                  : "а"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              <span>{key.mfoLinks?.length || 0} МФО</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(key.createdAt).toLocaleDateString(
                                  "ru-RU"
                                )}
                              </span>
                            </div>
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
                          {/* Основная информация в сетке */}
                          <div className="grid md:grid-cols-2 gap-4">
                            {/* Заголовки */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 mb-2">
                                <Tag className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-gray-700">
                                  Заголовки
                                </span>
                              </div>
                              <div className="pl-6 space-y-1">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium text-blue-600">
                                    UK:
                                  </span>{" "}
                                  {key.titleUk}
                                </p>
                                {key.titleUk !== key.titleRu && (
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium text-red-600">
                                      RU:
                                    </span>{" "}
                                    {key.titleRu}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Мета заголовки */}
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
                                  {key.metaTitleUk}
                                </p>
                                {key.metaTitleUk !== key.metaTitleRu && (
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium text-red-600">
                                      RU:
                                    </span>{" "}
                                    {key.metaTitleRu}
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
                                    {key.descriptionUk}
                                  </p>
                                </div>
                                {key.descriptionUk !== key.descriptionRu && (
                                  <div>
                                    <span className="text-xs font-medium text-red-600 block mb-1">
                                      RU:
                                    </span>
                                    <p className="text-sm text-gray-600 bg-red-50 p-2 rounded-lg">
                                      {key.descriptionRu}
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
                                    {key.metaDescUk}
                                  </p>
                                </div>
                                {key.metaDescUk !== key.metaDescRu && (
                                  <div>
                                    <span className="text-xs font-medium text-red-600 block mb-1">
                                      RU:
                                    </span>
                                    <p className="text-sm text-gray-600 bg-red-50 p-2 rounded-lg">
                                      {key.metaDescRu}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Слаги */}
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              URL Slugs
                            </h4>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium text-blue-600">
                                  UK:
                                </span>
                                <span className="ml-2 px-2 py-1 bg-white border rounded text-xs font-mono">
                                  {key.slugUk}
                                </span>
                              </p>
                              {key.slugUk !== key.slugRu && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium text-red-600">
                                    RU:
                                  </span>
                                  <span className="ml-2 px-2 py-1 bg-white border rounded text-xs font-mono">
                                    {key.slugRu}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Список сателлитов */}
                          {key.satellites && key.satellites.length > 0 && (
                            <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                              <p className="text-xs font-medium text-green-700 mb-2">
                                Связанные сателлиты:
                              </p>
                              <div className="space-y-1">
                                {key.satellites.slice(0, 3).map((satellite) => (
                                  <p
                                    key={satellite.id}
                                    className="text-xs text-green-600"
                                  >
                                    • {satellite.titleRu}
                                  </p>
                                ))}
                                {key.satellites.length > 3 && (
                                  <p className="text-xs text-green-500">
                                    ... и ещё {key.satellites.length - 3}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* МФО ссылки */}
                          {key.mfoLinks && key.mfoLinks.length > 0 && (
                            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Building2 className="w-4 h-4 text-orange-600" />
                                  <span className="text-sm font-medium text-orange-700">
                                    Связанные МФО ({key.mfoLinks.length})
                                  </span>
                                </div>
                                <button
                                  onClick={() => addMfoToKey(key.id)}
                                  className="flex items-center gap-1 px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs rounded-md transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                  Добавить МФО
                                </button>
                              </div>
                              <div className="grid gap-2">
                                {(expandedMfoListId === key.id
                                  ? key.mfoLinks
                                  : key.mfoLinks.slice(0, 3)
                                ).map((link) => (
                                  <div
                                    key={link.id}
                                    className="flex items-center gap-3 p-2 bg-white rounded-lg border group"
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
                                    <button
                                      onClick={() =>
                                        removeMfoFromKey(key.id, link.mfo.id)
                                      }
                                      className="opacity-0 cursor-pointer group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-all"
                                      title="Удалить МФО"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                              {key.mfoLinks.length > 3 && (
                                <button
                                  onClick={() =>
                                    setExpandedMfoListId(
                                      expandedMfoListId === key.id
                                        ? null
                                        : key.id
                                    )
                                  }
                                  className="text-orange-600 text-xs mt-1 cursor-pointer underline"
                                >
                                  {expandedMfoListId === key.id
                                    ? "Свернуть"
                                    : `Показать все (${key.mfoLinks.length})`}
                                </button>
                              )}
                            </div>
                          )}

                          {/* Если нет МФО, показываем кнопку добавления */}
                          {(!key.mfoLinks || key.mfoLinks.length === 0) && (
                            <div className="p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                              <div className="text-center">
                                <Building2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500 mb-2">
                                  К этому ключу не привязаны МФО
                                </p>
                                <button
                                  onClick={() => addMfoToKey(key.id)}
                                  className="flex cursor-pointer items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-md transition-colors mx-auto"
                                >
                                  <Plus className="w-4 h-4 " />
                                  Добавить МФО
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      {/* Кнопка разворачивания/сворачивания */}
                      <ExpandCollapseButton
                        isExpanded={isExpanded}
                        onToggle={() => toggleCardExpansion(key.id)}
                      />

                      <EditButton
                        item={key}
                        handleClick={(key) => openModal("edit", key)}
                      />
                      <DeleteButton
                        onClick={() => deleteKey(key.id)}
                        title="Удалить"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Модалка */}
      <SatelliteKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        satelliteKey={selectedKey}
        onSubmitSuccess={fetchKeys}
      />
      {/* Модалка выбора МФО */}
      <MfoSelectorModal
        isOpen={isMfoModalOpen}
        onClose={() => {
          setIsMfoModalOpen(false);
          setCurrentItemId(null);
        }}
        onSave={async (addedIds, removedIds) => {
          if (!currentItemId) return;

          try {
            // Добавляем
            for (const id of addedIds) {
              await MfoSatelliteKeyService.addMfoToKey(currentItemId, id);
            }

            // Удаляем
            for (const id of removedIds) {
              await MfoSatelliteKeyService.removeMfoFromKey(currentItemId, id);
            }

            await fetchKeys(); // обновляем данные
          } catch (e) {
            console.error("Ошибка при сохранении МФО:", e);
          }
        }}
        selectedMfoIds={
          currentItemId
            ? keys
                .find((k) => k.id === currentItemId)
                ?.mfoLinks?.map((link) => link.mfo.id) || []
            : []
        }
        title="Управление МФО для ключа"
      />
    </div>
  );
}
