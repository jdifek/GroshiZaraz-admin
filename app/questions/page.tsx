'use client';

import { useEffect, useState } from 'react';
import { Search, Edit2, Trash2, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import { SiteQuestion } from '../services/siteQuestions/siteQuestionsTypes';
import SiteQuestionService from '../services/siteQuestions/SiteQuestionService';
import QuestionModal from '../components/QuestionModal';
import { BlueButton } from '../ui/Buttons/BlueButton';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<SiteQuestion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<SiteQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const data = await SiteQuestionService.getAllQuestions();
      setQuestions(data);
    } catch {
      toast.error('Ошибка при загрузке вопросов');
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSave = async (data: Partial<SiteQuestion>) => {
    try {
      if (modalMode === 'create') {
        await SiteQuestionService.createQuestion(data);
      } else if (modalMode === 'edit' && selectedItem) {
        await SiteQuestionService.updateQuestion(selectedItem.id, data);
      }
      setIsModalOpen(false);
      setSelectedItem(null);
      fetchQuestions();
    } catch {
      toast.error('Ошибка при сохранении вопроса');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить вопрос?')) return;
    try {
      await SiteQuestionService.deleteQuestion(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
      toast.success('Вопрос удалён');
    } catch {
      toast.error('Ошибка при удалении');
    }
  };

  const openModal = (mode: 'create' | 'edit', item: SiteQuestion | null = null) => {
    setModalMode(mode);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const filteredQuestions = questions.filter(q =>
    q.textOriginal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Управление вопросами</h1>
          <p className="text-gray-600">Модерация и управление вопросами пользователей</p>
        </div>
        <BlueButton onClick={() => openModal('create')} />
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
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 animate-pulse space-y-4"
            >
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            </div>
          ))
        ) : error ? (
          <div className="text-center text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl p-4">
            Произошла ошибка при загрузке вопросов. Попробуйте позже.
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center text-gray-500 text-sm bg-gray-50 border border-gray-100 rounded-xl p-4">
            Вопросы не найдены.
          </div>
        ) : (
          filteredQuestions.map(question => (
            <div
              key={question.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow p-6"
            >
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
                      {question.targetType ? 'Сайт' : 'Непонятно'}
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
                    onClick={() => handleDelete(question.id)}
                    className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <QuestionModal
        isOpen={isModalOpen}
        mode={modalMode}
        question={selectedItem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
