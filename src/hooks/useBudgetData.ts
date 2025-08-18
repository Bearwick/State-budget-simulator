import { useEffect } from "react";
import { fetchBudgetData } from "../API/budget";
import { useBudgetContext } from "../context/BudgetContext";


export function useBudgetData() {

    const { setData, setLoading, setError} = useBudgetContext();
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(false);
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
  }, [setData, setError, setLoading]);
}