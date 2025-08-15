"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  FileText,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Shield,
  SatelliteDish,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const menuItems = [
  {
    href: "/",
    icon: BarChart3,
    label: "Панель управления",
  },
  {
    href: "/mfos",
    icon: Building2,
    label: "МФО",
  },
  {
    icon: FileText,
    label: "Контент",
    children: [
      { href: "/news", label: "Новости" },
      { href: "/authors", label: "Авторы" },
      { href: "/categories", label: "Категории новостей" },
    ],
  },
  {
    icon: SatelliteDish,
    label: "Сателлиты",
    children: [
      { href: "/satellite-mfo", label: "Сателлиты МФО" },
      { href: "/satellite-keys-mfo", label: "Ключи Сателлиты МФО" },
    ],
  },
  {
    icon: MessageSquare,
    label: "Отзывы",
    children: [
      { href: "/reviews", label: "Отзывы сайта" },
      { href: "/reviews-mfo", label: "Отзывы МФО" },
    ],
  },
  {
    icon: MessageSquare,
    label: "Вопросы",
    children: [
      { href: "/questions", label: "Вопросы общие" },
      { href: "/questions-mfo", label: "Вопросы сайта" },
    ],
  },
  {
    icon: MessageSquare,
    label: "Ответы",
    children: [
      { href: "/questionAnswers", label: "Ответы" },
      { href: "/questionAnswers-mfo", label: "Ответы МФО" },
    ],
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Настройки",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const handleLogout = () => {
    logout();
    toast.success("Вы успешно вышли из системы");
  };

  const formatUserName = () => {
    if (user?.firstName) {
      return `${user.firstName} ${user.lastName || ""}`.trim();
    }
    return user?.email || "Пользователь";
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case "admin":
        return "Администратор";
      case "editor":
        return "Редактор";
      case "moderator":
        return "Модератор";
      default:
        return "Пользователь";
    }
  };

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <div className="w-72 bg-white shadow-xl border-r border-gray-100 flex flex-col h-screen">
      {/* Логотип */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
            🏦
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">MFO Admin</h1>
            <p className="text-xs text-gray-500">Панель управления</p>
          </div>
        </div>
      </div>

      {/* Профиль пользователя */}
      {user && (
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {formatUserName().charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {formatUserName()}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {getRoleLabel()}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isUserMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isUserMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">ID пользователя</p>
                    <p className="text-sm font-medium text-gray-800">
                      {user.id}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Профиль
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Выйти
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Навигационное меню */}
      <nav className="flex-1 p-4 space-y-2 scrollbar-none overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.children) {
            const isOpen = openGroups[item.label] || false;
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {isOpen && (
                  <div className="ml-10 space-y-1">
                    {item.children.map((sub) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`block px-3 py-2 rounded-md text-sm ${
                            isSubActive
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

     
    </div>
  );
}
