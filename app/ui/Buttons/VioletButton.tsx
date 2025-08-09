
import { Plus } from "lucide-react";

type Props = {
  onClick?: () => void;
};
export const VioletButton: React.FC<Props> = ({onClick}) => {
  return (
    <button
      onClick={onClick}  
      className="bg-gradient-to-r cursor-pointer from-purple-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg flex items-center gap-2"
      >
      <Plus className="w-5 h-5" />
      Добавить автора
    </button>
  );
};
