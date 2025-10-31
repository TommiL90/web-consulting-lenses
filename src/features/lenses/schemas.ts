import { z } from "zod";
import { FRAME_TYPES, LENS_MATERIALS, LENS_TYPES } from "@/features/lenses/constants";

const currencyField = z.number().min(0, "Debe ser un valor igual o mayor a 0");

const pricePreprocess = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? Number.NaN : parsed;
  }

  return value;
}, currencyField);

const optionalCurrencyPreprocess = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? Number.NaN : parsed;
  }

  return value;
}, currencyField.nullable());

const integerField = z
  .number()
  .min(0, "Debe ser un número positivo")
  .int("Debe ser un número entero");

const integerPreprocess = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? Number.NaN : parsed;
  }

  return value;
}, integerField);

export const lensProductFormSchema = z
  .object({
    sku: z.string().min(1, "Ingresa el SKU"),
    name: z.string().min(1, "Ingresa el nombre"),
    material: z.enum(LENS_MATERIALS),
    tipo: z.enum(LENS_TYPES),
    frameType: z.enum(FRAME_TYPES),
    hasAntiReflective: z.boolean(),
    hasBlueFilter: z.boolean(),
    isPhotochromic: z.boolean(),
    hasUVProtection: z.boolean(),
    isPolarized: z.boolean(),
    isMirrored: z.boolean(),
    costPrice: optionalCurrencyPreprocess,
    basePrice: pricePreprocess,
    finalPrice: pricePreprocess,
    deliveryDays: integerPreprocess,
    observations: z.string().nullable().optional(),
    available: z.boolean(),
    prescriptionRangeId: z
      .string()
      .min(1, "Selecciona un rango de prescripción"),
  })
  .refine(
    (data) =>
      typeof data.basePrice === "number" &&
      typeof data.finalPrice === "number" &&
      data.finalPrice >= data.basePrice,
    {
      path: ["finalPrice"],
      message: "El precio final debe ser mayor o igual al precio base",
    },
  );

export type LensProductFormValues = z.infer<typeof lensProductFormSchema>;
