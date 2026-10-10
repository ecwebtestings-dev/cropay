export const validateName = (value = "") => {
  const name = value.trim();
  if (!name) return "Your Full Name";
  if (name.length < 2) return "Atleast 2 characters.";
  return "";
};