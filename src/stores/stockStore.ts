import { create } from "zustand";
import type { Stock } from "@/types/stockTypes";

type StockState = {
  stocks: Stock[][];
};

type StockActions = {
  setStocks: (stocks: Stock[][]) => void;
};

// all stocks of all players
export const useStock = create<StockState & StockActions>((set) => ({
  stocks: [],
  setStocks: (stocks: Stock[][]) => set({ stocks }),
}));
