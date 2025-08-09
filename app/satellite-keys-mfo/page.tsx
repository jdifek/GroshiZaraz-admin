/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Search, Edit2, Trash2, Key, Satellite, Calendar, Globe, FileText, Tag } from "lucide-react";
import MfoSatelliteKeyService from "../services/MfoSatelliteKey/MfoSatelliteKeyService";
import { BlueButton } from "../ui/Buttons/BlueButton";
import { MfoSatelliteKey } from "../services/MfoSatelliteKey/mfoSatelliteKeyTypes";

const SatelliteKeyModal = ({ isOpen, onClose, mode }: any) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold mb-4">
          {mode === 'create' ? 'Создать ключ' : 'Редактировать ключ'}
        </h3>
        <p className="text-gray-600 mb-4">Форма для работы с ключами...</p>
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

export default function SatelliteKeysPage() {
  const [keys, setKeys] = useState<MfoSatelliteKey[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedKey, setSelectedKey] = useState<MfoSatelliteKey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

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

  const openModal = (mode: "create" | "edit", key: MfoSatelliteKey | null = null) => {
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

  const filteredKeys = keys.filter((key) => {
    const searchTarget = `${key.keyUk} ${key.keyRu} ${key.slugUk} ${key.slugRu}`.toLowerCase();
    return searchTarget.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6  mx-auto ">
      {/* Заголовок */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Управление ключами сателлита
          </h1>
          <p className="text-gray-600">Список всех ключей сателлита ({keys.length})</p>
        </div>
        <BlueButton text="Добавить МФО-ключ Сателлита" onClick={() => openModal("create")} />
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
            {searchTerm ? "Ключи не найдены по вашему запросу." : "Ключи не найдены."}
          </div>
        ) : (
          filteredKeys.map((key) => (
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
                      
                      {/* Основная информация в сетке */}
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {/* Заголовки */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Tag className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">Заголовки</span>
                          </div>
                          <div className="pl-6 space-y-1">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-blue-600">UK:</span> {key.titleUk}
                            </p>
                            {key.titleUk !== key.titleRu && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium text-red-600">RU:</span> {key.titleRu}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Мета заголовки */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Meta Title</span>
                          </div>
                          <div className="pl-6 space-y-1">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-blue-600">UK:</span> {key.metaTitleUk}
                            </p>
                            {key.metaTitleUk !== key.metaTitleRu && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium text-red-600">RU:</span> {key.metaTitleRu}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Описания */}
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-gray-700">Описания</span>
                          </div>
                          <div className="pl-6 space-y-2">
                            <div>
                              <span className="text-xs font-medium text-blue-600 block mb-1">UK:</span>
                              <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded-lg">
                                {key.descriptionUk}
                              </p>
                            </div>
                            {key.descriptionUk !== key.descriptionRu && (
                              <div>
                                <span className="text-xs font-medium text-red-600 block mb-1">RU:</span>
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
                            <span className="text-sm font-medium text-gray-700">Meta Description</span>
                          </div>
                          <div className="pl-6 space-y-2">
                            <div>
                              <span className="text-xs font-medium text-blue-600 block mb-1">UK:</span>
                              <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded-lg">
                                {key.metaDescUk}
                              </p>
                            </div>
                            {key.metaDescUk !== key.metaDescRu && (
                              <div>
                                <span className="text-xs font-medium text-red-600 block mb-1">RU:</span>
                                <p className="text-sm text-gray-600 bg-red-50 p-2 rounded-lg">
                                  {key.metaDescRu}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Слаги */}
                      <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">URL Slugs</h4>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-blue-600">UK:</span> 
                            <span className="ml-2 px-2 py-1 bg-white border rounded text-xs font-mono">
                              {key.slugUk}
                            </span>
                          </p>
                          {key.slugUk !== key.slugRu && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-red-600">RU:</span>
                              <span className="ml-2 px-2 py-1 bg-white border rounded text-xs font-mono">
                                {key.slugRu}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Мета информация */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Satellite className="w-4 h-4" />
                          <span>
                            {key.satellites?.length || 0} сателлит{key.satellites?.length === 1 ? '' : (key.satellites && key.satellites?.length > 4 ? 'ов' : 'а')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(key.createdAt).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                      </div>

                      {/* Список сателлитов */}
                      {key.satellites && key.satellites.length > 0 && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                          <p className="text-xs font-medium text-green-700 mb-2">
                            Связанные сателлиты:
                          </p>
                          <div className="space-y-1">
                            {key.satellites.slice(0, 3).map((satellite) => (
                              <p key={satellite.id} className="text-xs text-green-600">
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
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => openModal("edit", key)}
                      className="w-10 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center transition-colors"
                      title="Редактировать"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteKey(key.id)}
                      className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Модалка */}
      <SatelliteKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        keyData={selectedKey || undefined}
        onSubmitSuccess={fetchKeys}
      />
    </div>
  );
}