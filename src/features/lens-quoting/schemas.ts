import { z } from "zod";
import { FRAME_TYPES, LENS_MATERIALS, LENS_TYPES } from "@/features/lenses/constants";

const stepRefine = (value: number) =>
  Math.abs(value * 4 - Math.round(value * 4)) < Number.EPSILON * 4;

const numericPrescriptionField = z
  .number()
  .refine((value) => Number.isFinite(value), {
    message: "Ingresa un número válido",
  })
  .refine(stepRefine, {
    message: "Debe avanzar en pasos de 0.25",
  });

const preprocessNumber = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "number") {
    return value;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? Number.NaN : parsed;
}, numericPrescriptionField);

const eyeSchema = z.object({
  sphere: preprocessNumber,
  cylinder: preprocessNumber,
});

export const quoteFormSchema = z.object({
  prescription: z.object({
    od: eyeSchema,
    oi: eyeSchema,
  }),
  filters: z.object({
    frameType: z.enum(FRAME_TYPES),
    material: z.enum(LENS_MATERIALS).optional(),
    hasBlueFilter: z.boolean().optional(),
    hasAntiReflective: z.boolean().optional(),
    isPhotochromic: z.boolean().optional(),
    isPolarized: z.boolean().optional(),
    tipo: z.enum(LENS_TYPES).optional(),
  }),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
