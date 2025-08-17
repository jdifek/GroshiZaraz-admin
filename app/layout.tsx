// app/layout.tsx
"use client";
import React, { createContext, useContext, useState } from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "./components/Sidebar";
import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

// Создаем контекст для состояния сайдбара
const SidebarContext = createContext<{
  isCollapsed: boolean;
  toggleSidebar: () => void;
}>({
  isCollapsed: false,
  toggleSidebar: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <html lang="en">
      <body className="overflow-hidden">
        <AuthProvider>
          <ProtectedRoute>
            <DataProvider>
              <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
                <div className="bg-gray-50 flex h-screen overflow-hidden">
                  {/* Sidebar — показывается только когда развернут */}
                  <div className={`h-full overflow-y-auto scrollbar-none transition-all duration-300 ${
                    isCollapsed ? 'w-0' : 'w-auto'
                  }`}>
                    <Sidebar />
                  </div>
                  
          
                  {/* Main content — правая часть */}
                  <div className={`flex-1 min-h-screen overflow-y-auto scrollbar-none transition-all duration-300 ${
                    isCollapsed ? 'p-8' : 'p-8'
                  }`}>
                    <ToastContainer 
                      position="top-right" 
                      autoClose={3000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      className="z-50"
                    />
                    {children}
                  </div>
                </div>
              </SidebarContext.Provider>
            </DataProvider>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}