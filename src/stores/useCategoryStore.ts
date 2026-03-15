import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category, Exercise } from "../types/models";
import { categoryRepository } from "../data/repositories/categoryRepository";

interface CategoryState {
  categories: Category[];
  loadCategories: () => void;
  createCategory: (name: string) => Category;
  deleteCategory: (id: string) => void;
  addExercise: (
    categoryId: string,
    data: Pick<Exercise, "name" | "baseReps" | "baseWeight" | "isBodyweight">
  ) => Exercise;
  updateExercise: (
    categoryId: string,
    exerciseId: string,
    data: Partial<Pick<Exercise, "name" | "baseReps" | "baseWeight" | "isBodyweight">>
  ) => Exercise;
  deleteExercise: (categoryId: string, exerciseId: string) => void;
  getCategoryById: (id: string) => Category | undefined;
  reorderCategories: (orderedIds: string[]) => void;
  reorderExercises: (categoryId: string, orderedIds: string[]) => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [],

      loadCategories: () => {
        set({ categories: categoryRepository.getAll() });
      },

      createCategory: (name: string) => {
        const category = categoryRepository.create(name);
        set({ categories: categoryRepository.getAll() });
        return category;
      },

      deleteCategory: (id: string) => {
        categoryRepository.delete(id);
        set({ categories: categoryRepository.getAll() });
      },

      addExercise: (categoryId, data) => {
        const exercise = categoryRepository.addExercise(categoryId, data);
        set({ categories: categoryRepository.getAll() });
        return exercise;
      },

      updateExercise: (categoryId, exerciseId, data) => {
        const exercise = categoryRepository.updateExercise(categoryId, exerciseId, data);
        set({ categories: categoryRepository.getAll() });
        return exercise;
      },

      deleteExercise: (categoryId, exerciseId) => {
        categoryRepository.deleteExercise(categoryId, exerciseId);
        set({ categories: categoryRepository.getAll() });
      },

      getCategoryById: (id: string) => {
        return get().categories.find((c) => c.id === id);
      },

      reorderCategories: (orderedIds) => {
        categoryRepository.reorderCategories(orderedIds);
        set({ categories: categoryRepository.getAll() });
      },

      reorderExercises: (categoryId, orderedIds) => {
        categoryRepository.reorderExercises(categoryId, orderedIds);
        set({ categories: categoryRepository.getAll() });
      },
    }),
    {
      name: "workout-app:category-store",
      partialize: (state) => ({ categories: state.categories }),
    }
  )
);
