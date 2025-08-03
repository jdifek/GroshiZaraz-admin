"use client";
import { useContext } from "react";
import { Building2, FileText, MessageSquare, Users } from "lucide-react";
import { DataContext } from "./context/DataContext";
import { formatNumber } from "./utils/format";
import { useEffect, useState } from "react";
import { Mfo } from "./services/mfos/mfoTypes";
import MfoService from "./services/mfos/mfosService";
import { toast } from "react-toastify";
import NewsService from "./services/news/newsService";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { setActiveSection } = useContext(DataContext);
  const router = useRouter()
  const [mfos, setMfos] = useState<Mfo[]>([]);
  const [totalViews, setTotalViews] = useState<number | null>(null);
  const [totalNews, setTotalNews] = useState<number | null>(null);  const [error, setError] = useState(false);
  const fetchMfos = async () => {
    setError(false);
    try {
      const data = await MfoService.getAllMfos();
      setMfos(data);
    } catch {
      toast.error("Ошибка при загрузке МФО");
      setError(true);
    } finally {
    }
  };
  const fetchViews = async () => {
    try {
      const result = await NewsService.getNewsStatistic();

      setTotalViews(result.totalViews.totalViews);
      setTotalNews(result.totalViews.totalNews);
        } catch {
      toast.error("Ошибка при загрузке количества просмотров");
    }
  };


  useEffect(() => {
    fetchMfos();   
    fetchViews();
  }, []);
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
            <span className="text-3xl font-bold text-gray-800">{mfos.length}</span>
          </div>
          <h3 className="font-semibold text-gray-700">Всего МФО</h3>
          <p className="text-sm text-gray-500">Активных организаций</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-xl">
              📰
            </div>
            <span className="text-3xl font-bold text-gray-800">  {totalNews !== null ? formatNumber(totalNews) : "–"}
            </span>
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
            {totalViews !== null ? formatNumber(totalViews) : "–"}
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
            onClick={() => router.push("/mfos")}
            className="bg-gradient-to-r cursor-pointer hover:scale-105 from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Building2 className="w-6 h-6 mb-2 mx-auto" />
            Добавить МФО
          </button>
          <button
            onClick={() =>  router.push("/news")}
            className="bg-gradient-to-r cursor-pointer hover:scale-105 from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FileText className="w-6 h-6 mb-2 mx-auto" />
            Создать статью
          </button>
          <button
            onClick={() =>  router.push("/authors")}
            className="bg-gradient-to-r cursor-pointer hover:scale-105 from-purple-500 to-purple-600 text-white py-4 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Users className="w-6 h-6 mb-2 mx-auto" />
            Добавить автора
          </button>
          <button
            onClick={() => router.push("/reviews")}
            className="bg-gradient-to-r cursor-pointer hover:scale-105 from-yellow-500 to-yellow-600 text-white py-4 px-6 rounded-xl font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <MessageSquare className="w-6 h-6 mb-2 mx-auto" />
            Модерация
          </button>
        </div>
      </div>
    </div>
  );
}
