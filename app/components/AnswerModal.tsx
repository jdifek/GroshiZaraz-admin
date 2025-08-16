import React, { useState, useEffect } from 'react';
import { User, Star, X } from 'lucide-react';

interface Expert {
  id: number;
  name: string;
  avatar?: string;
  position: string;
  experience: string;
  color?: string;
  totalAnswers: number;
  expertise: string[];
}

interface AnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  questionId: number;
}

export default function AnswerModal({ isOpen, onClose, onSave, questionId }: AnswerModalProps) {
  const [formData, setFormData] = useState({
    textOriginal: '',
    textUk: '',
    textRu: '',
    authorName: '',
    authorEmail: '',
    expertId: '',
    isModerated: false,
    answerType: 'user' // 'user' или 'expert'
  });

  const [experts, setExperts] = useState<Expert[]>([]);
  const [loadingExperts, setLoadingExperts] = useState(false);

  // Загрузка списка экспертов
  useEffect(() => {
    if (isOpen) {
      fetchExperts();
    }
  }, [isOpen]);

  const fetchExperts = async () => {
    setLoadingExperts(true);
    try {
      const response = await fetch('/api/experts');
      const data = await response.json();
      setExperts(data);
    } catch (error) {
      console.error('Ошибка при загрузке экспертов:', error);
    } finally {
      setLoadingExperts(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Если выбрали тип ответа "эксперт", очищаем поля пользователя
    if (name === 'answerType' && value === 'expert') {
      setFormData(prev => ({
        ...prev,
        authorName: '',
        authorEmail: ''
      }));
    }

    // Если выбрали тип ответа "пользователь", очищаем expertId
    if (name === 'answerType' && value === 'user') {
      setFormData(prev => ({
        ...prev,
        expertId: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      textOriginal: formData.textOriginal,
      textUk: formData.textUk || null,
      textRu: formData.textRu || null,
      isModerated: formData.isModerated,
    };

    if (formData.answerType === 'expert' && formData.expertId) {
      submitData.expertId = parseInt(formData.expertId);
    } else {
      submitData.authorName = formData.authorName;
      submitData.authorEmail = formData.authorEmail;
    }

    onSave(submitData);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      textOriginal: '',
      textUk: '',
      textRu: '',
      authorName: '',
      authorEmail: '',
      expertId: '',
      isModerated: false,
      answerType: 'user'
    });
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  const selectedExpert = experts.find(e => e.id === parseInt(formData.expertId));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Добавить ответ на вопрос
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Выбор типа ответа */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Тип ответа
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="answerType"
                  value="user"
                  checked={formData.answerType === 'user'}
                  onChange={handleChange}
                  className="text-blue-600"
                />
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">От пользователя</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="answerType"
                  value="expert"
                  checked={formData.answerType === 'expert'}
                  onChange={handleChange}
                  className="text-blue-600"
                />
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-700">От эксперта</span>
              </label>
            </div>
          </div>

          {/* Поля для пользователя */}
          {formData.answerType === 'user' && (
            <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Имя пользователя *
                </label>
                <input
                  name="authorName"
                  type="text"
                  value={formData.authorName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email пользователя *
                </label>
                <input
                  name="authorEmail"
                  type="email"
                  value={formData.authorEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Выбор эксперта */}
          {formData.answerType === 'expert' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Выберите эксперта *
              </label>
              {loadingExperts ? (
                <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                  Загрузка экспертов...
                </div>
              ) : (
                <select
                  name="expertId"
                  value={formData.expertId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Выберите эксперта</option>
                  {experts.map(expert => (
                    <option key={expert.id} value={expert.id}>
                      {expert.name} - {expert.position} ({expert.totalAnswers} ответов)
                    </option>
                  ))}
                </select>
              )}

              {/* Предпросмотр выбранного эксперта */}
              {selectedExpert && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    {selectedExpert.avatar && (
                      <img
                        src={selectedExpert.avatar}
                        alt={selectedExpert.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900">
                        {selectedExpert.name}
                      </h4>
                      <p className="text-sm text-blue-700">
                        {selectedExpert.position}
                      </p>
                      <p className="text-xs text-blue-600">
                        Опыт: {selectedExpert.experience} • Ответов: {selectedExpert.totalAnswers}
                      </p>
                    </div>
                  </div>
                  {selectedExpert.expertise?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {selectedExpert.expertise.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {selectedExpert.expertise.length > 3 && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          +{selectedExpert.expertise.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Текст ответа */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Текст ответа *
            </label>
            <textarea
              name="textOriginal"
              rows={4}
              value={formData.textOriginal}
              onChange={handleChange}
              required
              placeholder="Введите текст ответа..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Переводы */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Перевод (украинский)
              </label>
              <textarea
                name="textUk"
                rows={3}
                value={formData.textUk}
                onChange={handleChange}
                placeholder="Переклад українською..."
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Перевод (русский)
              </label>
              <textarea
                name="textRu"
                rows={3}
                value={formData.textRu}
                onChange={handleChange}
                placeholder="Перевод на русский..."
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Модерация */}
          <div className="flex items-center gap-2">
            <input
              id="isModerated"
              name="isModerated"
              type="checkbox"
              checked={formData.isModerated}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isModerated" className="text-sm text-gray-700">
              Одобрить ответ (пройдет модерацию)
            </label>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              Добавить ответ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}