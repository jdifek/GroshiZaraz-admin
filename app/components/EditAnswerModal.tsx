'use client';
import { useState, useEffect } from 'react';
import { User, UserCheck, X } from 'lucide-react';

interface Expert {
  id: number;
  name: string;
  avatar?: string;
  position?: string;
}

interface Answer {
  id: number;
  textOriginal: string;
  textUk?: string;
  textRu?: string;
  isModerated: boolean;
  authorName?: string;
  authorEmail?: string;
  expertId?: number;
  expert?: Expert;
  createdAt: string;
}

interface EditAnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (answerId: number, data: Partial<Answer>) => void;
  answer: Answer | null;
}

export default function EditAnswerModal({ isOpen, onClose, onSave, answer }: EditAnswerModalProps) {
  const [formData, setFormData] = useState<Partial<Answer>>({});

  useEffect(() => {
    if (isOpen && answer) {
      setFormData({
        textOriginal: answer.textOriginal,
        textUk: answer.textUk || '',
        textRu: answer.textRu || '',
        isModerated: answer.isModerated,
        authorName: answer.authorName || '',
        authorEmail: answer.authorEmail || '',
      });
    } else {
      setFormData({
        textOriginal: '',
        textUk: '',
        textRu: '',
        isModerated: false,
        authorName: '',
        authorEmail: '',
      });
    }
  }, [isOpen, answer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer) {
      onSave(answer.id, formData);
    }
  };

  if (!isOpen || !answer) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] scrollbar-none overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              {answer.expert ? (
                <UserCheck className="w-5 h-5 text-blue-600" />
              ) : (
                <User className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Редактировать ответ
              </h2>
              <p className="text-sm text-gray-600">
                {answer.expert 
                  ? `Ответ эксперта: ${answer.expert.name}`
                  : `Ответ пользователя: ${answer.authorName || 'Неизвестен'}`
                }
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Информация об авторе (только для неэкспертов) */}
          {!answer.expert && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Имя автора
                </label>
                <input
                  name="authorName"
                  type="text"
                  value={formData.authorName || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите имя автора"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email автора
                </label>
                <input
                  name="authorEmail"
                  type="email"
                  value={formData.authorEmail || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите email автора"
                />
              </div>
            </div>
          )}

          {/* Текст ответа (оригинал) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Текст ответа (оригинал) *
            </label>
            <textarea
              name="textOriginal"
              rows={4}
              value={formData.textOriginal || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2  scrollbar-none border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите текст ответа"
            />
          </div>

          {/* Переводы */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Перевод на украинский
              </label>
              <textarea
                name="textUk"
                rows={3}
                value={formData.textUk || ''}
                onChange={handleChange}
                className="w-full scrollbar-none px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Украинский перевод"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Перевод на русский
              </label>
              <textarea
                name="textRu"
                rows={3}
                value={formData.textRu || ''}
                onChange={handleChange}
                className="w-full scrollbar-none px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Русский перевод"
              />
            </div>
          </div>

          {/* Статус модерации */}
          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="flex items-center gap-3">
              <input
                id="isModerated"
                name="isModerated"
                type="checkbox"
                checked={formData.isModerated || false}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isModerated" className="text-sm font-medium text-gray-700">
                Ответ прошел модерацию
              </label>
            </div>
            <p className="text-xs text-gray-600 mt-1 ml-7">
              Отметьте, если ответ одобрен и готов к публикации
            </p>
          </div>

          {/* Информация о дате создания */}
          <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
            <strong>Дата создания:</strong> {new Date(answer.createdAt).toLocaleString('ru-RU')}
          </div>

          {/* Кнопки управления */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}