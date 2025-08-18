/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import ExpertModal from "../components/ExpertModal";
import ExpertsService from "../services/experts/expertsService";
import { Expert } from "../services/experts/expertsTypes";
import { toast } from "react-toastify";
import { VioletButton } from "../ui/Buttons/VioletButton";
import { ExpertCard } from "../components/Cards/ExpertCard";

export default function ExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const data = await ExpertsService.getAllExperts();
      setExperts(data);
    } catch (error) {
      console.error("Ошибка при загрузке экспертов:", error);
      toast.error("Ошибка при загрузке экспертов");
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить эксперта?")) return;
    try {
      await ExpertsService.deleteExpert(id);
      setExperts(experts.filter((expert) => expert.id !== Number(id)));
      toast.success("Эксперт успешно удалён");
    } catch (error) {
      console.error("Ошибка при удалении эксперта:", error);
      toast.error("Не удалось удалить эксперта");
    }
  };

  const openModal = (mode: "create" | "edit", expert: any = null) => {
    setModalMode(mode);
    setSelectedExpert(expert);
    setIsModalOpen(true);
  };

  const toggleCardExpansion = (expertId: number) => {
    setExpandedCardId(expandedCardId === expertId ? null : expertId);
  };

  const filteredExperts = experts.filter(
    (expert) =>
      expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.nameUk?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.expertise?.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Сортируем экспертов: активные сначала, потом неактивные
  const sortedExperts = filteredExperts.sort((a, b) => {
    if (a.isActive === b.isActive) return 0;
    return a.isActive ? -1 : 1;
  });

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопка */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Управление экспертами
          </h1>
          <p className="text-gray-600">
            Добавление и редактирование экспертов ({experts.length})
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="flex items-center text-gray-600 gap-2">
              <div className="w-3 h-3 text-gray-600 bg-green-500 rounded-full"></div>
              Активные: {experts.filter(e => e.isActive).length}
            </span>
            <span className="flex items-center text-gray-600 gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              Неактивные: {experts.filter(e => !e.isActive).length}
            </span>
          </div>
        </div>
        <VioletButton
          text="Добавить эксперта"
          onClick={() => openModal("create")}
        />
      </div>

      {/* Поиск */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск экспертов, должностей, экспертизы..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Список экспертов */}
      <div className="grid gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 animate-pulse space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="text-center text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl p-4">
            Произошла ошибка при загрузке экспертов. Попробуйте позже.
          </div>
        ) : sortedExperts.length === 0 ? (
          <div className="text-center text-gray-500 text-sm bg-gray-50 border border-gray-100 rounded-xl p-4">
            {searchTerm
              ? "Эксперты не найдены по вашему запросу."
              : "Эксперты не найдены."}
          </div>
        ) : (
          sortedExperts.map((expert) => {
            const isExpanded = expandedCardId === expert.id;

            return (
              <ExpertCard 
                key={expert.id} 
                expert={expert} 
                handleDelete={handleDelete}
                isExpanded={isExpanded}
                toggleCardExpansion={toggleCardExpansion}
                openModal={openModal}
              />
            );
          })
        )}
      </div>

      {/* Модалка */}
      <ExpertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        expert={selectedExpert}
        onSubmitSuccess={fetchExperts}
      />
    </div>
  );
}