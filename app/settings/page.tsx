/* eslint-disable @typescript-eslint/no-explicit-any */
// app/settings/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Key, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Shield, 
  Mail, 
  User, 
  Lock, 
  Users,
  Search,
  Eye,
  EyeOff,
  UserCheck,
  Calendar,
  Crown,
  CheckCircle,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { UserProfile } from '../services/auth/authTypes';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import AuthService from '../services/auth/authService';
import { BlueButton } from '../ui/Buttons/BlueButton';
import { GreenButton } from '../ui/Buttons/GreenButton';

// Мок-данные пользователей (заменить на реальные запросы позже)
const mockUsers: UserProfile[] = [
  {
    id: 1,
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 2,
    email: 'editor@example.com',
    firstName: 'Editor',
    lastName: 'User',
    role: 'editor',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01',
  },
  {
    id: 3,
    email: 'moderator@example.com',
    firstName: 'Moderator',
    lastName: 'User',
    role: 'moderator',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
  },
];

interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NewUserForm {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export default function SettingsPage() {
  const { user, refreshAuth } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState<ChangePasswordForm>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'editor',
  });
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingRole, setEditingRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Симулируем загрузку пользователей (позже заменить на API)
  useEffect(() => {
    setUsers(mockUsers);
  }, []);

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

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.email || !newUserForm.password) {
      toast.error('Email и пароль обязательны');
      return;
    }

    const newUser: UserProfile = {
      id: users.length + 1,
      email: newUserForm.email,
      firstName: newUserForm.firstName,
      lastName: newUserForm.lastName,
      role: newUserForm.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUsers([...users, newUser]);
    toast.success('Пользователь создан (мок)');
    setNewUserForm({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'editor',
    });
    setIsCreatingUser(false);
  };

  const handleDeleteUser = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить пользователя?')) {
      setUsers(users.filter((u) => u.id !== id));
      toast.success('Пользователь удалён (мок)');
    }
  };

  const startEditingRole = (user: UserProfile) => {
    setEditingUserId(user.id);
    setEditingRole(user.role);
  };

  const saveRoleChange = (id: number) => {
    setUsers(users.map((u) => u.id === id ? { ...u, role: editingRole } : u));
    setEditingUserId(null);
    toast.success('Роль изменена (мок)');
  };

  const cancelEditing = () => {
    setEditingUserId(null);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Администратор';
      case 'editor': return 'Редактор';
      case 'moderator': return 'Модератор';
      default: return 'Пользователь';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-50 text-red-600 border-red-200';
      case 'editor': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'moderator': return 'bg-purple-50 text-purple-600 border-purple-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Crown;
      case 'editor': return Edit;
      case 'moderator': return Shield;
      default: return User;
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getUserStats = () => {
    const total = users.length;
    const admins = users.filter(u => u.role === 'admin').length;
    const editors = users.filter(u => u.role === 'editor').length;
    const moderators = users.filter(u => u.role === 'moderator').length;
    return { total, admins, editors, moderators };
  };

  const stats = getUserStats();

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Системные настройки
          </h1>
          <p className="text-gray-600">
            Управление безопасностью и пользователями системы
          </p>
        </div>
      </div>

      {/* Секция смены пароля */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <Key className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Безопасность аккаунта
              </h2>
              <p className="text-sm text-gray-500">
                Изменение пароля администратора
              </p>
            </div>
          </div>

          {!isChangingPassword ? (
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-700">Текущий пароль</p>
                    <p className="text-xs text-yellow-600">Рекомендуется менять пароль раз в 3 месяца</p>
                  </div>
                  <div className="ml-auto text-sm font-mono text-yellow-700">••••••••</div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Текущий пароль *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Новый пароль *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Подтвердите пароль *</label>
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

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2 font-medium"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? 'Сохранение...' : 'Сохранить пароль'}
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

      {/* Секция управления пользователями */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100">
        <div className="p-6">
          {/* Заголовок секции */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Управление пользователями
                </h2>
                <p className="text-sm text-gray-500">
                  Всего пользователей: {stats.total}
                </p>
              </div>
            </div>
            <BlueButton
  onClick={() => setIsCreatingUser(true)}
  Icon={UserPlus}
  text="Создать пользователя"
/>

          </div>

          {/* Статистика пользователей */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-700">Всего</p>
                  <p className="text-lg font-bold text-gray-800">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-700">Администраторы</p>
                  <p className="text-lg font-bold text-gray-800">{stats.admins}</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <Edit className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-700">Редакторы</p>
                  <p className="text-lg font-bold text-gray-800">{stats.editors}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-700">Модераторы</p>
                  <p className="text-lg font-bold text-gray-800">{stats.moderators}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Поиск и фильтры */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск по email или имени..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">Все роли</option>
                <option value="admin">Администраторы</option>
                <option value="editor">Редакторы</option>
                <option value="moderator">Модераторы</option>
              </select>
            </div>
          </div>

          {/* Форма создания пользователя */}
          {isCreatingUser && (
            <div className="mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Создание нового пользователя
              </h3>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={newUserForm.email}
                        onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="user@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Пароль *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={newUserForm.password}
                        onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Минимум 6 символов"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={newUserForm.firstName}
                        onChange={(e) => setNewUserForm({ ...newUserForm, firstName: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Введите имя"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Фамилия</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={newUserForm.lastName}
                        onChange={(e) => setNewUserForm({ ...newUserForm, lastName: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Введите фамилию"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Роль *</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="admin">Администратор</option>
                      <option value="editor">Редактор</option>
                      <option value="moderator">Модератор</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4">
                  <GreenButton type='submit' text='Создать пользователя' Icon={Save} />
                  <button
                    type="button"
                    onClick={() => setIsCreatingUser(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2 font-medium"
                  >
                    <X className="w-4 h-4" />
                    Отменить
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Список пользователей в виде карточек */}
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center text-gray-500 text-sm bg-gray-50 border border-gray-100 rounded-xl p-8">
                {searchTerm || roleFilter !== 'all' 
                  ? "Пользователи не найдены по заданным критериям."
                  : "Пользователи не найдены."
                }
              </div>
            ) : (
              filteredUsers.map((u) => {
                const RoleIcon = getRoleIcon(u.role);
                return (
                  <div
                    key={u.id}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                          {(u.firstName?.[0] || u.email[0]).toUpperCase()}
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-800">
                              {u.firstName && u.lastName 
                                ? `${u.firstName} ${u.lastName}` 
                                : u.firstName || u.lastName || 'Без имени'
                              }
                            </h3>
                            {editingUserId === u.id ? (
                              <div className="flex items-center gap-2">
                                <select
                                  value={editingRole}
                                  onChange={(e) => setEditingRole(e.target.value)}
                                  className="border border-gray-300 rounded-lg py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="admin">Администратор</option>
                                  <option value="editor">Редактор</option>
                                  <option value="moderator">Модератор</option>
                                </select>
                                <button
                                  onClick={() => saveRoleChange(u.id)}
                                  className="text-green-600 hover:text-green-700 p-1"
                                  title="Сохранить"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="text-gray-600 hover:text-gray-700 p-1"
                                  title="Отменить"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getRoleBadgeColor(u.role)}`}>
                                <RoleIcon className="w-3 h-3" />
                                {getRoleLabel(u.role)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              <span>{u.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(u.createdAt).toLocaleDateString('ru-RU', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                ID: {u.id}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        {u.id === user?.id && (
                          <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Текущий
                          </div>
                        )}
                        <button
                          onClick={() => startEditingRole(u)}
                          className="w-10 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center transition-colors"
                          title="Изменить роль"
                          disabled={editingUserId !== null}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition-colors"
                          title="Удалить пользователя"
                          disabled={u.id === user?.id} // Нельзя удалить себя
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Дополнительная информация для активного пользователя */}
                    {u.id === user?.id && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-xs text-blue-600">
                          <UserCheck className="w-3 h-3" />
                          <span>Это ваш аккаунт. Вы не можете изменить свою роль или удалить себя.</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Информация о результатах */}
          {filteredUsers.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  Показано {filteredUsers.length} из {users.length} пользователей
                </span>
                {(searchTerm || roleFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setRoleFilter('all');
                    }}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Сбросить фильтры
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}