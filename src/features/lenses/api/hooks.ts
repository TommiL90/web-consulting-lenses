import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type {
  LensProduct,
  PrescriptionRange,
} from "@/features/lenses/types";
import type { LensProductFormValues } from "@/features/lenses/schemas";
import { lensKeys, prescriptionRangeKeys } from "@/features/lenses/api/query-keys";

type LensProductsResponse = {
  products: LensProduct[];
};

type PrescriptionRangesResponse = {
  ranges: PrescriptionRange[];
};

type CreateLensProductPayload = Omit<
  LensProductFormValues,
  "observations" | "costPrice"
> & {
  observations: string | null;
  costPrice?: number | null;
};

type UpdateLensProductPayload = CreateLensProductPayload;

function mapFormValuesToPayload(
  values: LensProductFormValues,
): CreateLensProductPayload {
  const { observations, costPrice, sku, name, ...rest } = values;
  const trimmedObservations = observations?.trim();

  return {
    ...rest,
    sku: sku.trim(),
    name: name.trim(),
    observations:
      trimmedObservations && trimmedObservations.length > 0
        ? trimmedObservations
        : null,
    ...(costPrice !== null && costPrice !== undefined
      ? { costPrice }
      : {}),
  };
}

export function useLensProductsQuery() {
  return useQuery({
    queryKey: lensKeys.list(),
    queryFn: async () => {
      const response = await apiFetch<LensProductsResponse>("/lenses/products", {
        method: "GET",
      });
      return response.products;
    },
    staleTime: 1000 * 60,
  });
}

export function usePrescriptionRangesQuery() {
  return useQuery({
    queryKey: prescriptionRangeKeys.list(),
    queryFn: async () => {
      const response = await apiFetch<PrescriptionRangesResponse>(
        "/prescription-ranges",
        { method: "GET" },
      );
      return response.ranges;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateLensProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: LensProductFormValues) => {
      const payload = mapFormValuesToPayload(values);
      return apiFetch<LensProduct>("/lenses/products", {
        method: "POST",
        body: payload,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lensKeys.list() });
    },
  });
}

type UpdateLensProductInput = {
  id: string;
  values: LensProductFormValues;
};

export function useUpdateLensProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values }: UpdateLensProductInput) => {
      const payload: UpdateLensProductPayload =
        mapFormValuesToPayload(values);
      return apiFetch<LensProduct>(`/lenses/products/${id}`, {
        method: "PUT",
        body: payload,
      });
    },
    onSuccess: (_, variables) => {
      const { id } = variables;
      queryClient.invalidateQueries({ queryKey: lensKeys.list() });
      queryClient.invalidateQueries({ queryKey: lensKeys.detail(id) });
    },
  });
}

export function useDeleteLensProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiFetch<void>(`/lenses/products/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lensKeys.list() });
    },
  });
}
