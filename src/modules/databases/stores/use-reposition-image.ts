import { create } from "zustand";

interface RepositionImageStore {
  position: number;
  initialPosition: number;
  isRepositioning: boolean;
  setPosition: (position: number) => void;
  startRepositioning: () => void;
  saveRepositioning: () => void;
  cancelRepositioning: () => void;
  onSave?: (position: number) => void;
}

export const useRepositionImage = create<RepositionImageStore>((set, get) => ({
  position: 0,
  initialPosition: 0,
  isRepositioning: false,
  setPosition: (position) => set({ position: Math.max(0, Math.min(100, position)) }),
  startRepositioning: () => set((state) => ({ isRepositioning: true,initialPosition: state.position })),
  saveRepositioning: () => {
    const { position, onSave } = get();
    onSave?.(position);
    set({ isRepositioning: false, initialPosition: position });
  },
  cancelRepositioning: () => set((state) => ({ isRepositioning: false, position: state.initialPosition })),
}))