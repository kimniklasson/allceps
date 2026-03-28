import type { Exercise } from "../../types/models";
import { Modal } from "../ui/Modal";
import { ExerciseFormFields, type ExerciseFormData } from "./ExerciseFormFields";
import { EXERCISES, COMMON } from "../../constants/ui-strings";

interface EditExerciseModalProps {
  isOpen: boolean;
  exercise: Exercise | null;
  onClose: () => void;
  onSave: (exerciseId: string, data: ExerciseFormData) => void;
}

export function EditExerciseModal({
  isOpen,
  exercise,
  onClose,
  onSave,
}: EditExerciseModalProps) {
  if (!exercise) return null;

  const handleSubmit = (data: ExerciseFormData) => {
    onSave(exercise.id, data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={EXERCISES.EDIT_EXERCISE}
      subtitle={EXERCISES.EDIT_EXERCISE_SUBTITLE}
    >
      <ExerciseFormFields
        initialData={{
          name: exercise.name,
          baseReps: exercise.baseReps,
          baseWeight: exercise.baseWeight,
          isBodyweight: exercise.isBodyweight,
          muscleGroups: exercise.muscleGroups,
        }}
        onSubmit={handleSubmit}
        submitLabel={COMMON.SAVE}
      />
    </Modal>
  );
}
