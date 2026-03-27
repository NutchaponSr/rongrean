import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Key = "description";

const MAX_RECENT_ICONS = 20;

interface DatabaseStore {
  toggles: Record<Key, boolean>;
  recentIcons: Array<string>;
  onToggle: (key: Key) => void;
  addRecentIcon: (icon: string) => void;
}

export const useDatabaseStore = create<DatabaseStore>()(
  persist(
    (set) => ({
      toggles: {
        description: false,
      },
      recentIcons: [],
      onToggle: (key: Key) => {
        set((state) => ({
          toggles: {
            ...state.toggles,
            [key]: !state.toggles[key],
          },
        }));
      },
      addRecentIcon: (icon: string) => {
        set((state) => ({
          recentIcons: [icon, ...state.recentIcons.filter((i) => i !== icon)].slice(0, MAX_RECENT_ICONS),
        }));
      },
    }),
    {
      name: "db-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
)