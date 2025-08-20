import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type SearchOption = {
  id: string | number;
  name: string;
  avatar?: string; // 🔹 ссылка на аватар
};

type DropdownWithSearchAvaProps = {
  label?: string;
  value: string | number | null;
  onSelect: (id: string | number) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  initialOptions?: SearchOption[];
  onSearch: (query: string) => Promise<SearchOption[]>;
  onLoadOption?: (id: string | number) => Promise<SearchOption | null>;
};

export const DropdownWithSearchAva = ({
  label,
  value,
  onSelect,
  placeholder,
  searchPlaceholder = "Поиск...",
  initialOptions = [],
  onSearch,
  onLoadOption,
}: DropdownWithSearchAvaProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [options, setOptions] = useState<SearchOption[]>(initialOptions);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SearchOption | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // загрузка выбранного значения
  useEffect(() => {
    if (value && !selectedOption && onLoadOption) {
      onLoadOption(value).then(opt => opt && setSelectedOption(opt));
    }
  }, [value, onLoadOption]);

  // поиск
  useEffect(() => {
    if (!isOpen) return;
    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await onSearch(searchQuery);
        setOptions(results);
      } catch {
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, isOpen, onSearch]);

  // закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // автофокус
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (id: string | number) => {
    const option = options.find(o => o.id === id);
    if (option) {
      setSelectedOption(option);
    }
    onSelect(id);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="relative" ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-black border cursor-pointer border-gray-300 rounded-xl px-4 py-2 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center gap-2">
          {selectedOption?.avatar && (
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={selectedOption.avatar}
                alt={selectedOption.name}
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
          )}
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
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full text-black bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          <ul className="max-h-64 overflow-auto">
            {options.length === 0 && !isLoading && (
              <li className="px-4 py-3 text-gray-500 text-center">
                {searchQuery ? "Ничего не найдено" : "Начните вводить для поиска"}
              </li>
            )}
            {options.map((option) => {
              const isActive = value?.toString() === option.id.toString();
              return (
                <li
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`
                    px-4 py-3 cursor-pointer flex items-center gap-3
                    transition-colors duration-150
                    ${isActive ? "bg-blue-600 text-white" : "text-gray-700"}
                    ${!isActive ? "hover:bg-blue-100 hover:text-blue-900" : ""}
                  `}
                >
                  {option.avatar && (
                    <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={option.avatar}
                        alt={option.name}
                        width={36}
                        height={36}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <span>{option.name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
