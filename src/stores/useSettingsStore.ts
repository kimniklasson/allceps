import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Appearance = "ljus" | "mörkt" | "auto";

interface SettingsState {
  appearance: Appearance;
  setAppearance: (a: Appearance) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      appearance: "auto",
      setAppearance: (appearance) => set({ appearance }),
    }),
    { name: "workout-app:settings-store" }
  )
);
