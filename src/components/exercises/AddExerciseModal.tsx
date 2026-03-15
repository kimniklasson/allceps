import { Modal } from "../ui/Modal";
import { ExerciseFormFields, type ExerciseFormData } from "./ExerciseFormFields";

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
      title="Lägg till en övning"
      subtitle="Fyll i allt för att lägga till"
    >
      <ExerciseFormFields onSubmit={handleSubmit} submitLabel="Lägg till" />
    </Modal>
  );
}
