// app/components/ProtectedRoute.tsx
"use client";
import React from 'react';
import { useAuth } from '../context/AuthContext';
import LoginForm from './Form/LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Показываем индикатор загрузки во время проверки аутентификации
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  // Если пользователь не авторизован, показываем форму входа
  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={() => window.location.reload()} />;
  }

  // Если пользователь авторизован, показываем защищённый контент
  return <>{children}</>;
}