
export function getGoalStatus(goal) {
  if (goal.targetAmount > 0 && goal.savedAmount >= goal.targetAmount) {
    return "completed";
  }

  if (goal.deadline && new Date(`${goal.deadline}T23:59:59`) < new Date()) {
    return "overdue";
  }

  return "active";
}

// 0-100, rounded.
export function getGoalProgress(goal) {
  if (!goal.targetAmount) return 0;
  return Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
}