'use client';
import { useState, useEffect } from 'react';
import { Dropdown } from '../ui/Dropdowns/Dropdown';
import { usePathname } from "next/navigation";

interface Question {
  id: number;
  name: string;
  email: string;
  subject: string;
  category: string;
  textOriginal: string;
  textUk?: string;
  textRu?: string;
  isModerated: boolean;
  createdAt: string;
  targetType: 'bank' | 'mfo' | 'license' | 'site';
  targetId: number;
}

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Question>) => void;
  mode: 'create' | 'edit';
  question: Question | null;
}

export default function QuestionModal({
  isOpen,
  onClose,
  onSave,
  mode,
  question,
}: QuestionModalProps) {
  const [formData, setFormData] = useState<Partial<Question>>({});
  const pathname = usePathname(); // получаем путь
  const isMfoPage = pathname === "/questions-mfo";
  const categories = [
    "Все категории",
    "Подача заявки",
    "Сроки",
    "Документы",
    "Кредитная история",
    "Стоимость",
    "Погашение",
    "Проблемы с погашением",
    "Безопасность",
    "Режим работы",
  ];

  const targetTypes = [
    { id: "bank", name: "Банк" },
    { id: "mfo", name: "МФО" },
    { id: "license", name: "Лицензия" },
    { id: "site", name: "Сайт" },
  ];

  useEffect(() => {
    if (isOpen && question && mode === 'edit') {
      setFormData({ ...question });
    } else {
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'Все категории',
        textOriginal: '',
        textUk: '',
        textRu: '',
        targetType: isMfoPage ? 'site' : 'mfo',
        targetId: isMfoPage ? 1 : 0,
        isModerated: false,
      });
    }
  }, [isOpen, question, mode, isMfoPage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
    }));
  };

  const handleSelect = (name: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-xl mx-4 overflow-y-auto scrollbar-none max-h-[90vh]">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {mode === 'create' ? 'Создать вопрос' : 'Редактировать вопрос'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <InputField label="Имя" name="name" value={formData.name || ''} onChange={handleChange} />
          <InputField label="Email" name="email" value={formData.email || ''} onChange={handleChange} />
          <InputField label="Тема" name="subject" value={formData.subject || ''} onChange={handleChange} />

          {/* Категория */}
          <Dropdown
            label="Категория"
            options={categories.map(cat => ({ id: cat, name: cat }))}
            value={formData.category || 'Все категории'}
            onSelect={(val) => handleSelect('category', val)}
          />

          <TextareaField
            label="Текст вопроса (оригинал)"
            name="textOriginal"
            value={formData.textOriginal || ''}
            onChange={handleChange}
          />

          {/* Тип объекта */}
          <Dropdown
            label="Тип объекта"
            options={targetTypes}
            value={formData.targetType || 'mfo'}
            onSelect={(val) => handleSelect('targetType', val)}
          />
<InputField
  label="ID объекта (targetId)"
  name="targetId"
  type="number"
  value={formData.targetId?.toString() || '0'}
  onChange={handleChange}
  disabled={isMfoPage}
/>

          {mode === 'edit' && (
            <>
              <TextareaField label="Текст (украинский)" name="textUk" value={formData.textUk || ''} onChange={handleChange} />
              <TextareaField label="Текст (русский)" name="textRu" value={formData.textRu || ''} onChange={handleChange} />

              <div className="flex items-center gap-2">
                <input
                  id="isModerated"
                  name="isModerated"
                  type="checkbox"
                  checked={formData.isModerated || false}
                  onChange={handleChange}
                />
                <label htmlFor="isModerated" className="text-sm text-gray-700">
                  Одобрено модератором
                </label>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-2">
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

function InputField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  disabled
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

function TextareaField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        name={name}
        rows={3}
        value={value}
        onChange={onChange}
        className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
