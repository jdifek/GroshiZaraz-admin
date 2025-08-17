"use client";

import { Trash2 } from "lucide-react";

type DeleteButtonProps = {
  onClick: () => void;
  title?: string;
  disabled?: boolean; // опциональный
};

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  title = "Удалить",
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors
        ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"}`}
      title={title}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
};
