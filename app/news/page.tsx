/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useContext } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Users, Calendar } from 'lucide-react';
import { DataContext } from '../context/DataContext';
import { formatNumber } from '../utils/format';


export default function NewsPage() {
  const { news, searchTerm, setSearchTerm, setIsModalOpen, setModalMode, setSelectedItem, handleDelete } = useContext(DataContext);

  const openModal = (mode: 'create' | 'edit' | 'view', item: any = null) => {
    setModalMode(mode);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Управление новостями</h1>
          <p className="text-gray-600">Создание и редактирование статей</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Создать статью
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск новостей..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {news
          .filter(article => article.title.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(article => (
            <div key={article.id} className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          article.published ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                        }`}
                      >
                        {article.published ? 'Опубликовано' : 'Черновик'}
                      </span>
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                        {article.NewsCategory?.name || 'Без категории'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{article.title}</h3>

                    <p className="text-gray-600 mb-4 line-clamp-2">{article.body.substring(0, 150)}...</p>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {article.author?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {formatNumber(article.views)} просмотров
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                      {article.readingMinutes && <span>⏱️ {article.readingMinutes} мин чтения</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal('view', article)}
                      className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openModal('edit', article)}
                      className="w-10 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('news', article.id)}
                      className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}