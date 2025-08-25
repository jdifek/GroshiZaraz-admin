import { useState, useRef, useEffect, ReactNode } from "react";

type Option = {
  id: string | number;
  name: string;
  icon?: ReactNode; // для иконки слева
  leftElement?: ReactNode; // любой элемент слева, например Filter
};

type DropdownProps = {
  label?: string; // необязательный лейбл
  disabled?: boolean;
  options: Option[];
  value: string | number | null;
  onSelect: (id: string | number) => void;
  placeholder?: string; // необязательный placeholder
};

export const Dropdown = ({
  label,
  options,
  value,
  onSelect,
  placeholder,
  disabled
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.id.toString() === value?.toString());

  return (
    <div className="relative" ref={ref}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-black border cursor-pointer  border-gray-300 rounded-xl px-4 py-2 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center gap-2">
          {selectedOption?.leftElement}
          {selectedOption?.icon}
          <span>{selectedOption?.name || placeholder || "Выберите"}</span>
        </div>
        <svg
          className={`w-5 h-5 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
  <ul className="absolute z-10 mt-1 w-full text-black bg-white border border-gray-300 rounded-xl max-h-48 overflow-auto  scrollbar-none  shadow-lg">
    {options.map((option) => {
      const isActive = value?.toString() === option.id.toString();
      return (
        <li
          key={option.id}
          onClick={() => {
            onSelect(option.id);
            setIsOpen(false);
          }}
          className={`
            px-4 py-2 cursor-pointer rounded-xl flex items-center gap-2
            transition-colors duration-150
            ${isActive ? "bg-blue-600 text-white" : "text-gray-700"}
            ${!isActive ? "hover:bg-blue-100 hover:text-blue-900" : ""}
          `}
        >
          {option.leftElement}
          {option.icon}
          {option.name}
        </li>
      );
    })}
  </ul>
)}

    </div>
  );
};
