import { Plus } from "lucide-react";
import { FC, ElementType } from "react";

type Props = {
  onClick?: () => void;
  text?: string;
  Icon?: ElementType; // любой React-компонент
};

export const BlueButton: FC<Props> = ({ onClick, text, Icon = Plus }) => {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg flex items-center gap-2"
      type="button"
    >
      {Icon && <Icon className="w-5 h-5" />}
      {text ?? "Добавить МФО"}
    </button>
  );
};
