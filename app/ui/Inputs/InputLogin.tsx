"use client";

import React, { InputHTMLAttributes, ReactNode } from "react";

interface InputLoginProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

const InputLogin: React.FC<InputLoginProps> = ({ icon, className = "", ...props }) => {
  return (
    <div className="relative w-full group">
      {icon && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 group-hover:text-white transition-colors">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-4 !text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all ${className}`}
      />
    </div>
  );
};

export default InputLogin;
