// components/DashedButton.tsx
import React from "react";

type DashedButtonProps = {
  onClick: () => void;
  text?: string;
};

const DashedButton: React.FC<DashedButtonProps> = ({
  onClick,
  text = "+ Добавить первый ответ на вопрос",
}) => {
  return (
    <div className="mt-4">
      <button
        onClick={onClick}
        className="w-full cursor-pointer p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors"
      >
        {text}
      </button>
    </div>
  );
};

export default DashedButton;
