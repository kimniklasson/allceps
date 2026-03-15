import type { Category, Exercise, WorkoutSession } from "../types/models";

export interface CategoryRepository {
  getAll(): Category[];
  getById(id: string): Category | null;
  create(name: string): Category;
  update(id: string, data: Partial<Pick<Category, "name" | "sortOrder">>): Category;
  delete(id: string): void;
  addExercise(
    categoryId: string,
    data: Pick<Exercise, "name" | "baseReps" | "baseWeight" | "isBodyweight">
  ): Exercise;
  updateExercise(
    categoryId: string,
    exerciseId: string,
    data: Partial<Pick<Exercise, "name" | "baseReps" | "baseWeight" | "isBodyweight">>
  ): Exercise;
  deleteExercise(categoryId: string, exerciseId: string): void;
  reorderCategories(orderedIds: string[]): void;
  reorderExercises(categoryId: string, orderedIds: string[]): void;
}

export interface SessionRepository {
  getAll(): WorkoutSession[];
  getById(id: string): WorkoutSession | null;
  getActive(): WorkoutSession | null;
  save(session: WorkoutSession): void;
  delete(id: string): void;
}
