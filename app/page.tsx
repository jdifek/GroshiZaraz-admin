"use client";
import React, { useState, useEffect } from 'react';
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
  Plus
} from "lucide-react";

// Симуляция данных
const mockData = {
  mfos: 47,
  totalNews: 1234,
  totalViews: 45678,
  pendingReviews: 23,
  weeklyViews: [120, 189, 234, 178, 267, 289, 312],
  monthlyStats: {
    newMfos: 8,
    newArticles: 45,
    newReviews: 156,
    totalUsers: 2847
  },
  recentActivity: [
    { type: 'mfo', title: 'Добавлено новое МФО "Быстроденьги"', time: '2 часа назад' },
    { type: 'article', title: 'Опубликована статья "Как выбрать МФО"', time: '4 часа назад' },
    { type: 'review', title: '15 новых отзывов на модерации', time: '6 часов назад' },
    { type: 'user', title: 'Зарегистрировался новый автор', time: '8 часов назад' }
  ]
};

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const formatNumber = (num:  number ) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'mfo': return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'article': return <FileText className="w-4 h-4 text-green-600" />;
      case 'review': return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'user': return <Users className="w-4 h-4 text-orange-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

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
              {selectedPeriod === 'week' ? 'Эта неделя' : 
               selectedPeriod === 'month' ? 'Этот месяц' : 'Этот год'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-10">
              <div className="py-2">
                {[
                  { value: 'week', label: 'Эта неделя' },
                  { value: 'month', label: 'Этот месяц' },
                  { value: 'year', label: 'Этот год' }
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
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform">
              🏦
            </div>
            <span className="text-3xl font-bold text-gray-800">{mockData.mfos}</span>
          </div>
          <h3 className="font-semibold text-gray-700">Всего МФО</h3>
          <p className="text-sm text-gray-500 mb-2">Активных организаций</p>
          <div className="flex items-center gap-1 text-green-600 text-sm">
            <TrendingUp className="w-3 h-3" />
            <span>+{mockData.monthlyStats.newMfos} за месяц</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform">
              📰
            </div>
            <span className="text-3xl font-bold text-gray-800">{formatNumber(mockData.totalNews)}</span>
          </div>
          <h3 className="font-semibold text-gray-700">Статьи</h3>
          <p className="text-sm text-gray-500 mb-2">Опубликованных материалов</p>
          <div className="flex items-center gap-1 text-green-600 text-sm">
            <TrendingUp className="w-3 h-3" />
            <span>+{mockData.monthlyStats.newArticles} за месяц</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform">
              👁️
            </div>
            <span className="text-3xl font-bold text-gray-800">{formatNumber(mockData.totalViews)}</span>
          </div>
          <h3 className="font-semibold text-gray-700">Просмотры</h3>
          <p className="text-sm text-gray-500 mb-2">Всего просмотров</p>
          <div className="flex items-center gap-1 text-blue-600 text-sm">
            <Eye className="w-3 h-3" />
            <span>Средний CTR: 3.2%</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform">
              ⭐
            </div>
            <span className="text-3xl font-bold text-gray-800">{mockData.pendingReviews}</span>
          </div>
          <h3 className="font-semibold text-gray-700">На модерации</h3>
          <p className="text-sm text-gray-500 mb-2">Непроверенных отзывов</p>
          <div className="flex items-center gap-1 text-orange-600 text-sm">
            <AlertCircle className="w-3 h-3" />
            <span>Требует внимания</span>
          </div>
        </div>
      </div>

      {/* График активности и последние действия */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Простой график просмотров */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Активность за неделю</h3>
            <BarChart3 className="w-6 h-6 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {mockData.weeklyViews.map((views, index) => {
              const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
              const maxViews = Math.max(...mockData.weeklyViews);
              const widthPercent = (views / maxViews) * 100;
              
              return (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 w-6">{days[index]}</span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${widthPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 w-12 text-right">{views}</span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Средний показ: {Math.round(mockData.weeklyViews.reduce((a, b) => a + b, 0) / 7)}</span>
              <span className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-3 h-3" />
                +12% к пред. неделе
              </span>
            </div>
          </div>
        </div>

        {/* Последняя активность */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Последняя активность</h3>
            <Activity className="w-6 h-6 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {mockData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="p-2 bg-gray-50 rounded-lg">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 mb-1">{activity.title}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Показать всю активность
            </button>
          </div>
        </div>
      </div>

      {/* Быстрые действия с улучшенным дизайном */}
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Быстрые действия</h2>
            <p className="text-gray-600 text-sm">Основные функции управления системой</p>
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
              <div className="text-xs opacity-80 mt-1">{mockData.pendingReviews} ожидает</div>
            </div>
          </button>
        </div>
      </div>

      {/* Дополнительная статистика */}
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
          <div className="text-2xl font-bold text-gray-800 mb-2">{formatNumber(mockData.monthlyStats.totalUsers)}</div>
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
          <div className="text-2xl font-bold text-gray-800 mb-2">{formatNumber(mockData.monthlyStats.newReviews)}</div>
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