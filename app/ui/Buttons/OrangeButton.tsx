
import { Plus } from "lucide-react";

type Props = {
  onClick?: () => void;
};
export const OrangeButton: React.FC<Props> = ({onClick}) => {
  return (
    <button
      onClick={onClick}  
      className="bg-gradient-to-r cursor-pointer from-yellow-500 to-yellow-600 text-white py-3 px-6 rounded-xl font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg flex items-center gap-2"
      >
      <Plus className="w-5 h-5" />
      Добавить категорию
    </button>
  );
};
