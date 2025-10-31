import { z } from "zod";

const EnvSchema = z.object({
  VITE_API_BASE_URL: z.string().url().optional(),
});

const parsed = EnvSchema.safeParse({
  VITE_API_BASE_URL: (import.meta as any).env?.VITE_API_BASE_URL,
});

let VITE_API_BASE_URL =
  (parsed.success && parsed.data.VITE_API_BASE_URL
    ? parsed.data.VITE_API_BASE_URL
    : undefined) ?? undefined;

if (!VITE_API_BASE_URL) {
  // Advertimos en desarrollo si no está definida y aplicamos fallback público
  if (typeof console !== "undefined") {
    console.warn(
      "[env] VITE_API_BASE_URL no definido. Usando fallback público https://optic-management-api.onrender.com",
    );
  }
  VITE_API_BASE_URL = "https://optic-management-api.onrender.com";
}

export const env = { VITE_API_BASE_URL } as const;


