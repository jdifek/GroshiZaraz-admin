/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useRef } from "react";
import NewsService from "../services/news/newsService";
import { Category } from "../services/categories/categoriesTypes";
import { Author } from "../services/authors/authorsTypes";
import { toast } from "react-toastify";

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

  const [authorDropdownOpen, setAuthorDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const authorRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

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

  // Закрываем дропдауны при клике вне
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        authorRef.current &&
        !authorRef.current.contains(event.target as Node)
      ) {
        setAuthorDropdownOpen(false);
      }
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    setAuthorDropdownOpen(false);
  };

  // Обработчик выбора из кастомного дропдауна (категория)
  const selectCategory = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      newsCategoryId: id,
    }));
    setCategoryDropdownOpen(false);
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

          {/* Кастомный дропдаун для выбора автора */}
          <div className="relative" ref={authorRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Автор
            </label>
            <button
              type="button"
              onClick={() => setAuthorDropdownOpen(!authorDropdownOpen)}
              className="w-full text-black border border-gray-300 rounded-xl px-4 py-2 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {authors.find((a) => a.id.toString() === formData.authorId)
                ?.name || "Выберите автора"}
              <svg
                className={`w-5 h-5 ml-2 transition-transform duration-200 ${
                  authorDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {authorDropdownOpen && (
              <ul className="absolute text-black z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl max-h-48 overflow-auto shadow-lg">
                {authors.map((author) => (
                  <li
                    key={author.id}
                    onClick={() => selectAuthor(author.id.toString())}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-600 hover:text-white rounded-xl ${
                      formData.authorId.toString() === author.id.toString()
                        ? "bg-blue-600 text-white"
                        : ""
                    }`}
                  >
                    {author.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Кастомный дропдаун для выбора категории */}
          <div className="relative" ref={categoryRef}>
            <label className="block  text-sm font-medium text-gray-700 mb-1">
              Категория
            </label>
            <button
              type="button"
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="w-full text-black border border-gray-300 rounded-xl px-4 py-2 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.find(
                (c) => c.id.toString() === formData.newsCategoryId
              )?.name || "Выберите категорию"}
              <svg
                className={`w-5 h-5 ml-2 transition-transform duration-200 ${
                  categoryDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {categoryDropdownOpen && (
              <ul className="absolute z-10 mt-1 w-full text-black bg-white border border-gray-300 rounded-xl max-h-48 overflow-auto shadow-lg">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    onClick={() => selectCategory(category.id.toString())}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-600 hover:text-white rounded-xl ${
                      formData.newsCategoryId.toString() ===
                      category.id.toString()
                        ? "bg-blue-600 text-white"
                        : ""
                    }`}
                  >
                    {category.name} {category.icon}
                  </li>
                ))}
              </ul>
            )}
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
