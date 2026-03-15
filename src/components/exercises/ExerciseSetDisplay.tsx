import type { WorkoutSet } from "../../types/models";

interface ExerciseSetDisplayProps {
  sets: WorkoutSet[];
  isBodyweight: boolean;
}

export function ExerciseSetDisplay({ sets, isBodyweight }: ExerciseSetDisplayProps) {
  if (sets.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap text-[12px]">
      {sets.map((set) => {
        const weightDisplay = isBodyweight ? `+${set.weight}` : set.weight.toString();
        return (
          <span key={set.setNumber}>
            <span className="font-bold">S{set.setNumber}:</span>{" "}
            {set.reps}x{weightDisplay}
          </span>
        );
      })}
    </div>
  );
}
