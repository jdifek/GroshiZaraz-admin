/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonHTMLAttributes, ReactNode } from "react";
import { Edit2 } from "lucide-react";

type ItemModeProps<T> = {
  item: T;
  handleClick: (item: T) => void;
  children?: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

type ClickModeProps = {
  onClick: () => void;
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type Props<T> = ItemModeProps<T> | ClickModeProps;

export function EditButton<T>(props: Props<T>) {
  const { children, className, ...rest } = props as any;

  const handleClick =
    "item" in props
      ? () => props.handleClick(props.item)
      : props.onClick;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-10 h-10 cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center transition-colors ${
        className || ""
      }`}
      aria-label="Редактировать"
      {...rest}
    >
      {children || <Edit2 className="w-4 h-4" />}
    </button>
  );
}
