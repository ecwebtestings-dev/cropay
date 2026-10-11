const numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });


export function formatCurrency(amount) {
  const value = Number(amount);
  return `UGX ${numberFormat.format(Number.isFinite(value) ? value : 0)}`;
}