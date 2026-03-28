import { Modal } from "../ui/Modal";
import { ExerciseFormFields, type ExerciseFormData } from "./ExerciseFormFields";
import { EXERCISES } from "../../constants/ui-strings";

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: ExerciseFormData) => void;
}

export function AddExerciseModal({ isOpen, onClose, onAdd }: AddExerciseModalProps) {
  const handleSubmit = (data: ExerciseFormData) => {
    onAdd(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={EXERCISES.ADD_EXERCISE}
      subtitle={EXERCISES.ADD_EXERCISE_SUBTITLE}
    >
      <ExerciseFormFields onSubmit={handleSubmit} submitLabel={EXERCISES.ADD} />
    </Modal>
  );
}
