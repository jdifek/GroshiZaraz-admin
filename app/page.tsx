"use client";
import { useContext } from "react";
import { Building2, FileText, MessageSquare, Users } from "lucide-react";
import { DataContext } from "./context/DataContext";
import { formatNumber } from "./utils/format";

export default function DashboardPage() {
  const { setActiveSection } = useContext(DataContext);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Панель управления
        </h1>
        <p className="text-gray-600">Обзор системы и ключевые показатели</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl">
              🏦
            </div>
            <span className="text-3xl font-bold text-gray-800">1000</span>
          </div>
          <h3 className="font-semibold text-gray-700">Всего МФО</h3>
          <p className="text-sm text-gray-500">Активных организаций</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-xl">
              📰
            </div>
            <span className="text-3xl font-bold text-gray-800">1000</span>
          </div>
          <h3 className="font-semibold text-gray-700">Статьи</h3>
          <p className="text-sm text-gray-500">Опубликованных материалов</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
              👁️
            </div>
            <span className="text-3xl font-bold text-gray-800">
              {formatNumber(1000)}
            </span>
          </div>
          <h3 className="font-semibold text-gray-700">Просмотры</h3>
          <p className="text-sm text-gray-500">Всего просмотров</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white text-xl">
              ⭐
            </div>
            <span className="text-3xl font-bold text-gray-800">1000</span>
          </div>
          <h3 className="font-semibold text-gray-700">На модерации</h3>
          <p className="text-sm text-gray-500">Непроверенных отзывов</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Быстрые действия
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveSection("mfos")}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Building2 className="w-6 h-6 mb-2 mx-auto" />
            Добавить МФО
          </button>
          <button
            onClick={() => setActiveSection("news")}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FileText className="w-6 h-6 mb-2 mx-auto" />
            Создать статью
          </button>
          <button
            onClick={() => setActiveSection("authors")}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Users className="w-6 h-6 mb-2 mx-auto" />
            Добавить автора
          </button>
          <button
            onClick={() => setActiveSection("reviews")}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-4 px-6 rounded-xl font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <MessageSquare className="w-6 h-6 mb-2 mx-auto" />
            Модерация
          </button>
        </div>
      </div>
    </div>
  );
}
