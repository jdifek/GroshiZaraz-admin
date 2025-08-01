/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { Search, Plus, Trash2, FileText, Eye } from "lucide-react";
import AuthorModal from "../components/AuthorModal";
import { formatNumber } from "../utils/format";
import AuthorsService from "../services/authors/authorsService";
import { Author } from "../services/authors/authorsTypes";
import { toast } from "react-toastify";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const data = await AuthorsService.getAllAuthors();
      setAuthors(data);
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  };
  const handleDelete = async (id: string) => {
  
    try {
      await AuthorsService.deleteAuthor(id);
      setAuthors(authors.filter((author) => author.id !== Number(id)));
      toast.success("Автор успешно удалён");
    } catch (error) {
      console.error("Ошибка при удалении автора:", error);
      toast.error("Не удалось удалить автора");
    }
  };

  const openModal = (mode: "create" | "edit", author: any = null) => {
    setModalMode(mode);
    setSelectedAuthor(author);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Управление авторами
          </h1>
          <p className="text-gray-600">Добавление и редактирование авторов</p>
        </div>
        <button
          onClick={() => openModal("create")}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Добавить автора
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск авторов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {authors
          .filter((author) =>
            author.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((author) => (
            <div
              key={author.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {author.name.charAt(0)}
                </div>
                <div className="flex-1 relative">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {author.name}
                  </h3>
                  <p className="truncate text-gray-600 text-sm mb-3 max-w-3xs">
                    {author.bio}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {author.totalPosts} статей
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatNumber(author.totalViews)} просмотров
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => openModal("edit", author)}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-4 rounded-xl font-medium transition-colors"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(author.id.toString())}
                  className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
      </div>

      <AuthorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        author={selectedAuthor}
        onSubmitSuccess={fetchAuthors}
      />
    </div>
  );
}
