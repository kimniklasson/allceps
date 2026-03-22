import { useNavigate } from "react-router-dom";
import { IconTrash } from "../ui/icons";
import type { Category } from "../../types/models";

interface CategoryListItemProps {
  category: Category;
  onDelete: (id: string) => void;
  hasActiveSession?: boolean;
  isNew?: boolean;
  isExiting?: boolean;
  isDragging?: boolean;
  isDimmed?: boolean;
  itemProps: Record<string, unknown>;
}

export function CategoryListItem({
  category,
  onDelete,
  hasActiveSession,
  isNew,
  isExiting,
  isDragging,
  isDimmed,
  itemProps,
}: CategoryListItemProps) {
  const navigate = useNavigate();

  return (
    <div
      {...itemProps}
      className={[
        "bg-card rounded-card flex items-center gap-2 px-4 py-6 select-none",
        hasActiveSession ? "border-2 border-accent" : "",
        isDragging ? "shadow-xl scale-[1.01]" : "",
        isDimmed ? "opacity-40" : "opacity-100",
        isExiting ? "animate-out" : isNew ? "animate-new-exercise" : "animate-in",
        "transition-opacity transition-shadow duration-150",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Name — tap navigates */}
      <p
        className="flex-1 font-mono font-normal text-[15px] leading-[16px] uppercase cursor-pointer"
        onClick={() => !isDragging && navigate(`/category/${category.id}`)}
      >
        {category.name}
      </p>

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(category.id);
        }}
        className="w-8 h-full flex items-center justify-center"
      >
        <IconTrash size={16} />
      </button>
    </div>
  );
}
