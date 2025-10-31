const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  minimumFractionDigits: 0,
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatDeliveryDays(days: number) {
  if (days === 1) {
    return "1 día hábil";
  }

  return `${days} días hábiles`;
}
