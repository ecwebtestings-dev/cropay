export const MIN_GOAL_AMOUNT = 1000;

export const validateGoalName = (value = "") => {
  const name = value.trim();
  if (!name) return "Enter a name for your goal.";
  if (name.length < 2) return "Use at least 2 characters.";
  if (name.length > 60) return "Use 60 characters or fewer.";
  return "";
};



export const validateTargetAmount = (value = "") => {
  if (value === "" || value === null) return "Enter your target amount.";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "Enter a valid amount.";
  if (!Number.isInteger(amount)) return "Use a whole number, with no decimals.";
  if (amount < MIN_GOAL_AMOUNT) {
    return `The minimum target is UGX ${MIN_GOAL_AMOUNT.toLocaleString("en-US")}.`;
  }
  return "";
};



export const validateDeadline = (value = "") => {
  if (!value) return "Choose a target date.";
  const today = new Date().toISOString().slice(0, 10);
  if (value < today) return "The target date can't be in the past.";
  return "";
};


// Returns only the fields that have a problem; {} means the form is valid.
export const validateGoal = ({ name, targetAmount, deadline }) => {
  const results = {
    name: validateGoalName(name),
    targetAmount: validateTargetAmount(targetAmount),
    deadline: validateDeadline(deadline),
  };

  return Object.fromEntries(Object.entries(results).filter(([, message]) => message));
};