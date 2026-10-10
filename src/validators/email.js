const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validateEmail = (value = "") => {
  const email = value.trim();
  if (!email) return "Email required";

  if (!EMAIL_REGEX.test(email)) return "Enter avalid email address";
  return "";
};