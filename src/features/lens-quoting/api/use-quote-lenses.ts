import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { QuoteResponse, QuoteRequest } from "@/features/lenses/types";
import type { QuoteFormValues } from "../schemas";

function mapFormToRequest(values: QuoteFormValues): QuoteRequest {
  const { prescription, filters } = values;

  const filteredFilters: QuoteRequest["filters"] = {
    frameType: filters.frameType,
  };

  if (filters.material) {
    filteredFilters.material = filters.material;
  }

  if (filters.tipo) {
    filteredFilters.tipo = filters.tipo;
  }

  if (filters.hasAntiReflective) {
    filteredFilters.hasAntiReflective = true;
  }

  if (filters.hasBlueFilter) {
    filteredFilters.hasBlueFilter = true;
  }

  if (filters.isPhotochromic) {
    filteredFilters.isPhotochromic = true;
  }

  if (filters.isPolarized) {
    filteredFilters.isPolarized = true;
  }

  return {
    prescription,
    filters: filteredFilters,
  };
}

export function useQuoteLenses() {
  return useMutation<QuoteResponse, unknown, QuoteFormValues>({
    mutationFn: async (values) => {
      const payload = mapFormToRequest(values);
      return apiFetch<QuoteResponse>("/lenses/quote", {
        method: "POST",
        body: payload,
      });
    },
  });
}
