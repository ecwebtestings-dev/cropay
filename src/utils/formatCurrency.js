const numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });


export function formatCurrency(amount) {
  const value = Number(amount);
  return `UGX ${numberFormat.format(Number.isFinite(value) ? value : 0)}`;
}

// CURRENCY VALUES IN UGANDAN SHILLINGS
export const formatMoney = (amount = 0) =>
  new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

// FORMAT NUMERIC VALUES 
export const formatNumber = (value = 0) =>
  new Intl.NumberFormat("en-UG").format(Number(value) || 0);