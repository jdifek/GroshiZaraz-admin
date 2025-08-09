'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import AuthorsService from '../services/authors/authorsService';
import { toast } from 'react-toastify';

interface AuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  author?: any;
  onSubmitSuccess: () => void; // Callback to refresh the author list
}

export default function AuthorModal({ isOpen, onClose, mode, author, onSubmitSuccess }: AuthorModalProps) {
  const [formData, setFormData] = useState({
    name: author?.name || '',
    nameUk: author?.nameUk || '',
    slug: author?.slug || '',
    avatar: author?.avatar || '',
    bio: author?.bio || '',
    bioUk: author?.bioUk || '',
    position: author?.position || '',
    positionUk: author?.positionUk || '',
    experience: author?.experience || '',
    experienceUk: author?.experienceUk || '',
    followers: author?.followers || 0,
    color: author?.color || '#FF5733',
    expertise: author?.expertise?.join(', ') || '',
    expertiseUk: author?.expertiseUk?.join(', ') || '',
    achievements: author?.achievements?.join(', ') || '',
    achievementsUk: author?.achievementsUk?.join(', ') || '',
    telegram: author?.telegram || '',
    linkedin: author?.linkedin || '',
    twitter: author?.twitter || '',
    email: author?.email || '',
    totalViews: author?.totalViews || 0,
    totalPosts: author?.totalPosts || 0,
  });

  useEffect(() => {
    if (mode === 'edit' && author) {
      setFormData({
        name: author.name || '',
        nameUk: author.nameUk || '',
        slug: author.slug || '',
        avatar: author.avatar || '',
        bio: author.bio || '',
        bioUk: author.bioUk || '',
        position: author.position || '',
        positionUk: author.positionUk || '',
        experience: author.experience || '',
        experienceUk: author.experienceUk || '',
        followers: author.followers || 0,
        color: author.color || '#FF5733',
        expertise: author.expertise?.join(', ') || '',
        expertiseUk: author.expertiseUk?.join(', ') || '',
        achievements: author.achievements?.join(', ') || '',
        achievementsUk: author.achievementsUk?.join(', ') || '',
        telegram: author.telegram || '',
        linkedin: author.linkedin || '',
        twitter: author.twitter || '',
        email: author.email || '',
        totalViews: author.totalViews || 0,
        totalPosts: author.totalPosts || 0,
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
        followers: 0,
        color: '#FF5733',
        expertise: '',
        expertiseUk: '',
        achievements: '',
        achievementsUk: '',
        telegram: '',
        linkedin: '',
        twitter: '',
        email: '',
        totalViews: 0,
        totalPosts: 0,
      });
    }
  }, [author, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        followers: Number(formData.followers) || 0,
        totalViews: Number(formData.totalViews) || 0,
        totalPosts: Number(formData.totalPosts) || 0,
      };
  
      if (mode === 'create') {
        await AuthorsService.createAuthor(payload);
        toast.success("Автор успешно создан");
      } else {
        await AuthorsService.updateAuthor(author?.id, payload);
        toast.success("Автор успешно обновлён");
      }
  
      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error("Ошибка при сохранении автора:", error);
      toast.error("Ошибка при сохранении автора");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] scrollbar-none overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              {mode === 'create' ? 'Создать автора' : 'Редактировать автора'}
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
              required
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
            <div>
              <label className="block text-sm font-medium text-gray-700">Подписчики</label>
              <input
                name="followers"
                type="number"
                value={formData.followers}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Всего просмотров</label>
              <input
                name="totalViews"
                type="number"
                value={formData.totalViews}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Всего публикаций</label>
              <input
                name="totalPosts"
                type="number"
                value={formData.totalPosts}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
