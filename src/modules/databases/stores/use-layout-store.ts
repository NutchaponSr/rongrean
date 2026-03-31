import { create } from "zustand";

import { LayoutType } from "@/modules/databases/types";

interface LayoutStore {
  type: LayoutType;
  setType: (type: LayoutType) => void;
}

export const useLayoutStore = create<LayoutStore>()((set) => ({
  type: "table",
  setType: (type: LayoutType) => set({ type }),
}));