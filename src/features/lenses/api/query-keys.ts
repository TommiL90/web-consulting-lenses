export const lensKeys = {
  all: ["lenses"] as const,
  list: () => [...lensKeys.all, "list"] as const,
  detail: (id: string) => [...lensKeys.all, "detail", id] as const,
  quote: () => [...lensKeys.all, "quote"] as const,
};

export const prescriptionRangeKeys = {
  all: ["prescriptionRanges"] as const,
  list: () => [...prescriptionRangeKeys.all, "list"] as const,
};
