import { Plus } from "lucide-react";
import { ElementType } from "react";

type Props = {
  onClick?: () => void;
  text?: string;
  type?: string;
  Icon?: ElementType;
};
export const GreenButton: React.FC<Props> = ({
  onClick,
  text,
  Icon = Plus,
  type = 'button'
}) => {
  return (
    <button
      onClick={onClick}
      type={type as 'button' | 'submit'}
      className="bg-gradient-to-r cursor-pointer from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg flex items-center gap-2"
    >
      {Icon && <Icon className="w-5 h-5" />}
      {text ? text : " Добавить новость   "}
    </button>
  );
};
