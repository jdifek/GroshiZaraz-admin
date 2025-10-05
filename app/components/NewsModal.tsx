/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
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
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

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
      // Устанавливаем превью существующего изображения
      if (newsItem.image) {
        setPreviewUrl(newsItem.image);
      }
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
      setFile(null);
      setPreviewUrl(null);
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

  const selectAuthor = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      authorId: id,
    }));
  };

  const selectCategory = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      newsCategoryId: id,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Создаем FormData для отправки файла
    const formDataToSend = new FormData();

    // Добавляем все текстовые поля
    formDataToSend.append("title", formData.title);
    formDataToSend.append("titleUk", formData.titleUk);
    formDataToSend.append("slug", formData.slug);
    formDataToSend.append("slugUk", formData.slugUk);
    formDataToSend.append("body", formData.body);
    formDataToSend.append("bodyUk", formData.bodyUk);
    formDataToSend.append("published", formData.published.toString());
    formDataToSend.append("views", formData.views.toString());
    formDataToSend.append("readingMinutes", formData.readingMinutes.toString());
    formDataToSend.append("authorId", formData.authorId);
    formDataToSend.append("newsCategoryId", formData.newsCategoryId);

    // Добавляем createdAt если есть
    if (formData.createdAt) {
      formDataToSend.append("createdAt", new Date(formData.createdAt).toISOString());
    }

    // Добавляем файл, если выбран новый
    if (file) {
      formDataToSend.append("image", file);
    }

    try {
      if (mode === "edit" && newsItem?.id) {
        await NewsService.updateNews(newsItem.id, formDataToSend);
        toast.success("Новость успешно обновлена");
      } else {
        await NewsService.createNews(formDataToSend);
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
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center overflow-auto px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl relative max-h-[90vh] scrollbar-none overflow-y-auto">
        <h2 className="text-black text-2xl font-bold mb-4">
          {mode === "edit" ? "Редактировать новость" : "Добавить новость"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Фото новости
            </label>

            {!previewUrl ? (
              <label className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-12 h-12 mb-3 text-gray-400 group-hover:text-gray-500 transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Нажмите для загрузки</span> или
                    перетащите файл
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG, WEBP до 10MB</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Рекомендуемый размер: 1200x600px
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 shadow-lg group">
                <div className="relative h-64 bg-gray-900">
                  <img
                    src={previewUrl}
                    alt="Превью новости"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                    <label className="cursor-pointer px-4 py-2 bg-white/90 text-gray-900 font-medium rounded-xl hover:bg-white transition backdrop-blur-sm">
                      Изменить
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreviewUrl(null);
                      }}
                      className="px-4 py-2 bg-red-500/90 text-white font-medium rounded-xl hover:bg-red-500 transition backdrop-blur-sm"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
                <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full shadow-lg">
                  ✓ Загружено
                </div>
              </div>
            )}
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