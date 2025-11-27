import type { MappedProduct, Product } from "@/hooks/use-products";

export function mapProductToFlat(product: Product): MappedProduct {
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
		prescriptionRangeCode: product.prescriptionRange.code,
		prescriptionRangeDescription: product.prescriptionRange.description,
	};
}
