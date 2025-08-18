/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useRef } from "react";
import NewsService from "../services/news/newsService";
import { Category } from "../services/categories/categoriesTypes";
import { Author } from "../services/authors/authorsTypes";
import { toast } from "react-toastify";
import { Dropdown } from "../ui/Dropdowns/Dropdown";

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  newsItem: any;
  onSubmitSuccess: () => void;
  categories: Category[];
  authors: Author[];
}

export default function NewsModal({
  isOpen,
  onClose,
  mode,
  newsItem,
  onSubmitSuccess,
  categories,
  authors,
}: NewsModalProps) {
  const [formData, setFormData] = useState<any>({
    title: "",
    titleUk: "",
    slug: "",
    slugUk: "",
    body: "",
    bodyUk: "",
    published: false,
    views: 0,
    readingMinutes: 0,
    authorId: "",
    newsCategoryId: "",
    createdAt: "", // или Date, если хочешь
  });

  useEffect(() => {
    if (newsItem && mode === "edit") {
      setFormData({
        title: newsItem.title || "",
        titleUk: newsItem.titleUk || "",
        slug: newsItem.slug || "",
        slugUk: newsItem.slugUk || "",
        body: newsItem.body || "",
        bodyUk: newsItem.bodyUk || "",
        published: newsItem.published || false,
        views: newsItem.views || 0,
        readingMinutes: newsItem.readingMinutes || 0,
        authorId: newsItem.authorId?.toString() || "",
        newsCategoryId: newsItem.newsCategoryId?.toString() || "",
        createdAt: newsItem.createdAt || "",
      });
    } else {
      setFormData({
        title: "",
        titleUk: "",
        slug: "",
        slugUk: "",
        body: "",
        bodyUk: "",
        published: false,
        views: 0,
        readingMinutes: 0,
        authorId: "",
        newsCategoryId: "",
        createdAt: "",
      });
    }
  }, [newsItem, mode]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    if (type === "checkbox") {
      setFormData((prev: any) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "number") {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Обработчик выбора из кастомного дропдауна (автор)
  const selectAuthor = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      authorId: id,
    }));
  };

  // Обработчик выбора из кастомного дропдауна (категория)
  const selectCategory = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      newsCategoryId: id,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      authorId: Number(formData.authorId),
      newsCategoryId: Number(formData.newsCategoryId),
      views: Number(formData.views),
      readingMinutes: Number(formData.readingMinutes),
    };

    try {
      if (mode === "edit" && newsItem?.id) {
        await NewsService.updateNews(newsItem.id, payload);
        toast.success("Новость успешно обновлена");
      } else {
        await NewsService.createNews(payload);
        toast.success("Новость успешно создана");
      }

      onSubmitSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Ошибка при сохранении новости");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center  overflow-auto px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl relative max-h-[90vh] scrollbar-none overflow-y-auto">
        <h2 className="text-black text-2xl font-bold mb-4">
          {mode === "edit" ? "Редактировать новость" : "Добавить новость"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Остальные поля остаются без изменений */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Заголовок
            </label>
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Слаг
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Содержание
            </label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              rows={6}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Заголовок (укр)
            </label>
            <input
              name="titleUk"
              type="text"
              value={formData.titleUk}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Слаг (укр)
            </label>
            <input
              name="slugUk"
              type="text"
              value={formData.slugUk}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Содержание (укр)
            </label>
            <textarea
              name="bodyUk"
              value={formData.bodyUk}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              rows={6}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              name="published"
              type="checkbox"
              checked={formData.published}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-sm font-medium text-gray-700">
              Опубликовано
            </label>
          </div>
           {/* Кастомный дропдаун для выбора автора */}
           <Dropdown
            label="Автор"
            options={authors.map((a) => ({ id: a.id, name: a.name }))}
            value={formData.authorId}
            onSelect={(id) => selectAuthor(id.toString())}
          />

          <Dropdown
            label="Категория"
            options={categories.map((c) => ({
              id: c.id,
              name: c.name,
              icon: c.icon,
            }))}
            value={formData.newsCategoryId}
            onSelect={(id) => selectCategory(id.toString())}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Просмотры
            </label>
            <input
              name="views"
              type="number"
              value={formData.views}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Время чтения (минуты)
            </label>
            <input
              name="readingMinutes"
              type="number"
              value={formData.readingMinutes}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

         

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              {mode === "edit" ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
