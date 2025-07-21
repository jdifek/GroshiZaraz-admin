/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useContext } from 'react';
import { Search, Edit2, Trash2, Calendar, Plus } from 'lucide-react';
import { DataContext } from '../context/DataContext';

export default function QuestionsPage() {
  const { questions, searchTerm, setSearchTerm, setIsModalOpen, setModalMode, setSelectedItem, handleDelete } = useContext(DataContext);

  const openModal = (mode: 'create' | 'edit', item: any = null) => {
    setModalMode(mode);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Управление вопросами</h1>
          <p className="text-gray-600">Модерация и управление вопросами пользователей</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Добавить вопрос
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск вопросов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {questions
          .filter(question => question.textOriginal.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(question => (
            <div key={question.id} className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        question.isModerated ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                      }`}
                    >
                      {question.isModerated ? 'Одобрено' : 'На модерации'}
                    </span>
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      {question.targetType}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">{question.textOriginal}</p>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(question.createdAt).toLocaleDateString()}
                    </span>
                    <span>ID: {question.targetId}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal('edit', question)}
                    className="w-10 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('question', question.id)}
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