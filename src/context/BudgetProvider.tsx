import { useState, type ReactNode } from 'react';
import { BudgetContext } from './BudgetContext';
import type { BudgetItem } from '../Types/budget';

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<BudgetItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  return (
    <BudgetContext.Provider value={{ data, setData, loading, setLoading, error, setError }}>
      {children}
    </BudgetContext.Provider>
  );
};
