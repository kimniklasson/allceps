import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Appearance = "ljus" | "mörkt" | "auto";
export type Sex = "man" | "kvinna";

interface SettingsState {
  appearance: Appearance;
  userWeight: number;
  userAge: number;
  userSex: Sex | null;
  showCalories: boolean;
  setAppearance: (a: Appearance) => void;
  setUserWeight: (w: number) => void;
  setUserAge: (age: number) => void;
  setUserSex: (sex: Sex | null) => void;
  setShowCalories: (show: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      appearance: "auto",
      userWeight: 0,
      userAge: 0,
      userSex: null,
      showCalories: false,
      setAppearance: (appearance) => set({ appearance }),
      setUserWeight: (userWeight) => set({ userWeight }),
      setUserAge: (userAge) => set({ userAge }),
      setUserSex: (userSex) => set({ userSex }),
      setShowCalories: (showCalories) => set({ showCalories }),
    }),
    { name: "workout-app:settings-store" }
  )
);
