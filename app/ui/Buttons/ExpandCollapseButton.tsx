import { ChevronUp, ChevronDown } from "lucide-react";
import { LucideIcon } from "lucide-react";

type ExpandCollapseButtonProps = {
  isExpanded: boolean;
  onToggle: () => void;
  size?: number; // размер кнопки
  ExpandedIcon?: LucideIcon; // иконка при развернутом состоянии
  CollapsedIcon?: LucideIcon; // иконка при свернутом состоянии
  titleExpanded?: string;
  titleCollapsed?: string;
};

export const ExpandCollapseButton: React.FC<ExpandCollapseButtonProps> = ({
  isExpanded,
  onToggle,
  size = 40,
  ExpandedIcon = ChevronUp,
  CollapsedIcon = ChevronDown,
  titleExpanded = "Свернуть",
  titleCollapsed = "Развернуть",
}) => {
  const Icon = isExpanded ? ExpandedIcon : CollapsedIcon;

  return (
    <button
      onClick={onToggle}
      className="bg-gray-50 cursor-pointer hover:bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center transition-colors"
      style={{ width: size, height: size }}
      title={isExpanded ? titleExpanded : titleCollapsed}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};
