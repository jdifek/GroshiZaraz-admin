import { Trash2 } from "lucide-react";

type Props = {
  id: number;
  handleClick: (id: number) => void;
};

export const TrashButton: React.FC<Props> = ({ id, handleClick }) => {
  return (
    <button
      onClick={() => handleClick(id)}
      className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition-colors"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
};
