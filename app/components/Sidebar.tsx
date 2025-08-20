"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  FileText,
  MessageSquare,
  Settings,
  BarChart3,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Shield,
  SatelliteDish,
  ChevronLeft,
  UserCheck,
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
    href: "/expert",
    icon: UserCheck, // или другой подходящий икон, например User or Users
    label: "Эксперты",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Настройки",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      case "ADMIN":
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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setIsUserMenuOpen(false);
      setOpenGroups({});
    }
  };

  // Кнопка для разворачивания сайдбара (показывается когда свернут)
  if (isCollapsed) {
    return (
      <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50">
        <button
          onClick={toggleSidebar}
          className="bg-gradient-to-br  cursor-pointer from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-1 rounded-r-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 group"
          style={{ height: "13vh", minHeight: "10px" }}
        >
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </div>
            {/* <div className="text-xs font-medium writing-mode-vertical  text-white/90">
              Меню
            </div> */}
          </div>
        </button>
      </div>
    );
  }

  // Полный сайдбар (когда развернут)
  return (
    <div className="bg-white relative shadow-xl border-r border-gray-100 flex flex-col h-screen w-72">
      {/* Логотип */}
      {/* Кнопка для сворачивания/разворачивания сайдбара */}
      <div
        className="fixed cursor-pointer top-1/2 -translate-y-1/2 left-72 z-50 transition-all duration-300"
        style={{ left: isCollapsed ? "0px" : "288px" }}
      >
        <button
          onClick={toggleSidebar}
          className="bg-gradient-to-br cursor-pointer from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
               text-white p-1 rounded-r-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 group"
          style={{ height: "13vh", minHeight: "10px" }}
        >
          <div className="flex cursor-pointer flex-col items-center justify-center h-full gap-3">
            <div className="w-6 h-6 cursor-pointer bg-white/20 rounded-md flex items-center justify-center group-hover:bg-white/30 transition-colors">
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </div>
          </div>
        </button>
      </div>

      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0 shadow-lg">
            🏦
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-gray-800">MFO Admin</h2>
            <p className="text-sm text-gray-500">Панель управления</p>
          </div>
        </div>
      </div>

      {/* Профиль пользователя */}
      {user && (
        <div className="p-4 border-b  border-gray-100">
          <div className="relative ">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50  cursor-pointer transition-colors"
            >
              <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-md">
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
              <div className="absolute  top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                <div className="py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">
                      ID пользователя
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {user.id}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      router.push("/profile");
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex  cursor-pointer items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Профиль
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex  cursor-pointer items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
                  className="w-full   cursor-pointer flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {isOpen && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((sub) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                            isSubActive
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
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
                className={`w-5 h-5 ${
                  isActive ? "text-white" : "text-gray-500"
                } flex-shrink-0`}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
