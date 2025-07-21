/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useContext } from 'react';
import { Search, Edit2, Trash2, Star, Calendar } from 'lucide-react';
import { DataContext } from '../context/DataContext';

export default function ReviewsPage() {
  const { reviews, searchTerm, setSearchTerm, setIsModalOpen, setModalMode, setSelectedItem, handleDelete } = useContext(DataContext);

  const openModal = (mode: 'create' | 'edit', item: any = null) => {
    setModalMode(mode);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Управление отзывами</h1>
          <p className="text-gray-600">Модерация и управление отзывами</p>
        </div>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск отзывов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {reviews
          .filter(review => review.textOriginal.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(review => (
            <div key={review.id} className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        review.isModerated ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                      }`}
                    >
                      {review.isModerated ? 'Одобрено' : 'На модерации'}
                    </span>
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      {review.targetType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">{review.textOriginal}</p>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    <span>ID: {review.targetId}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal('edit', review)}
                    className="w-10 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('review', review.id)}
                    className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}