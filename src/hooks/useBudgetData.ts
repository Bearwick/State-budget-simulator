import { useState, useEffect } from "react";
import { fetchBudgetData } from "../API/budget";
import type { BudgetItem } from "../Types/budget";


export function useBudgetData() {
  const [data, setData] = useState<BudgetItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchBudgetData();
        const labels = res.dimension.Hovedpost.category.label;
        const values: number[] = res.value;
        const items = Object.keys(labels).map((code, i) => ({
          code,
          label: labels[code],
          value: values[i]
        }));
        setData(items);
      } catch (err) {
        setError(err as Error);
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return { data, loading, error };
}