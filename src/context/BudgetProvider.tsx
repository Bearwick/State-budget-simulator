import { useEffect, useState, type ReactNode } from 'react';
import { BudgetContext } from './BudgetContext';
import type { BudgetItem } from '../Types/budget';
import { fetchBudgetData } from '../API/budget';

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<BudgetItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean | Error>(false);
  const [updated, setUpdated] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetchBudgetData();
        const labels = res.dimension.Hovedpost.category.label;
        const values: number[] = res.value;
        const items: BudgetItem[] = Object.keys(labels).map((code, i) => ({
          code,
          label: labels[code],
          value: values[i],
        }));
        setData(items);
        setUpdated(res.updated);
      } catch (err) {
        setError(err as Error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <BudgetContext.Provider
      value={{ data, setData, loading, setLoading, error, setError, updated, setUpdated }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
