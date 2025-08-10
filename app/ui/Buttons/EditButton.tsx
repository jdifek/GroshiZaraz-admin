import { Edit2 } from "lucide-react";

type Props<T> = {
  item: T;
  handleClick: (item: T) => void;
};

export function EditButton<T>({ item, handleClick }: Props<T>) {
  return (
    <button
      type="button"
      onClick={() => handleClick(item)}
      className="w-10 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center transition-colors"
      aria-label="Редактировать"
    >
      <Edit2 className="w-4 h-4" />
    </button>
  );
}
