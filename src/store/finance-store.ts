import { create } from "zustand";

type FinanceState = {
  expenseFilter: string;
  setExpenseFilter: (expenseFilter: string) => void;
};

export const useFinanceStore = create<FinanceState>((set) => ({
  expenseFilter: "",
  setExpenseFilter: (expenseFilter) => set({ expenseFilter }),
}));
