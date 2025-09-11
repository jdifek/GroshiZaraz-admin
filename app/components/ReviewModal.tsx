"use client";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";

interface Review {
  id: number;
  rating: number;
  textOriginal: string;
  textUk?: string;
  textRu?: string;
  isModerated: boolean;
  targetType: string;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Review>) => void;
  mode: "create" | "edit";
  review: Review | null;
}

export default function ReviewModal({
  isOpen,
  onClose,
  onSave,
  mode,
  review,
}: ReviewModalProps) {
  const [formData, setFormData] = useState<Partial<Review>>({});

  useEffect(() => {
    if (isOpen && review && mode === "edit") {
      setFormData({ ...review });
    } else {
      setFormData({
        rating: 5,
        textOriginal: "",
        textUk: "",
        textRu: "",
        isModerated: false,
      });
    }
  }, [isOpen, review, mode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "rating" || name === "targetId"
          ? parseInt(value)
          : value,
    }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating,
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
          {mode === "create" ? "Создать отзыв" : "Редактировать отзыв"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Рейтинг */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Рейтинг
            </label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleRatingClick(index + 1)}
                  className="focus:outline-none transition-colors"
                >
                  <Star
                    className={`w-8 h-8 ${
                      index < (formData.rating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 hover:text-yellow-200"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600 self-center">
                {formData.rating || 0}/5
              </span>
            </div>
          </div>

          {/* Текст отзыва */}
          <TextareaField
            label="Текст отзыва (оригинал)"
            name="textOriginal"
            value={formData.textOriginal || ""}
            onChange={handleChange}
          />

          {mode === "edit" && (
            <>
              <TextareaField
                label="Текст (украинский)"
                name="textUk"
                value={formData.textUk || ""}
                onChange={handleChange}
              />
              <TextareaField
                label="Текст (русский)"
                name="textRu"
                value={formData.textRu || ""}
                onChange={handleChange}
              />

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
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        name={name}
        rows={3}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
