import { useState, useRef, useEffect } from "react";
import { IconMinus, IconPlus } from "../ui/icons";

interface RepWeightAdjusterProps {
  value: number;
  label: string;
  isBodyweight?: boolean;
  step?: number;
  isActive?: boolean;
  onChange: (newValue: number) => void;
}

export function RepWeightAdjuster({
  value,
  label,
  isBodyweight = false,
  step = 1,
  isActive = false,
  onChange,
}: RepWeightAdjusterProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const displayValue = isBodyweight
    ? value === 0
      ? "KV"
      : `KV + ${value} ${label}`
    : `${value} ${label}`;

  const handleDisplayClick = () => {
    setInputValue(value.toString());
    setIsEditing(true);
  };

  const commitEdit = () => {
    const parsed = label === "kg" ? parseFloat(inputValue) : parseInt(inputValue, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(parsed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") setIsEditing(false);
  };

  return (
    <div className={`relative bg-white dark:bg-[#2c2c2e] rounded-card flex items-center w-full transition-all duration-300 ease-in-out ${isActive ? "h-14" : "h-10"}`}>
      {/* Full-width text layer behind buttons */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {isEditing ? (
          <input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            className={`w-full text-center bg-transparent outline-none pointer-events-auto transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isActive ? "text-[15px] font-bold" : "text-[12px]"}`}
          />
        ) : (
          <span
            className={`text-center whitespace-nowrap cursor-text select-none pointer-events-auto transition-all duration-300 ${isActive ? "text-[15px] font-bold" : "text-[12px]"}`}
            onClick={handleDisplayClick}
          >
            {displayValue}
          </span>
        )}
      </div>
      {/* Buttons on top */}
      <button
        onClick={() => onChange(Math.max(0, value - step))}
        className="relative z-10 w-12 h-full flex items-center justify-center rounded-card"
      >
        <IconMinus size={16} />
      </button>
      <div className="flex-1" />
      <button
        onClick={() => onChange(value + step)}
        className="relative z-10 w-12 h-full flex items-center justify-center rounded-card"
      >
        <IconPlus size={16} />
      </button>
    </div>
  );
}
