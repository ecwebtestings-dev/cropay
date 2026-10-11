
export function toLocalPhone(value = "") {
  const digits = value.replace(/[\s()-]/g, "");
  return digits.replace(/^\+?256/, "0");
}


export function detectNetwork(value = "") {
  const prefix = toLocalPhone(value).slice(0, 3);

  if (["076", "077", "078"].includes(prefix)) return "MTN";
  if (["070", "074", "075"].includes(prefix)) return "Airtel";
  return "";
}


export function isValidMobileNumber(value = "") {
  return /^07\d{8}$/.test(toLocalPhone(value));
}