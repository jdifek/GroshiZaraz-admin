/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditButton } from "@/app/ui/Buttons/EditButton";
import {
  Mail,
  Calendar,
  CheckCircle,
  UserCheck,
  Save,
  X,
  LucideIcon,
  Trash2,
} from "lucide-react";

type UserCardProps = {
  user: any;
  currentUserId?: number;
  editingUserId: number | null;
  editingRole: string;
  getRoleIcon: (role: string) => LucideIcon;
  getRoleBadgeColor: (role: string) => string;
  getRoleLabel: (role: string) => string;
  startEditingRole: (user: any) => void;
  setEditingRole: (role: string) => void;
  saveRoleChange: (id: number) => void;
  cancelEditing: () => void;
  handleDeleteUser: (id: number) => void;
};

export const UserCard: React.FC<UserCardProps> = ({
  user,
  currentUserId,
  editingUserId,
  editingRole,
  getRoleIcon,
  getRoleBadgeColor,
  getRoleLabel,
  startEditingRole,
  setEditingRole,
  saveRoleChange,
  cancelEditing,
  handleDeleteUser,
}) => {
  const RoleIcon = getRoleIcon(user.role);

  return (
    <div
      className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
            {(user.firstName?.[0] || user.email[0]).toUpperCase()}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-semibold text-gray-800">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.firstName || user.lastName || "Без имени"}
              </h3>

              {editingUserId === user.id ? (
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
                    onClick={() => saveRoleChange(user.id)}
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
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getRoleBadgeColor(
                    user.role
                  )}`}
                >
                  <RoleIcon className="w-3 h-3" />
                  {getRoleLabel(user.role)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(user.createdAt).toLocaleDateString("ru-RU", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  ID: {user.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          {user.id === currentUserId && (
            <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" />
              Текущий
            </div>
          )}
          <EditButton
            onClick={() => startEditingRole(user)}
            title="Изменить роль"
            disabled={editingUserId !== null}
          />
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition-colors"
            title="Удалить пользователя"
            disabled={user.id === currentUserId} // Нельзя удалить себя
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Дополнительная информация для активного пользователя */}
      {user.id === currentUserId && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <UserCheck className="w-3 h-3" />
            <span>
              Это ваш аккаунт. Вы не можете изменить свою роль или удалить себя.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
