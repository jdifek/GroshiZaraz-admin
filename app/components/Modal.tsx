/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useContext } from 'react';
import { X } from 'lucide-react';
import { DataContext } from '../context/DataContext';

export default function Modal() {
  const {
    isModalOpen,
    setIsModalOpen,
    modalMode,
    selectedItem,
    activeSection,
    handleSave,
  } = useContext(DataContext);

  if (!isModalOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData) as any;

    if (activeSection === 'mfos') {
      data.rating = parseFloat(data.rating as string);
      data.reviews = parseInt(data.reviews as string);
      data.minAmount = parseInt(data.minAmount as string);
      data.maxAmount = parseInt(data.maxAmount as string);
      data.minTerm = parseInt(data.minTerm as string);
      data.maxTerm = parseInt(data.maxTerm as string);
      data.rateMin = parseFloat(data.rateMin as string);
      data.rateMax = parseFloat(data.rateMax as string);
      data.approvalRate = parseInt(data.approvalRate as string);
      data.isFirstLoanZero = data.isFirstLoanZero === 'on';
      data.isInstantApproval = data.isInstantApproval === 'on';
      data.isNoIncomeProof = data.isNoIncomeProof === 'on';
      data.is24Support = data.is24Support === 'on';
      data.isSafeTransactions = data.isSafeTransactions === 'on';
      data.isFlexibleTerms = data.isFlexibleTerms === 'on';
      data.ageFrom = parseInt(data.ageFrom as string);
      data.ageTo = parseInt(data.ageTo as string);
      if (modalMode === 'edit') data.id = selectedItem.id;
    } else if (activeSection === 'news') {
      data.published = data.published === 'on';
      data.views = parseInt(data.views as string);
      data.readingMinutes = parseInt(data.readingMinutes as string);
      data.authorId = parseInt(data.authorId as string);
      data.newsCategoryId = parseInt(data.newsCategoryId as string);
      if (modalMode === 'edit') data.id = selectedItem.id;
    } else if (activeSection === 'authors') {
      data.totalViews = parseInt(data.totalViews as string) || 0;
      data.totalPosts = parseInt(data.totalPosts as string) || 0;
      data.followers = parseInt(data.followers as string) || 0;
      data.expertise = data.expertise ? data.expertise.split(',').map((item: string) => item.trim()) : [];
      data.achievements = data.achievements ? data.achievements.split(',').map((item: string) => item.trim()) : [];
      if (modalMode === 'edit') data.id = selectedItem.id;
      // Удаляем пустые строки для необязательных полей
      if (!data.bio) delete data.bio;
      if (!data.color) delete data.color;
      if (!data.telegram) delete data.telegram;
      if (!data.linkedin) delete data.linkedin;
      if (!data.twitter) delete data.twitter;
      if (!data.email) delete data.email;
    } else if (activeSection === 'categories') {
      if (modalMode === 'edit') data.id = selectedItem.id;
    } else if (activeSection === 'reviews') {
      data.rating = parseInt(data.rating as string);
      data.isModerated = data.isModerated === 'on';
      data.targetId = parseInt(data.targetId as string);
      if (modalMode === 'edit') data.id = selectedItem.id;
    } else if (activeSection === 'questions') {
      data.isModerated = data.isModerated === 'on';
      data.targetId = parseInt(data.targetId as string);
      if (modalMode === 'edit') data.id = selectedItem.id;
    } else if (activeSection === 'questionAnswers') {
      data.isModerated = data.isModerated === 'on';
      data.questionId = parseInt(data.questionId as string);
      if (modalMode === 'edit') data.id = selectedItem.id;
    } else if (activeSection === 'licenses') {
      data.mfoId = parseInt(data.mfoId as string);
      if (modalMode === 'edit') data.id = selectedItem.id;
    } else if (activeSection === 'tags') {
      if (modalMode === 'edit') data.id = selectedItem.id;
    }

    handleSave(activeSection, data);
  };

  const renderFormFields = () => {
    switch (activeSection) {
      case 'mfos':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Название</label>
              <input name="name" type="text" defaultValue={selectedItem?.name || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Рейтинг</label>
                <input name="rating" type="number" step="0.1" defaultValue={selectedItem?.rating || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Отзывы</label>
                <input name="reviews" type="number" defaultValue={selectedItem?.reviews || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Логотип</label>
              <input name="logo" type="text" defaultValue={selectedItem?.logo || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Номер лицензии</label>
              <input name="licenseNumber" type="text" defaultValue={selectedItem?.licenseNumber || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Минимальная сумма</label>
                <input name="minAmount" type="number" defaultValue={selectedItem?.minAmount || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Максимальная сумма</label>
                <input name="maxAmount" type="number" defaultValue={selectedItem?.maxAmount || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Минимальный срок</label>
                <input name="minTerm" type="number" defaultValue={selectedItem?.minTerm || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Максимальный срок</label>
                <input name="maxTerm" type="number" defaultValue={selectedItem?.maxTerm || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Минимальная ставка</label>
                <input name="rateMin" type="number" step="0.1" defaultValue={selectedItem?.rateMin || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Максимальная ставка</label>
                <input name="rateMax" type="number" step="0.1" defaultValue={selectedItem?.rateMax || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Процент одобрения</label>
              <input name="approvalRate" type="number" defaultValue={selectedItem?.approvalRate || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Время принятия решения</label>
              <input name="decisionTime" type="text" defaultValue={selectedItem?.decisionTime || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Первый займ под 0%</label>
                <input name="isFirstLoanZero" type="checkbox" defaultChecked={selectedItem?.isFirstLoanZero || false} className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Мгновенное одобрение</label>
                <input name="isInstantApproval" type="checkbox" defaultChecked={selectedItem?.isInstantApproval || false} className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Телефон</label>
              <input name="phone" type="text" defaultValue={selectedItem?.phone || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Вебсайт</label>
              <input name="website" type="text" defaultValue={selectedItem?.website || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Описание</label>
              <textarea name="description" defaultValue={selectedItem?.description || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Возраст от</label>
                <input name="ageFrom" type="number" defaultValue={selectedItem?.ageFrom || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Возраст до</label>
                <input name="ageTo" type="number" defaultValue={selectedItem?.ageTo || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Гражданство</label>
              <input name="citizenship" type="text" defaultValue={selectedItem?.citizenship || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Документы</label>
              <input name="documents" type="text" defaultValue={selectedItem?.documents || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Без справки о доходах</label>
                <input name="isNoIncomeProof" type="checkbox" defaultChecked={selectedItem?.isNoIncomeProof || false} className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Круглосуточная поддержка</label>
                <input name="is24Support" type="checkbox" defaultChecked={selectedItem?.is24Support || false} className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Безопасные транзакции</label>
                <input name="isSafeTransactions" type="checkbox" defaultChecked={selectedItem?.isSafeTransactions || false} className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Гибкие условия</label>
                <input name="isFlexibleTerms" type="checkbox" defaultChecked={selectedItem?.isFlexibleTerms || false} className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Рабочее время (будни)</label>
              <input name="workTimeWeekdays" type="text" defaultValue={selectedItem?.workTimeWeekdays || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Рабочее время (выходные)</label>
              <input name="workTimeWeekend" type="text" defaultValue={selectedItem?.workTimeWeekend || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Рабочее время (онлайн)</label>
              <input name="workTimeOnline" type="text" defaultValue={selectedItem?.workTimeOnline || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        );
      case 'news':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Заголовок</label>
              <input name="title" type="text" defaultValue={selectedItem?.title || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Слаг</label>
              <input name="slug" type="text" defaultValue={selectedItem?.slug || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Содержание</label>
              <textarea name="body" defaultValue={selectedItem?.body || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" rows={6} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Опубликовано</label>
              <input name="published" type="checkbox" defaultChecked={selectedItem?.published || false} className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Просмотры</label>
              <input name="views" type="number" defaultValue={selectedItem?.views || 0} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Время чтения (минуты)</label>
              <input name="readingMinutes" type="number" defaultValue={selectedItem?.readingMinutes || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID автора</label>
              <input name="authorId" type="number" defaultValue={selectedItem?.authorId || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID категории</label>
              <input name="newsCategoryId" type="number" defaultValue={selectedItem?.newsCategoryId || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
        );
        case 'authors':
          return (
            <div className="space-y-4">
              {/* Имя */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Имя</label>
                <input
                  name="name"
                  type="text"
                  defaultValue={selectedItem?.name || ''}
                  className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Слаг */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Слаг</label>
                <input
                  name="slug"
                  type="text"
                  defaultValue={selectedItem?.slug || ''}
                  className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Аватар */}
              <div>
                <label className="block text-sm font-medium text-gray-700">URL аватара</label>
                <input
                  name="avatar"
                  type="text"
                  defaultValue={selectedItem?.avatar || ''}
                  className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Биография */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Биография</label>
                <textarea
                  name="bio"
                  defaultValue={selectedItem?.bio || ''}
                  className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
              {/* Должность и опыт */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Должность</label>
                  <input
                    name="position"
                    type="text"
                    defaultValue={selectedItem?.position || ''}
                    className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Опыт</label>
                  <input
                    name="experience"
                    type="text"
                    defaultValue={selectedItem?.experience || ''}
                    className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              {/* Подписчики и цвет */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Подписчики</label>
                  <input
                    name="followers"
                    type="number"
                    defaultValue={selectedItem?.followers || 0}
                    className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Цвет (hex)</label>
                  <input
                    name="color"
                    type="text"
                    defaultValue={selectedItem?.color || ''}
                    className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="#FF5733"
                  />
                </div>
              </div>
              {/* Экспертиза и достижения */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Экспертиза (через запятую)</label>
                <input
                  name="expertise"
                  type="text"
                  defaultValue={selectedItem?.expertise?.join(', ') || ''}
                  className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Достижения (через запятую)</label>
                <input
                  name="achievements"
                  type="text"
                  defaultValue={selectedItem?.achievements?.join(', ') || ''}
                  className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Социальные сети */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telegram</label>
                  <input
                    name="telegram"
                    type="text"
                    defaultValue={selectedItem?.telegram || ''}
                    className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="@username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                  <input
                    name="linkedin"
                    type="text"
                    defaultValue={selectedItem?.linkedin || ''}
                    className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="linkedin.com/in/username"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Twitter</label>
                  <input
                    name="twitter"
                    type="text"
                    defaultValue={selectedItem?.twitter || ''}
                    className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="@username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={selectedItem?.email || ''}
                    className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {/* Метрики */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Всего просмотров</label>
                  <input
                    name="totalViews"
                    type="number"
                    defaultValue={selectedItem?.totalViews || 0}
                    className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Всего постов</label>
                  <input
                    name="totalPosts"
                    type="number"
                    defaultValue={selectedItem?.totalPosts || 0}
                    className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          );
      case 'categories':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Название</label>
              <input name="name" type="text" defaultValue={selectedItem?.name || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Иконка</label>
              <input name="icon" type="text" defaultValue={selectedItem?.icon || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        );
      case 'reviews':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Рейтинг</label>
              <input name="rating" type="number" min="1" max="5" defaultValue={selectedItem?.rating || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Текст отзыва</label>
              <textarea name="textOriginal" defaultValue={selectedItem?.textOriginal || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" rows={4} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Одобрено</label>
              <input name="isModerated" type="checkbox" defaultChecked={selectedItem?.isModerated || false} className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Тип цели</label>
              <input name="targetType" type="text" defaultValue={selectedItem?.targetType || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID цели</label>
              <input name="targetId" type="number" defaultValue={selectedItem?.targetId || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
        );
      case 'questions':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Текст вопроса</label>
              <textarea name="textOriginal" defaultValue={selectedItem?.textOriginal || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" rows={4} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Одобрено</label>
              <input name="isModerated" type="checkbox" defaultChecked={selectedItem?.isModerated || false} className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Тип цели</label>
              <input name="targetType" type="text" defaultValue={selectedItem?.targetType || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID цели</label>
              <input name="targetId" type="number" defaultValue={selectedItem?.targetId || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
        );
      case 'questionAnswers':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Текст ответа</label>
              <textarea name="textOriginal" defaultValue={selectedItem?.textOriginal || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" rows={4} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Одобрено</label>
              <input name="isModerated" type="checkbox" defaultChecked={selectedItem?.isModerated || false} className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID вопроса</label>
              <input name="questionId" type="number" defaultValue={selectedItem?.questionId || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
        );
      case 'licenses':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Номер лицензии</label>
              <input name="number" type="text" defaultValue={selectedItem?.number || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Дата выдачи</label>
              <input name="issuedAt" type="date" defaultValue={selectedItem?.issuedAt || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Действует до</label>
              <input name="validTill" type="date" defaultValue={selectedItem?.validTill || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID МФО</label>
              <input name="mfoId" type="number" defaultValue={selectedItem?.mfoId || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
        );
      case 'tags':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Название тега</label>
              <input name="name" type="text" defaultValue={selectedItem?.name || ''} className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
<div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              {modalMode === 'create' ? 'Создать' : 'Редактировать'} {activeSection === 'mfos' ? 'МФО' :
                activeSection === 'news' ? 'Новость' :
                activeSection === 'authors' ? 'Автора' :
                activeSection === 'categories' ? 'Категорию' :
                activeSection === 'reviews' ? 'Отзыв' :
                activeSection === 'questions' ? 'Вопрос' :
                activeSection === 'questionAnswers' ? 'Ответ' :
                activeSection === 'licenses' ? 'Лицензию' :
                activeSection === 'tags' ? 'Тег' : ''}
            </h2>
            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          {renderFormFields()}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              {modalMode === 'create' ? 'Создать' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}