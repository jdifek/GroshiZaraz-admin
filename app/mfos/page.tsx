/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import { useContext } from 'react';
import { Search, Plus, Edit2, Trash2, Star } from 'lucide-react';
import { DataContext } from '../context/DataContext';

export default function MfosPage() {
  const { mfos, searchTerm, setSearchTerm, setIsModalOpen, setModalMode, setSelectedItem, handleDelete } = useContext(DataContext);

  const openModal = (mode: 'create' | 'edit', item: any = null) => {
    setModalMode(mode);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Управление МФО</h1>
          <p className="text-gray-600">Список всех микрофинансовых организаций</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Добавить МФО
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="relative max-w-md">
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
        {mfos.filter(mfo => mfo.name.toLowerCase().includes(searchTerm.toLowerCase())).map(mfo => (
          <div key={mfo.id} className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl">
                    {mfo.logo}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{mfo.name}</h3>
                    <p className="text-sm text-gray-500">Лицензия: {mfo.licenseNumber}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{mfo.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">{mfo.reviews} отзывов</span>
                      <span className="text-sm text-gray-500">Одобрение: {mfo.approvalRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Сумма займа</p>
                    <p className="font-medium">{mfo.minAmount.toLocaleString()} - {mfo.maxAmount.toLocaleString()} ₽</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Срок займа</p>
                    <p className="font-medium">{mfo.minTerm} - {mfo.maxTerm} дней</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Ставка в день</p>
                    <p className="font-medium">{mfo.rateMin}% - {mfo.rateMax}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal('edit', mfo)}
                    className="w-10 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('mfo', mfo.id)}
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
        ))}
      </div>
    </div>
  );
}