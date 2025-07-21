"use client";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Building2,
  FileText,
  Users,
  Tag,
  MessageSquare,
  Star,
} from "lucide-react";
import { DataContext } from "../context/DataContext";

const sidebarItems = [
  { id: "dashboard", name: "Дашборд", icon: TrendingUp, path: "/" },
  { id: "mfos", name: "МФО", icon: Building2, path: "/mfos" },
  { id: "news", name: "Новости", icon: FileText, path: "/news" },
  { id: "authors", name: "Авторы", icon: Users, path: "/authors" },
  { id: "categories", name: "Категории", icon: Tag, path: "/categories" },
  { id: "reviews", name: "Отзывы", icon: MessageSquare, path: "/reviews" },
  { id: "questions", name: "Вопросы", icon: MessageSquare, path: "/questions" },
  {
    id: "questionAnswers",
    name: "Ответы",
    icon: MessageSquare,
    path: "/questionAnswers",
  },
  { id: "licenses", name: "Лицензии", icon: FileText, path: "/licenses" },
  { id: "tags", name: "Теги", icon: Tag, path: "/tags" },
  { id: "newsLikes", name: "Лайки", icon: Star, path: "/newsLikes" },
];

export default function Sidebar() {
  const { activeSection, setActiveSection } = useContext(DataContext);
  const router = useRouter();

  const handleNavigation = (id: string, path: string) => {
    setActiveSection(id);
    router.push(path);
  };

  return (
    <div className="w-64 bg-white shadow-md border-r border-gray-200">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Админ-панель</h2>
      </div>
      <nav className="mt-4">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id, item.path)}
            className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium ${
              activeSection === item.id
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50"
            } transition-colors`}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </button>
        ))}
      </nav>
    </div>
  );
}
