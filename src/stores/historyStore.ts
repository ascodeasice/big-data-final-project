import { create } from "zustand";
import type { History } from "@/types/stockTypes";

export type HistoryStore = History & {
  stockValue: number;
};

type HistoryState = {
  histories: HistoryStore[][];
};

type HistoryActions = {
  pushHistories: (newHistories: HistoryStore[]) => void;
  clearHistories: () => void;
};

// all histories of all players
export const useHistory = create<HistoryState & HistoryActions>((set) => ({
  histories: [],
  pushHistories: (newHistories) => {
    set((state) => ({
      histories: [...state.histories, newHistories],
    }));
  },
  clearHistories: () => set({ histories: [] }),
}));
