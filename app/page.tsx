"use client";
import React, { useState, useEffect } from "react";
import {
  Building2,
  FileText,
  MessageSquare,
  Users,
  TrendingUp,
  Eye,
  Calendar,
  ChevronDown,
  BarChart3,
  Activity,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  Plus,
  ChevronRight,
} from "lucide-react";

interface RecentActivity {
  type: string;
  title: string;
  time: string | Date;
}

interface DashboardData {
  mfos: number;
  totalNews: number;
  totalViews: number;
  pendingReviews: number;
  reviewsPending?: number;
  weeklyViews: number[];
  monthlyStats: {
    newMfos: number;
    newArticles: number;
    newReviews: number;
    totalUsers: number;
  };
  recentActivity: RecentActivity[];
}

// Компонент страницы всех активностей
function AllActivitiesPage({
  activities,
  onBack,
}: {
  activities: RecentActivity[];
  onBack: () => void;
}) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "mfo":
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case "article":
        return <FileText className="w-4 h-4 text-green-600" />;
      case "review":
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case "user":
        return <Users className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок с кнопкой назад */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="flex items-center  cursor-pointer gap-2 text-blue-600 hover:text-blue-500 mb-4 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span className="text-sm  font-medium">Назад к дашборду</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Вся активность
          </h1>
          <p className="text-gray-600">
            Полный список последних событий в системе
          </p>
        </div>
      </div>

      {/* Список всех активностей */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            История активности
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Все события за последние 30 дней
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="p-3 bg-gray-50 rounded-xl">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-gray-800 mb-2">
                  {activity.title}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(activity.time).toLocaleString("ru-RU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {activity.type === "mfo"
                  ? "МФО"
                  : activity.type === "article"
                  ? "Статья"
                  : activity.type === "review"
                  ? "Отзыв"
                  : activity.type === "user"
                  ? "Пользователь"
                  : "Другое"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAllActivities, setShowAllActivities] = useState(false);

  // Создаем расширенные данные активности для демонстрации
  const allActivities: RecentActivity[] = [
    {
      type: "mfo",
      title: 'Добавлено новое МФО "Быстрые займы 24"',
      time: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      type: "review",
      title: 'Новый отзыв на МФО "Займер"',
      time: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
      type: "article",
      title: 'Опубликована статья "Как выбрать МФО"',
      time: new Date(Date.now() - 1000 * 60 * 120),
    },
    {
      type: "user",
      title: "Зарегистрирован новый пользователь",
      time: new Date(Date.now() - 1000 * 60 * 180),
    },
    {
      type: "mfo",
      title: 'Обновлена информация МФО "Веббанкир"',
      time: new Date(Date.now() - 1000 * 60 * 240),
    },
    {
      type: "review",
      title: "Одобрен отзыв пользователя Анна К.",
      time: new Date(Date.now() - 1000 * 60 * 300),
    },
    {
      type: "article",
      title: 'Создана статья "Микрокредиты: плюсы и минусы"',
      time: new Date(Date.now() - 1000 * 60 * 360),
    },
    {
      type: "user",
      title: "Активирован аккаунт администратора",
      time: new Date(Date.now() - 1000 * 60 * 420),
    },
    {
      type: "mfo",
      title: 'Добавлено МФО "Срочные деньги"',
      time: new Date(Date.now() - 1000 * 60 * 480),
    },
    {
      type: "review",
      title: "Отклонен спам-отзыв",
      time: new Date(Date.now() - 1000 * 60 * 540),
    },
    {
      type: "article",
      title: 'Обновлена статья "Рейтинг МФО 2024"',
      time: new Date(Date.now() - 1000 * 60 * 600),
    },
    {
      type: "user",
      title: "Заблокирован пользователь за нарушения",
      time: new Date(Date.now() - 1000 * 60 * 660),
    },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/dashboard");
        const json = await res.json();
        // Добавляем расширенные данные активности если их нет в API
        const dataWithExtendedActivity = {
          ...json,
        };
        setRecentActivity(json.recentActivity);
        setData(dataWithExtendedActivity);
      } catch (err) {
        console.error("Ошибка при загрузке дашборда:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("ru-RU").format(num);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "mfo":
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case "article":
        return <FileText className="w-4 h-4 text-green-600" />;
      case "review":
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case "user":
        return <Users className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading || !data) {
    return (
      <div className="text-center text-gray-500 mt-8">Загрузка данных...</div>
    );
  }

  // Если показываем все активности, отображаем отдельную страницу
  if (showAllActivities) {
    return (
      <AllActivitiesPage
        activities={recentActivity}
        onBack={() => setShowAllActivities(false)}
      />
    );
  }

  const maxWeekly = Math.max(...data.weeklyViews);

  return (
    <div className="space-y-8">
      {/* Заголовок с выпадающим меню периода */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Панель управления
          </h1>
          <p className="text-gray-600">Обзор системы и ключевые показатели</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {selectedPeriod === "week"
                ? "Эта неделя"
                : selectedPeriod === "month"
                ? "Этот месяц"
                : "Этот год"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-10">
              <div className="py-2">
                {[
                  { value: "week", label: "Эта неделя" },
                  { value: "month", label: "Этот месяц" },
                  { value: "year", label: "Этот год" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedPeriod(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Всего МФО */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform">
              🏦
            </div>
            <span className="text-3xl font-bold text-gray-800">
              {data.mfos}
            </span>
          </div>
          <h3 className="font-semibold text-gray-700">Всего МФО</h3>
          <p className="text-sm text-gray-500 mb-2">Активных организаций</p>
          <div className="flex items-center gap-1 text-green-600 text-sm">
            <TrendingUp className="w-3 h-3" />
            <span>+{data.monthlyStats.newMfos} за месяц</span>
          </div>
        </div>

        {/* Статьи */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform">
              📰
            </div>
            <span className="text-3xl font-bold text-gray-800">
              {formatNumber(data.totalNews)}
            </span>
          </div>
          <h3 className="font-semibold text-gray-700">Статьи</h3>
          <p className="text-sm text-gray-500 mb-2">
            Опубликованных материалов
          </p>
          <div className="flex items-center gap-1 text-green-600 text-sm">
            <TrendingUp className="w-3 h-3" />
            <span>+{data.monthlyStats.newArticles} за месяц</span>
          </div>
        </div>

        {/* Просмотры */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform">
              👁️
            </div>
            <span className="text-3xl font-bold text-gray-800">
              {formatNumber(data.totalViews)}
            </span>
          </div>
          <h3 className="font-semibold text-gray-700">Просмотры</h3>
          <p className="text-sm text-gray-500 mb-2">Всего просмотров</p>
          <div className="flex items-center gap-1 text-blue-600 text-sm">
            <Eye className="w-3 h-3" />
            <span>Средний CTR: 3.2%</span>
          </div>
        </div>

        {/* На модерации */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform">
              ⭐
            </div>
            <span className="text-3xl font-bold text-gray-800">
              {data.pendingReviews}
            </span>
          </div>
          <h3 className="font-semibold text-gray-700">На модерации</h3>
          <p className="text-sm text-gray-500 mb-2">Непроверенных отзывов</p>
          <div className="flex items-center gap-1 text-orange-600 text-sm">
            <AlertCircle className="w-3 h-3" />
            <span>Требует внимания</span>
          </div>
        </div>
      </div>

      {/* График активности и Последняя активность */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Активность за неделю
            </h3>
            <BarChart3 className="w-6 h-6 text-gray-400" />
          </div>
          <div className="space-y-4">
            {data.weeklyViews.map((views, index) => {
              const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
              const widthPercent = (views / maxWeekly) * 100;
              return (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 w-6">
                    {days[index]}
                  </span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${widthPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 w-12 text-right">
                    {views}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Средний показ:{" "}
                {Math.round(data.weeklyViews.reduce((a, b) => a + b, 0) / 7)}
              </span>
              <span className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-3 h-3" />
                +12% к пред. неделе
              </span>
            </div>
          </div>
        </div>

        {/* Последняя активность с кнопкой "Показать все" */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Последняя активность
            </h3>
            <Activity className="w-6 h-6 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity && recentActivity.slice(0, 4).map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="p-2 bg-gray-50 rounded-lg">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(activity.time).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Кнопка "Показать все" */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowAllActivities(true)}
              className="w-full flex cursor-pointer items-center justify-center gap-2 py-2 px-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              <span>Показать все активности</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Быстрые действия - теперь правильно интегрированы */}
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Быстрые действия
            </h2>
            <p className="text-gray-600 text-sm">
              Основные функции управления системой
            </p>
          </div>
          <Plus className="w-6 h-6 text-gray-400" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl group">
            <Building2 className="w-8 h-8 mb-3 mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <div className="font-semibold">Добавить МФО</div>
              <div className="text-xs opacity-80 mt-1">Новая организация</div>
            </div>
          </button>

          <button className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl font-medium hover:from-green-600 hover:to-green-700 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl group">
            <FileText className="w-8 h-8 mb-3 mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <div className="font-semibold">Создать статью</div>
              <div className="text-xs opacity-80 mt-1">Новый материал</div>
            </div>
          </button>

          <button className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl group">
            <Users className="w-8 h-8 mb-3 mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <div className="font-semibold">Добавить автора</div>
              <div className="text-xs opacity-80 mt-1">Новый пользователь</div>
            </div>
          </button>

          <button className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-xl font-medium hover:from-yellow-600 hover:to-yellow-700 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl group">
            <MessageSquare className="w-8 h-8 mb-3 mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <div className="font-semibold">Модерация</div>
              <div className="text-xs opacity-80 mt-1">
                {data.reviewsPending || data.pendingReviews} ожидает
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Дополнительные статистические карточки */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Пользователи</h4>
              <p className="text-sm text-gray-600">Всего зарегистрировано</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {formatNumber(data.monthlyStats.totalUsers)}
          </div>
          <div className="flex items-center gap-1 text-indigo-600 text-sm">
            <TrendingUp className="w-3 h-3" />
            <span>+147 за месяц</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Одобрено</h4>
              <p className="text-sm text-gray-600">Отзывов за месяц</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {formatNumber(data.monthlyStats.newReviews)}
          </div>
          <div className="flex items-center gap-1 text-green-600 text-sm">
            <Star className="w-3 h-3" />
            <span>Рейтинг 4.2/5</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Требует внимания</h4>
              <p className="text-sm text-gray-600">Важные уведомления</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-2">3</div>
          <div className="flex items-center gap-1 text-orange-600 text-sm">
            <Clock className="w-3 h-3" />
            <span>2 критичных</span>
          </div>
        </div>
      </div>
    </div>
  );
}
