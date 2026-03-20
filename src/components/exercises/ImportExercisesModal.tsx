import { useState, useEffect } from "react";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { IconClose, IconCheck } from "../ui/icons";
import type { Exercise } from "../../types/models";

interface ImportExercisesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  currentExerciseNames: Set<string>;
}

interface UniqueExercise {
  name: string;
  normalizedName: string;
  template: Pick<Exercise, "baseReps" | "baseWeight" | "isBodyweight">;
  alreadyInCategory: boolean;
}

export function ImportExercisesModal({
  isOpen,
  onClose,
  categoryId,
  currentExerciseNames,
}: ImportExercisesModalProps) {
  const { categories, addExercise, reorderExercises } = useCategoryStore();
  const [checkedNames, setCheckedNames] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  // Reset checked state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCheckedNames(new Set());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Collect all unique exercises across all categories
  const uniqueExercises: UniqueExercise[] = [];
  const seen = new Set<string>();

  for (const cat of categories) {
    for (const ex of cat.exercises) {
      const normalized = ex.name.trim().toLowerCase();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        uniqueExercises.push({
          name: ex.name,
          normalizedName: normalized,
          template: {
            baseReps: ex.baseReps,
            baseWeight: ex.baseWeight,
            isBodyweight: ex.isBodyweight,
          },
          alreadyInCategory: currentExerciseNames.has(normalized),
        });
      }
    }
  }

  uniqueExercises.sort((a, b) => a.name.localeCompare(b.name, "sv"));

  const toggleCheck = (normalizedName: string) => {
    setCheckedNames((prev) => {
      const next = new Set(prev);
      if (next.has(normalizedName)) {
        next.delete(normalizedName);
      } else {
        next.add(normalizedName);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (checkedNames.size === 0) return;
    setSaving(true);

    const toAdd = uniqueExercises.filter(
      (e) => checkedNames.has(e.normalizedName) && !e.alreadyInCategory
    );

    for (const ex of toAdd) {
      await addExercise(categoryId, {
        name: ex.name,
        ...ex.template,
      });
    }

    // Persist order
    const exercises =
      useCategoryStore
        .getState()
        .categories.find((c) => c.id === categoryId)?.exercises ?? [];
    reorderExercises(categoryId, exercises.map((e) => e.id));

    setSaving(false);
    onClose();
  };

  const hasNewSelections = [...checkedNames].some(
    (name) => !currentExerciseNames.has(name)
  );

  return (
    <div
      className="fixed inset-0 z-70 flex flex-col justify-end modal-backdrop bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1c1c1e] rounded-t-modal max-h-[85vh] flex flex-col bottom-sheet-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
          <span className="font-bold text-[15px] leading-[1.22]">
            Välj övningar
          </span>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-icon"
          >
            <IconClose size={16} />
          </button>
        </div>

        {/* Exercise list */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="flex flex-col gap-2">
            {uniqueExercises.length === 0 ? (
              <p className="text-center opacity-50 py-8 text-[15px]">
                Inga övningar att importera
              </p>
            ) : (
              uniqueExercises.map((ex) => {
                const isChecked =
                  ex.alreadyInCategory ||
                  checkedNames.has(ex.normalizedName);
                const isDisabled = ex.alreadyInCategory;

                return (
                  <button
                    key={ex.normalizedName}
                    onClick={() =>
                      !isDisabled && toggleCheck(ex.normalizedName)
                    }
                    disabled={isDisabled}
                    className={`bg-card rounded-card px-4 py-3 flex items-center justify-between text-left ${
                      isDisabled ? "opacity-50" : ""
                    }`}
                  >
                    <span className="text-[15px]">{ex.name}</span>
                    <div
                      className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 ${
                        isChecked
                          ? "bg-black dark:bg-white"
                          : "border-2 border-black/20 dark:border-white/20"
                      }`}
                    >
                      {isChecked && (
                        <IconCheck
                          size={12}
                          className="text-white dark:text-black"
                        />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Sticky footer */}
        <div className="px-4 pt-4 pb-8 shrink-0">
          <button
            onClick={handleSave}
            disabled={!hasNewSelections || saving}
            className={`w-full py-3 rounded-card font-bold text-[15px] transition-colors ${
              hasNewSelections && !saving
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "bg-black/10 dark:bg-white/10 text-black/30 dark:text-white/30"
            }`}
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
            ) : (
              "Spara"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
