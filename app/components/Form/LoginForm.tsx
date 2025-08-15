/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { toast } from "react-toastify";
import AuthService from "@/app/services/auth/authService";
import WhiteButton from "@/app/ui/Buttons/WhiteButton";
import PasswordInputLogin from "@/app/ui/Inputs/PasswordInputLogin";
import InputLogin from "@/app/ui/Inputs/InputLogin";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Пожалуйста, заполните все поля");
      return;
    }

    setIsLoading(true);
    try {
      const response = await AuthService.login({ email, password });
      localStorage.setItem("authToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      toast.success("Успешный вход в систему");
      onLoginSuccess();
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Ошибка входа";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Логотип и заголовок */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-3xl">🏦</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Админ-панель</h1>
          <p className="text-blue-100">Управление МФО системой</p>
        </div>

        {/* Форма входа */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Email</label>
              <InputLogin
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                icon={<Mail className="w-5 h-5" />}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Пароль</label>
              <PasswordInputLogin
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock className="w-5 h-5" />}
                disabled={isLoading}
              />
            </div>

            <WhiteButton isLoading={isLoading} type="submit">
              Войти в систему
            </WhiteButton>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/60 text-sm text-center">
              Система управления микрофинансовыми организациями
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-white/40 text-sm">© 2025 MFO Admin Panel. Все права защищены.</p>
        </div>
      </div>
    </div>
  );
}
