// components/WhiteButton.tsx
"use client";

import React, { ReactNode } from "react";
import { LogIn } from "lucide-react";

interface WhiteButtonProps {
  isLoading?: boolean;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
}

const WhiteButton: React.FC<WhiteButtonProps> = ({
  isLoading = false,
  children,
  type = "button",
  onClick,
  className = "",
}) => {
  return (
    <button
      type={type}
      disabled={isLoading}
      onClick={onClick}
      className={`w-full cursor-pointer bg-white text-blue-600 font-semibold py-4 px-6 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <LogIn className="w-5 h-5" />
      )}
      <span>{isLoading ? 'Вход...' : children}</span>
    </button>
  );
};

export default WhiteButton;
