"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Edit2, Trash2, Star } from "lucide-react";
import { toast } from "react-toastify";
import { Mfo } from "../services/mfos/mfoTypes";
import MfoService from "../services/mfos/mfosService";
import MfoModal from "../components/MfoModal";
import Image from "next/image";

export default function MfosPage() {
  const [mfos, setMfos] = useState<Mfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedMfo, setSelectedMfo] = useState<Mfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

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
    try {
      await MfoService.deleteMfo(id);
      toast.success("МФО удалена");
      fetchMfos();
    } catch {
      toast.error("Ошибка при удалении");
    }
  };

  const filteredMfos = mfos.filter((mfo) =>
    mfo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Управление МФО
          </h1>
          <p className="text-gray-600">
            Список всех микрофинансовых организаций
          </p>
        </div>
        <button
          onClick={() => openModal("create")}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Добавить МФО
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск МФО..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

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
            МФО не найдены.
          </div>
        ) : (
          filteredMfos.map((mfo) => (
            <div
              key={mfo.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Image
                        unoptimized
                        src={mfo.logo}
                        alt={`${mfo.name} logo`}
                        width={64}
                        height={64}
                        className="object-cover "
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {mfo.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Лицензия: {mfo.licenseNumber}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-gray-500 text-sm font-medium">
                            {mfo.rating}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {mfo.reviews} отзывов
                        </span>
                        <span className="text-sm text-gray-500">
                          Одобрение: {mfo.approvalRate}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Сумма займа</p>
                      <p className="font-medium text-gray-500">
                        {mfo.minAmount.toLocaleString()} -{" "}
                        {mfo.maxAmount.toLocaleString()} ₴
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Срок займа</p>
                      <p className="font-medium text-gray-500">
                        {mfo.minTerm} - {mfo.maxTerm} дней
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Ставка в день</p>
                      <p className="font-medium text-gray-500">
                        {mfo.rateMin}% - {mfo.rateMax}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal("edit", mfo)}
                      className="w-10 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMfo(mfo.id)}
                      className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {mfo.isFirstLoanZero && (
                      <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                        Первый займ 0%
                      </span>
                    )}
                    {mfo.isInstantApproval && (
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                        Мгновенное одобрение
                      </span>
                    )}
                    <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                      Решение: {mfo.decisionTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

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
