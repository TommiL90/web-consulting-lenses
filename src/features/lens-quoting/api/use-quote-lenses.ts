import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type {
	QuoteResponse,
	LensProduct,
	Prescription,
} from "@/features/lenses/types";
import type { QuoteFormValues } from "../schemas";
import type { MappedProduct } from "@/hooks/use-products";

function mapFormToRequest(values: QuoteFormValues) {
	return {
		prescription: values.prescription,
	};
}

function mapQuoteProductToFlat(
	product: LensProduct,
	prescriptionRangeCode: string,
	prescriptionRangeDescription: string,
): MappedProduct {
	return {
		id: product.id,
		sku: product.sku,
		name: product.name,
		material: product.material,
		tipo: product.tipo,
		hasAntiReflective: product.features.hasAntiReflective,
		hasBlueFilter: product.features.hasBlueFilter,
		isPhotochromic: product.features.isPhotochromic,
		hasUVProtection: product.features.hasUVProtection,
		isPolarized: product.features.isPolarized,
		isMirrored: product.features.isMirrored,
		basePrice: product.pricing.basePrice,
		finalPrice: product.pricing.finalPrice,
		deliveryDays: product.deliveryDays,
		observations: product.observations ?? "",
		prescriptionRangeCode,
		prescriptionRangeDescription,
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

export function useQuoteLensesData() {
	const quoteMutation = useQuoteLenses();

	const mappedProducts = quoteMutation.data?.results
		? quoteMutation.data.results.map((product) =>
				mapQuoteProductToFlat(
					product,
					quoteMutation.data.meta.prescriptionRangeUsed.code,
					quoteMutation.data.meta.prescriptionRangeUsed.description,
				),
			)
		: [];

	return {
		products: mappedProducts,
		meta: quoteMutation.data?.meta,
		isPending: quoteMutation.isPending,
		error: quoteMutation.error,
		mutate: quoteMutation.mutate,
	};
}
