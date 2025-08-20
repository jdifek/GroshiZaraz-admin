/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import AuthService from '../services/auth/authService';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Save, 
  X, 
  Lock, 
  Edit, 
  CheckCircle,
  UserCheck,
  Key,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
}

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { user, refreshAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.email) {
      toast.error('Email обязателен');
      return;
    }

    setIsLoading(true);
    try {
      // Здесь будет API вызов для обновления профиля, когда будет готов
      // Например: await AuthService.updateProfile(profileForm);
      toast.success('Профиль успешно обновлён (мок)');
      setIsEditing(false);
      await refreshAuth(); // Обновляем данные пользователя
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка обновления профиля');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Новый пароль и подтверждение не совпадают');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Пароль должен быть не менее 6 символов');
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Пароль успешно изменён');
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangingPassword(false);
      await refreshAuth();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка смены пароля');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'Администратор';
      case 'editor':
        return 'Редактор';
      case 'moderator':
        return 'Модератор';
      default:
        return 'Пользователь';
    }
  };

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'editor':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'moderator':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Профиль пользователя
          </h1>
          <p className="text-gray-600">
            Управление личной информацией и настройками безопасности
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-2 rounded-full text-sm font-medium border ${getRoleBadgeColor()}`}>
            <Shield className="w-4 h-4 inline mr-1" />
            {getRoleLabel()}
          </span>
        </div>
      </div>

      {/* Основная карточка профиля */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100">
        <div className="p-6">
          {/* Заголовок секции */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Основная информация
              </h2>
              <p className="text-sm text-gray-500">
                Управление персональными данными аккаунта
              </p>
            </div>
          </div>

          {!isEditing ? (
            /* Режим просмотра */
            <div className="space-y-6">
              {/* Основные данные в сетке */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Email адрес</span>
                  </div>
                  <p className="text-gray-800 font-semibold">{user?.email || '-'}</p>
                  <p className="text-xs text-blue-600 mt-1">Основной email для входа</p>
                </div>

                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <div className="flex items-center gap-3 mb-2">
                    <UserCheck className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Полное имя</span>
                  </div>
                  <p className="text-gray-800 font-semibold">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.firstName || user?.lastName || 'Не указано'
                    }
                  </p>
                  <p className="text-xs text-green-600 mt-1">Отображаемое имя в системе</p>
                </div>
              </div>

              {/* Дополнительная информация */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">Роль в системе</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getRoleBadgeColor()}`}>
                      {getRoleLabel()}
                    </span>
                  </div>
                  <p className="text-xs text-purple-600 mt-1">Уровень доступа к функциям</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-700">Дата регистрации</span>
                  </div>
                  <p className="text-gray-800 font-semibold">
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Не определена'
                    }
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    {user?.createdAt 
                      ? `${Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} дней в системе`
                      : 'Информация недоступна'
                    }
                  </p>
                </div>
              </div>

              {/* Статус аккаунта */}
              <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-400">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-700">Аккаунт активен</p>
                    <p className="text-xs text-green-600">Все функции доступны для использования</p>
                  </div>
                </div>
              </div>

              {/* Кнопка редактирования */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2 font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Редактировать профиль
                </button>
              </div>
            </div>
          ) : (
            /* Режим редактирования */
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email адрес *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Введите имя"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Фамилия
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Введите фамилию"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2 font-medium"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setProfileForm({
                      firstName: user?.firstName || '',
                      lastName: user?.lastName || '',
                      email: user?.email || '',
                    });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2 font-medium"
                >
                  <X className="w-4 h-4" />
                  Отменить
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Секция безопасности */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100">
        <div className="p-6">
          {/* Заголовок секции */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Безопасность аккаунта
              </h2>
              <p className="text-sm text-gray-500">
                Управление паролем и настройками безопасности
              </p>
            </div>
          </div>

          {!isChangingPassword ? (
            <div className="space-y-4">
              {/* Информация о пароле */}
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-700">Пароль</p>
                    <p className="text-xs text-yellow-600">Последнее изменение: информация недоступна</p>
                  </div>
                  <div className="text-sm font-mono text-yellow-700">••••••••</div>
                </div>
              </div>

              {/* Рекомендации */}
              <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                <div className="flex items-start gap-3">
                  <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-700 mb-1">Рекомендации по безопасности</p>
                    <ul className="text-xs text-blue-600 space-y-1">
                      <li>• Используйте сложный пароль длиной не менее 8 символов</li>
                      <li>• Включите символы разных регистров и цифры</li>
                      <li>• Не используйте один пароль для разных сервисов</li>
                      <li>• Регулярно обновляйте пароль</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsChangingPassword(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2 font-medium"
              >
                <Lock className="w-4 h-4" />
                Изменить пароль
              </button>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Текущий пароль *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Введите текущий пароль"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Новый пароль *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Введите новый пароль"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Подтвердите новый пароль *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Повторите новый пароль"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Индикатор силы пароля */}
              {passwordForm.newPassword && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Сила пароля:</div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => {
                      const strength = passwordForm.newPassword.length >= 8 && 
                                     /[A-Z]/.test(passwordForm.newPassword) && 
                                     /[a-z]/.test(passwordForm.newPassword) && 
                                     /[0-9]/.test(passwordForm.newPassword) ? 4 : 
                                     passwordForm.newPassword.length >= 6 ? 3 : 2;
                      return (
                        <div
                          key={level}
                          className={`h-2 w-full rounded-full ${
                            level <= strength
                              ? strength >= 4
                                ? 'bg-green-500'
                                : strength >= 3
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2 font-medium"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? 'Изменение...' : 'Сохранить пароль'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordForm({
                      oldPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2 font-medium"
                >
                  <X className="w-4 h-4" />
                  Отменить
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}