'use client';
import { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
  nameUk: string;
  icon?: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; icon?: string, nameUk: string; }) => void;
  mode: 'create' | 'edit';
  category: Category | null;
}

export default function CategoryModal({ isOpen, onClose, onSave, mode, category }: CategoryModalProps) {
  const [formData, setFormData] = useState({ name: '', icon: '',nameUk: '' });
  const [errors, setErrors] = useState({ name: '' });

  // Инициализация формы при открытии модального окна
  useEffect(() => {
    if (isOpen && category && mode === 'edit') {
      setFormData({ name: category.name, icon: category.icon || '', nameUk: category.nameUk });
    } else {
      setFormData({ name: '', icon: '', nameUk: '' });
    }
    setErrors({ name: '' });
  }, [isOpen, category, mode]);

  // Обработка изменений в полях формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Валидация поля name
    if (name === 'name' && value.trim() === '') {
      setErrors(prev => ({ ...prev, name: 'Название обязательно' }));
    } else {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  // Обработка отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() === '') {
      setErrors({ name: 'Название обязательно' });
      return;
    }
    onSave({ name: formData.name, nameUk: formData.nameUk, icon: formData.icon || undefined });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {mode === 'create' ? 'Создать категорию' : 'Редактировать категорию'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Название</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Название(укр)</label>
            <input
              name="nameUk"
              type="text"
              value={formData.nameUk}
              onChange={handleChange}
              className={`mt-1 w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Иконка</label>
            <input
              name="icon"
              type="text"
              value={formData.icon}
              onChange={handleChange}
              placeholder="Например: 📰"
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end gap-2">
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
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}