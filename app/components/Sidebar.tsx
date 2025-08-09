"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  TrendingUp,
  Building2,
  FileText,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  SatelliteDish,
} from "lucide-react";

const sidebarItems = [
  { id: "dashboard", name: "Дашборд", icon: TrendingUp, path: "/" },
  { id: "mfos", name: "МФО(укр доб)", icon: Building2, path: "/mfos" },
  {
    id: "contentGroup",
    name: "Контент",
    icon: FileText,
    children: [
      { id: "news", name: "Новости", path: "/news" },
      { id: "authors", name: "Авторы", path: "/authors" },
      { id: "categories", name: "Категории новостей", path: "/categories" },
    ],
  },
  {
    id: "SatelliteMfo",
    name: "Сателлиты",
    icon: SatelliteDish,
    children: [
      { id: "questions", name: "Сателлиты МФО", path: "/satellite-mfo" },
      { id: "questions-mfo", name: "Ключи Сателлиты МФО", path: "/satellite-keys-mfo" },
    ],
  },
  {
    id: "reviewsGroup",
    name: "Отзывы",
    icon: MessageSquare,
    children: [
      { id: "reviews", name: "Отзывы сайта", path: "/reviews" },
      { id: "reviews-mfo", name: "Отзывы МФО", path: "/reviews-mfo" },
    ],
  },
  {
    id: "questionsGroup",
    name: "Вопросы",
    icon: MessageSquare,
    children: [
      { id: "questions", name: "Вопросы", path: "/questions" },
      { id: "questions-mfo", name: "Вопросы МФО", path: "/questions-mfo" },
    ],
  },
 
 
  {
    id: "answersGroup",
    name: "Ответы",
    icon: MessageSquare,
    children: [
      { id: "questionAnswers", name: "Ответы", path: "/questionAnswers" },
      { id: "questionAnswers-mfo", name: "Ответы МФО", path: "/questionAnswers-mfo" },
    ],
  },

];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-64 bg-white shadow-md border-r border-gray-200 h-screen scrollbar-none overflow-y-auto">
       <div  className="flex items-center space-x-2 p-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-yellow-400 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              GZ
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1A4D8F] hover:text-[#00AEEF] transition-colors">
              Groshi<span className="text-[#00AEEF]">Zaraz</span>
            </span>
          </div>
      <nav className="mt-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.path;

          if ("children" in item) {
            const isOpen = openGroups[item.id] || false;
            return (
              <div key={item.id}>
                <button
                  onClick={() => toggleGroup(item.id)}
                  className="cursor-pointer w-full flex items-center justify-between px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex cursor-pointer  items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </div>
                  {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {isOpen && (
                  <div className="ml-10 space-y-1">
                    {item.children?.map((sub) => {
                      const isSubActive = pathname === sub.path;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleNavigation(sub.path)}
                          className={`w-full cursor-pointer text-left text-sm px-4 py-2 rounded-md ${
                            isSubActive
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {sub.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`cursor-pointer w-full flex items-center gap-3 px-6 py-3 text-sm font-medium ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              } transition-colors`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
}