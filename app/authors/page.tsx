/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import AuthorModal from "../components/AuthorModal";
import AuthorsService from "../services/authors/authorsService";
import { Author } from "../services/authors/authorsTypes";
import { toast } from "react-toastify";
import { VioletButton } from "../ui/Buttons/VioletButton";
import { AuthorCard } from "../components/Cards/AuthorCard";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const data = await AuthorsService.getAllAuthors();
      setAuthors(data);
    } catch (error) {
      console.error("Ошибка при загрузке авторов:", error);
      toast.error("Ошибка при загрузке авторов");
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить автора?")) return;
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

  const toggleCardExpansion = (authorId: number) => {
    setExpandedCardId(expandedCardId === authorId ? null : authorId);
  };

  const filteredAuthors = authors.filter(
    (author) =>
      author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.nameUk?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.expertise?.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопка */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Управление авторами
          </h1>
          <p className="text-gray-600">
            Добавление и редактирование авторов ({authors.length})
          </p>
        </div>
        <VioletButton
          text="Добавить автора"
          onClick={() => openModal("create")}
        />
      </div>

      {/* Поиск */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск авторов, должностей, экспертизы..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Список авторов */}
      <div className="grid gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 animate-pulse space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="text-center text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl p-4">
            Произошла ошибка при загрузке авторов. Попробуйте позже.
          </div>
        ) : filteredAuthors.length === 0 ? (
          <div className="text-center text-gray-500 text-sm bg-gray-50 border border-gray-100 rounded-xl p-4">
            {searchTerm
              ? "Авторы не найдены по вашему запросу."
              : "Авторы не найдены."}
          </div>
        ) : (
          filteredAuthors.map((author) => {
            const isExpanded = expandedCardId === author.id;

            return <AuthorCard isExpanded={isExpanded} openModal={openModal} toggleCardExpansion={toggleCardExpansion} key={author.id} author={author} handleDelete={handleDelete} />;
          })
        )}
      </div>

      {/* Модалка */}
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
