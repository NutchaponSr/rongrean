import { create } from "zustand";

import { ApiOutputs } from "@convex/api";

type Row = ApiOutputs["database"]["getOne"]["rows"][0];

interface TableStore {
  selectedRows: Map<string, Row>;
  isSelected: (row: Row) => boolean;
  toggle: (row: Row) => void;
  selectAll: (rows: Row[]) => void;
  clearAll: () => void;
  getSelectedRows: () => Row[];
  isAllSelected: (rows: Row[]) => boolean;
  isIndeterminate: (rows: Row[]) => boolean;
}

export const useTableStore = create<TableStore>()((set, get) => ({
  selectedRows: new Map(),

  isSelected: (row) => get().selectedRows.has(row.pageId),

  toggle: (row) =>
    set((state) => {
      const next = new Map(state.selectedRows);
      if (next.has(row.pageId)) {
        next.delete(row.pageId);
      } else {
        next.set(row.pageId, row);
      }
      return { selectedRows: next };
    }),

  selectAll: (rows) =>
    set((state) => {
      const allSelected = rows.every((row) => state.selectedRows.has(row.pageId));
      const next = new Map(state.selectedRows);
      if (allSelected) {
        rows.forEach((row) => next.delete(row.pageId));
      } else {
        rows.forEach((row) => next.set(row.pageId, row));
      }
      return { selectedRows: next };
    }),

  clearAll: () => set({ selectedRows: new Map() }),

  getSelectedRows: () => Array.from(get().selectedRows.values()),

  isAllSelected: (rows) => {
    if (rows.length === 0) return false;
    return rows.every((row) => get().selectedRows.has(row.pageId));
  },

  isIndeterminate: (rows) => {
    if (rows.length === 0) return false;
    const selected = rows.filter((row) => get().selectedRows.has(row.pageId));
    return selected.length > 0 && selected.length < rows.length;
  },
}));
