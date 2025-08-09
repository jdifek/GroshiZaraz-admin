'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Mfo, MfoPayload } from '../services/mfos/mfoTypes';
import MfoService from '../services/mfos/mfosService';

interface MfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  mfo?: Mfo;
  onSubmitSuccess: () => void;
}

export default function MfoModal({ isOpen, onClose, mode, mfo, onSubmitSuccess }: MfoModalProps) {
  const [formData, setFormData] = useState<MfoPayload>({
    name: '',
    rating: 0,
    reviews: 0,
    logo: '',
    licenseNumber: '',
    isActive: true, 
    minAmount: 0,
    maxAmount: 0,
    minTerm: 0,
    maxTerm: 0,
    rateMin: 0,
    rateMax: 0,
    approvalRate: 0,
    decisionTime: '',
    isFirstLoanZero: false,
    isInstantApproval: false,
    phone: '',
    website: '',
    description: '',
    ageFrom: 18,
    ageTo: 65,
    citizenship: '',
    documents: '',
    isNoIncomeProof: false,
    is24Support: false,
    isSafeTransactions: false,
    isFlexibleTerms: false,
    workTimeWeekdays: '',
    workTimeWeekend: '',
    workTimeOnline: '',
  });

  useEffect(() => {
    if (mode === 'edit' && mfo) {
      setFormData({ ...formData, ...mfo });
    }
  }, [mode, mfo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" && e.target instanceof HTMLInputElement
          ? e.target.checked
          : value,
    }));
  };
  


  const numericFields: (keyof MfoPayload)[] = [
    'rating', 'reviews', 'minAmount', 'maxAmount', 'minTerm', 'maxTerm',
    'rateMin', 'rateMax', 'approvalRate', 'ageFrom', 'ageTo',
  ];
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Создаем копию formData с числовыми полями, приведенными к числу
    const parsedData = {
      ...formData,
      ...numericFields.reduce((acc, key) => {
        const val = formData[key];
        acc[key] = val !== '' ? Number(val) : 0;
        return acc;
      }, {} as Record<string, number>),
    } as MfoPayload;
    
  
    try {
      if (mode === 'create') {
        await MfoService.createMfo(parsedData);
        toast.success('МФО успешно создана');
      } else if (mfo?.id) {
        await MfoService.updateMfo(mfo.id, parsedData);
        toast.success('МФО успешно обновлена');
      }
      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error('Ошибка при сохранении МФО:', error);
      toast.error('Ошибка при сохранении МФО');
    }
  };
  

  if (!isOpen) return null;

  const renderInput = (label: string, name: keyof MfoPayload, type = 'text', step?: string | number, isTextarea = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {isTextarea ? (
        <textarea
          name={name}
          value={formData[name] as string}
          onChange={handleChange}
          className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      ) : (
        <input
          name={name}
          type={type}
          step={step}
          value={formData[name] as string | number | undefined}
          onChange={handleChange}
          className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );

  const renderCheckbox = (label: string, name: keyof MfoPayload) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        name={name}
        type="checkbox"
        checked={formData[name] as boolean}
        onChange={handleChange}
        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] scrollbar-none overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {mode === 'create' ? 'Добавить МФО' : 'Редактировать МФО'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {renderInput('Название', 'name')}
          <div className="grid grid-cols-2 gap-4">
            {renderInput('Рейтинг', 'rating', 'number', 0.1)}
            {renderInput('Отзывы', 'reviews', 'number')}
          </div>
          {renderInput('Логотип', 'logo')}
          {renderInput('Номер лицензии', 'licenseNumber')}
          <div className="grid grid-cols-2 gap-4">
            {renderInput('Минимальная сумма', 'minAmount', 'number')}
            {renderInput('Максимальная сумма', 'maxAmount', 'number')}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {renderInput('Минимальный срок', 'minTerm', 'number')}
            {renderInput('Максимальный срок', 'maxTerm', 'number')}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {renderInput('Минимальная ставка', 'rateMin', 'number', 0.1)}
            {renderInput('Максимальная ставка', 'rateMax', 'number', 0.1)}
          </div>
          {renderInput('Процент одобрения', 'approvalRate', 'number')}
          {renderInput('Время принятия решения', 'decisionTime')}
          <div className="grid grid-cols-2 gap-4">
            {renderCheckbox('Первый займ под 0%', 'isFirstLoanZero')}
            {renderCheckbox('Мгновенное одобрение', 'isInstantApproval')}
          </div>
          {renderInput('Телефон', 'phone')}
          {renderInput('Вебсайт', 'website')}
          {renderInput('Описание', 'description', 'text', undefined, true)}
          <div className="grid grid-cols-2 gap-4">
            {renderInput('Возраст от', 'ageFrom', 'number')}
            {renderInput('Возраст до', 'ageTo', 'number')}
          </div>
          {renderInput('Гражданство', 'citizenship')}
          {renderInput('Документы', 'documents')}
          <div className="grid grid-cols-2 gap-4">
            {renderCheckbox('Без справки о доходах', 'isNoIncomeProof')}
            {renderCheckbox('Круглосуточная поддержка', 'is24Support')}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {renderCheckbox('Безопасные транзакции', 'isSafeTransactions')}
            {renderCheckbox('Гибкие условия', 'isFlexibleTerms')}
          </div>
          {renderInput('Рабочее время (будни)', 'workTimeWeekdays')}
          {renderInput('Рабочее время (выходные)', 'workTimeWeekend')}
          {renderInput('Рабочее время (онлайн)', 'workTimeOnline')}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-sm font-semibold hover:bg-gray-100"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}