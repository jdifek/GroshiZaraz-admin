"use client";
import { useState, useEffect } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import CategoryModal from "../components/CategoryModal";
import { Category } from "../services/categories/categoriesTypes";
import CategoryService from "../services/categories/categoriesService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Загрузка категорий из API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getAllCategories()
        setCategories(response);
        setLoading(false);
      } catch (error) {
        toast.error("Ошибка при загрузке категорий");
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Обработка удаления категории
  const handleDelete = async (id: number) => {
  
    try {
      await CategoryService.deleteCategory(id);
      setCategories(categories.filter((category) => category.id !== id));
      toast.success("Категория успешно удалена");
    } catch (error) {
      toast.error("Ошибка при удалении категории");
      console.error("Delete category error:", error);
    }
  };

  // Открытие модального окна
  const openModal = (
    mode: "create" | "edit",
    category: Category | null = null
  ) => {
    setModalMode(mode);
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  // Сохранение категории (вызывается из модального окна)
  const handleSave = async (data: {
    name: string;
    icon?: string;
    nameUk: string;
  }) => {
    try {
      if (modalMode === "create") {
        const response = await CategoryService.createCategory(data);
        setCategories([...categories, response]);
        toast.success("Категория успешно создана");
      } else if (modalMode === "edit" && selectedCategory) {
        const response = await CategoryService.updateCategory(selectedCategory.id, data);
        setCategories(categories.map((cat) => (cat.id === response.id ? response : cat)));
        toast.success("Категория успешно обновлена");
      }
  
      setIsModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Save category error:", error);
      toast.error("Ошибка при сохранении категории");
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Категории новостей
          </h1>
          <p className="text-gray-600">Управление категориями для статей</p>
        </div>
        <button
          onClick={() => openModal("create")}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 px-6 rounded-xl font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Добавить категорию
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск категорий..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories
          .filter((category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl">
                  {category.icon || "📂"}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {category.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal("edit", category)}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-4 rounded-xl font-medium transition-colors"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        onSave={handleSave}
        mode={modalMode}
        category={selectedCategory}
      />
    </div>
  );
}
