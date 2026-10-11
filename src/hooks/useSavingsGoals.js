import { useCallback, useEffect, useState } from "react";

import {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
} from "../services/savingsService";

export default function useSavingsGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setGoals(await getSavingsGoals());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (values) => {
    const goal = await createSavingsGoal(values);
    setGoals((prev) => [goal, ...prev]);
    return goal;
  };

  const update = async (id, values) => {
    const goal = await updateSavingsGoal(id, values);
    setGoals((prev) => prev.map((item) => (item.id === id ? goal : item)));
    return goal;
  };

  const remove = async (id) => {
    await deleteSavingsGoal(id);
    setGoals((prev) => prev.filter((item) => item.id !== id));
  };

  return { goals, loading, error, reload: load, create, update, remove };
}