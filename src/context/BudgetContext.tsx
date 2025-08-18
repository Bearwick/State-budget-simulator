import { createContext, useContext } from 'react';
import type { BudgetItem } from '../Types/budget';

export interface BudgetContextType {
  data: BudgetItem[] | null;
  setData: React.Dispatch<React.SetStateAction<BudgetItem[] | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: boolean | Error;
  setError: React.Dispatch<React.SetStateAction<boolean | Error>>;
}

export const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudgetContext = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudgetContext must be used within a BudgetProvider');
  }
  return context;
};
