'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import ExpertsService from '../services/experts/expertsService';
import { toast } from 'react-toastify';

interface ExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  expert?: any;
  onSubmitSuccess: () => void; // Callback to refresh the expert list
}

export default function ExpertModal({ isOpen, onClose, mode, expert, onSubmitSuccess }: ExpertModalProps) {
  const [formData, setFormData] = useState({
    name: expert?.name || '',
    nameUk: expert?.nameUk || '',
    slug: expert?.slug || '',
    avatar: expert?.avatar || '',
    bio: expert?.bio || '',
    bioUk: expert?.bioUk || '',
    position: expert?.position || '',
    positionUk: expert?.positionUk || '',
    experience: expert?.experience || '',
    experienceUk: expert?.experienceUk || '',
    isActive: expert?.isActive !== undefined ? expert.isActive : true,
    color: expert?.color || '#FF5733',
    expertise: expert?.expertise?.join(', ') || '',
    expertiseUk: expert?.expertiseUk?.join(', ') || '',
    achievements: expert?.achievements?.join(', ') || '',
    achievementsUk: expert?.achievementsUk?.join(', ') || '',
    telegram: expert?.telegram || '',
    linkedin: expert?.linkedin || '',
    twitter: expert?.twitter || '',
    email: expert?.email || '',
  });

  useEffect(() => {
    if (mode === 'edit' && expert) {
      setFormData({
        name: expert.name || '',
        nameUk: expert.nameUk || '',
        slug: expert.slug || '',
        avatar: expert.avatar || '',
        bio: expert.bio || '',
        bioUk: expert.bioUk || '',
        position: expert.position || '',
        positionUk: expert.positionUk || '',
        experience: expert.experience || '',
        experienceUk: expert.experienceUk || '',
        isActive: expert.isActive !== undefined ? expert.isActive : true,
        color: expert.color || '#FF5733',
        expertise: expert.expertise?.join(', ') || '',
        expertiseUk: expert.expertiseUk?.join(', ') || '',
        achievements: expert.achievements?.join(', ') || '',
        achievementsUk: expert.achievementsUk?.join(', ') || '',
        telegram: expert.telegram || '',
        linkedin: expert.linkedin || '',
        twitter: expert.twitter || '',
        email: expert.email || '',
      });
    } else {
      // Режим создания — очистить форму
      setFormData({
        name: '',
        nameUk: '',
        slug: '',
        avatar: '',
        bio: '',
        bioUk: '',
        position: '',
        positionUk: '',
        experience: '',
        experienceUk: '',
        isActive: true,
        color: '#FF5733',
        expertise: '',
        expertiseUk: '',
        achievements: '',
        achievementsUk: '',
        telegram: '',
        linkedin: '',
        twitter: '',
        email: '',
      });
    }
  }, [expert, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const payload = {
        ...formData,
        expertise: formData.expertise.split(',').map((item: string) => item.trim()).filter(Boolean),
        expertiseUk: formData.expertiseUk.split(',').map((item: string) => item.trim()).filter(Boolean),
        achievements: formData.achievements.split(',').map((item: string) => item.trim()).filter(Boolean),
        achievementsUk: formData.achievementsUk.split(',').map((item: string) => item.trim()).filter(Boolean),
      };
  
      if (mode === 'create') {
        await ExpertsService.createExpert(payload);
        toast.success("Эксперт успешно создан");
      } else {
        await ExpertsService.updateExpert(expert?.id, payload);
        toast.success("Эксперт успешно обновлён");
      }
  
      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error("Ошибка при сохранении эксперта:", error);
      toast.error("Ошибка при сохранении эксперта");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] scrollbar-none overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              {mode === 'create' ? 'Создать эксперта' : 'Редактировать эксперта'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Имя</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Имя (укр.)</label>
            <input
              name="nameUk"
              type="text"
              value={formData.nameUk}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Слаг</label>
            <input
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">URL аватара</label>
            <input
              name="avatar"
              type="text"
              value={formData.avatar}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Биография</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Биография (укр.)</label>
            <textarea
              name="bioUk"
              value={formData.bioUk}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Должность</label>
              <input
                name="position"
                type="text"
                value={formData.position}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Должность (укр.)</label>
              <input
                name="positionUk"
                type="text"
                value={formData.positionUk}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Опыт</label>
              <input
                name="experience"
                type="text"
                value={formData.experience}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Опыт (укр.)</label>
              <input
                name="experienceUk"
                type="text"
                value={formData.experienceUk}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Активен</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Цвет (hex)</label>
              <input
                name="color"
                type="color"
                value={formData.color}
                onChange={handleChange}
                className="mt-1 w-full h-10 p-0 border border-gray-200 rounded-xl cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Экспертиза (через запятую)</label>
            <input
              name="expertise"
              type="text"
              value={formData.expertise}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Экспертиза (укр., через запятую)</label>
            <input
              name="expertiseUk"
              type="text"
              value={formData.expertiseUk}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Достижения (через запятую)</label>
            <input
              name="achievements"
              type="text"
              value={formData.achievements}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Достижения (укр., через запятую)</label>
            <input
              name="achievementsUk"
              type="text"
              value={formData.achievementsUk}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Telegram</label>
              <input
                name="telegram"
                type="text"
                value={formData.telegram}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
              <input
                name="linkedin"
                type="text"
                value={formData.linkedin}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Twitter</label>
              <input
                name="twitter"
                type="text"
                value={formData.twitter}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}