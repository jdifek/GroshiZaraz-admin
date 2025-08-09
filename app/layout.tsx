// app/layout.tsx
import { ToastContainer } from "react-toastify";
import Sidebar from "./components/Sidebar";
import { DataProvider } from "./context/DataContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <body className="overflow-hidden"> {/* <== запрещаем глобальный скролл */}
      <DataProvider>
        <div className=" bg-gray-50 flex h-screen overflow-hidden">
          {/* Sidebar — прокручиваемая колонка */}
          <div className="h-full overflow-y-auto scrollbar-none">
          <Sidebar />
          </div>
  
          {/* Main content — правая часть */}
            <div className="flex-1 min-h-screen overflow-y-auto p-8 scrollbar-none">
            <ToastContainer position="top-right" autoClose={3000} />
            {children}
          </div>
  
        </div>
      </DataProvider>
    </body>
  </html>
  
  );
}
