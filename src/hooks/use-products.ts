import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { mapProductToFlat } from "@/lib/helpers";

export interface Product {
	id: string;
	sku: string;
	name: string;
	material: string;
	tipo: string;
	frameType: string;
	features: Features;
	pricing: Pricing;
	deliveryDays: number;
	observations: string;
	available: boolean;
	prescriptionRangeId: string;
	createdAt: string;
	updatedAt: string;
	prescriptionRange: PrescriptionRange;
}

export interface Features {
	hasAntiReflective: boolean;
	hasBlueFilter: boolean;
	isPhotochromic: boolean;
	hasUVProtection: boolean;
	isPolarized: boolean;
	isMirrored: boolean;
}

export interface Pricing {
	basePrice: number;
	finalPrice: number;
}

export interface PrescriptionRange {
	id: string;
	code: string;
	description: string;
	minEyeMaxSphere: number;
	minEyeMaxCylinder: number;
	maxEyeMaxSphere: number;
	maxEyeMaxCylinder: number;
	createdAt: string;
	updatedAt: string;
}

export interface MappedProduct {
	id: string;
	sku: string;
	name: string;
	material: string;
	tipo: string;
	hasAntiReflective: boolean;
	hasBlueFilter: boolean;
	isPhotochromic: boolean;
	hasUVProtection: boolean;
	isPolarized: boolean;
	isMirrored: boolean;
	basePrice: number;
	finalPrice: number;
	deliveryDays: number;
	observations: string;
	prescriptionRangeCode: string;
	prescriptionRangeDescription: string;
}

type ProductsResponse = {
	products: Product[];
};

export function useProducts() {
	const {
		data: response,
		error: errorProducts,
		isLoading: isLoadingProducts,
	} = useQuery({
		queryKey: ["products", "example"],
		queryFn: async () => {
			const response = await apiFetch<ProductsResponse>("/lenses/products", {
				method: "GET",
			});
			return response;
		},
		staleTime: 1000 * 60,
	});

	const products = response?.products
		? response.products.map((product) => mapProductToFlat(product))
		: [];

	return { products, errorProducts, isLoadingProducts };
}
