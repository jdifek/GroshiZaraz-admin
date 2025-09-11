/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import {
  X,
  Search,
  Building2,
  Star,
  Users,
  Check,
  Clock,
  CreditCard,
  Shield,
  Zap,
  Save,
} from "lucide-react";
import { Mfo } from "../services/MfoSatellite/mfoSatelliteTypes";
import MfoService from "../services/mfos/mfosService";

interface MfoSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (addedMfoIds: number[], removedMfoIds: number[]) => void; // Изменили сигнатуру
  selectedMfoIds?: number[]; // МФО которые уже добавлены
  title?: string;
}

export default function MfoSelectorModal({
  isOpen,
  onClose,
  onSave,
  selectedMfoIds = [],
  title = "Управление МФО"
}: MfoSelectorModalProps) {
  const [mfos, setMfos] = useState<Mfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  
  // Локальное состояние изменений
  const [localSelectedIds, setLocalSelectedIds] = useState<Set<number>>(new Set());

  const fetchMfos = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const data = await MfoService.getAllMfos();
      setMfos(data);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMfos();
      setSearchTerm("");
      // Инициализируем локальное состояние текущими выбранными МФО
      setLocalSelectedIds(new Set(selectedMfoIds));
    }
  }, [isOpen, selectedMfoIds]);

  const filteredMfos = mfos.filter((mfo) => {
    const searchTarget = `${mfo.name} ${mfo.description || ""}`.toLowerCase();
    return searchTarget.includes(searchTerm.toLowerCase());
  });

  const handleToggleAll = () => {
    if (localSelectedIds.size === filteredMfos.length) {
      // если уже все выбраны — снимаем выбор
      setLocalSelectedIds(new Set());
    } else {
      // выбираем все отфильтрованные МФО
      setLocalSelectedIds(new Set(filteredMfos.map(m => m.id)));
    }
  };
  

  const handleMfoToggle = (mfoId: number) => {
    const newLocalSelected = new Set(localSelectedIds);
    
    if (newLocalSelected.has(mfoId)) {
      newLocalSelected.delete(mfoId);
    } else {
      newLocalSelected.add(mfoId);
    }
    
    setLocalSelectedIds(newLocalSelected);
  };

  const handleSave = () => {
    const currentIds = new Set(selectedMfoIds);
    const localIds = localSelectedIds;
    
    // Находим добавленные МФО (есть в локальном, но нет в текущем)
    const addedIds = Array.from(localIds).filter(id => !currentIds.has(id));
    
    // Находим удаленные МФО (есть в текущем, но нет в локальном)
    const removedIds = Array.from(currentIds).filter(id => !localIds.has(id));
    
    onSave(addedIds, removedIds);
    onClose();
  };

  const handleCancel = () => {
    // Сбрасываем локальные изменения
    setLocalSelectedIds(new Set(selectedMfoIds));
    onClose();
  };

  // Проверяем, есть ли изменения
  const hasChanges = () => {
    const currentIds = new Set(selectedMfoIds);
    const localIds = localSelectedIds;
    
    if (currentIds.size !== localIds.size) return true;
    
    for (const id of currentIds) {
      if (!localIds.has(id)) return true;
    }
    
    return false;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
              <p className="text-sm text-gray-500">
                Выбрано: {localSelectedIds.size} из {mfos.length} МФО
                {hasChanges() && (
                  <span className="ml-2 text-orange-600 font-medium">
                    • Есть изменения
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Поиск */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Поиск МФО по названию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Список МФО */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="grid gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 border border-gray-200 rounded-xl animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-red-500">Ошибка загрузки МФО</p>
              <button
                onClick={fetchMfos}
                className="mt-2 text-blue-600 text-sm underline"
              >
                Попробовать снова
              </button>
            </div>
          ) : filteredMfos.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchTerm ? "МФО не найдены по запросу" : "Нет доступных МФО"}
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredMfos.map((mfo) => {
                const isSelected = localSelectedIds.has(mfo.id);
                const wasOriginallySelected = selectedMfoIds.includes(mfo.id);
                const isChanged = isSelected !== wasOriginallySelected;
                
                return (
                  <div
                    key={mfo.id}
                    className={`p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    } ${
                      isChanged ? "ring-2 ring-orange-200" : ""
                    }`}
                    onClick={() => handleMfoToggle(mfo.id)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Логотип */}
                      <img
                        src={mfo.logo}
                        alt={mfo.name}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />

                      {/* Основная информация */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {mfo.name}
                          </h3>
                          {isSelected && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              <Check className="w-3 h-3" />
                              {isChanged ? "Будет добавлено" : "Добавлено"}
                            </div>
                          )}
                          {!isSelected && wasOriginallySelected && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                              <X className="w-3 h-3" />
                              Будет удалено
                            </div>
                          )}
                        </div>

                        {/* Основные характеристики */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{mfo.rating} ({mfo.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <CreditCard className="w-3 h-3 text-green-600" />
                            <span>{mfo.minAmount}-{mfo.maxAmount}₴</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="w-3 h-3 text-blue-600" />
                            <span>{mfo.decisionTime}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <span className="text-orange-600 font-medium">
                              {mfo.rateMin}-{mfo.rateMax}%
                            </span>
                          </div>
                        </div>

                        {/* Дополнительные фичи */}
                        <div className="flex items-center gap-2 mt-2">
                          {mfo.isFirstLoanZero && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              Первый займ 0%
                            </span>
                          )}
                          {mfo.isInstantApproval && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Мгновенно
                            </span>
                          )}
                          {mfo.is24Support && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              24/7
                            </span>
                          )}
                          {mfo.isSafeTransactions && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Безопасно
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Чекбокс */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMfoToggle(mfo.id);
                          }}
                          className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all ${
                            isSelected
                              ? "border-green-500 bg-green-500"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Футер */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Всего: {filteredMfos.length} МФО
              {localSelectedIds.size > 0 && (
                <span className="ml-2 text-green-600 font-medium">
                  • Выбрано: {localSelectedIds.size}
                </span>
              )}
            </p>
            <div className="flex items-center gap-3">
  <button
    onClick={handleToggleAll}
    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
  >
    {localSelectedIds.size === filteredMfos.length ? "Снять все" : "Выбрать все"}
  </button>

  <button
    onClick={handleCancel}
    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
  >
    Отмена
  </button>
  <button
    onClick={handleSave}
    disabled={!hasChanges()}
    className={`px-6 py-2 cursor-pointer rounded-lg font-medium transition-all flex items-center gap-2 ${
      hasChanges()
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "bg-gray-200 text-gray-400 cursor-not-allowed"
    }`}
  >
    <Save className="w-4 h-4" />
    Сохранить
    {hasChanges() && (
      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
        {Array.from(localSelectedIds).filter(id => !selectedMfoIds.includes(id)).length + 
         selectedMfoIds.filter(id => !localSelectedIds.has(id)).length}
      </span>
    )}
  </button>
</div>

          </div>
        </div>
      </div>
    </div>
  );
}