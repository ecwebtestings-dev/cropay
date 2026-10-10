export const PASSWORD_MIN_LENGTH = 8;


export const validatePassword = (value = "") => {
  if (!value) return "Enter a password.";
  if (value.length < PASSWORD_MIN_LENGTH)
    return `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
  if (!/[A-Za-z]/.test(value)) return "Include at least one letter.";
  if (!/\d/.test(value)) return "Include at least one number.";
  return "";
};


export const validateLoginPassword = (value = "") =>
  value ? "" : "Enter your password.";