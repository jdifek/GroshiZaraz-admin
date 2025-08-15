"use client";

import React, { useState, InputHTMLAttributes, ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputLoginProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

const PasswordInputLogin: React.FC<PasswordInputLoginProps> = ({ icon, className = "", ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full group">
      {icon && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 group-hover:text-white transition-colors">
          {icon}
        </div>
      )}
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        className={`w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-12 !text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all ${className}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
      >
        {showPassword ? <EyeOff className="w-5 h-5  cursor-pointer" /> : <Eye className="w-5 h-5  cursor-pointer" />}
      </button>
    </div>
  );
};

export default PasswordInputLogin;
