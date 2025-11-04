import {
	ArrowDown,
	ArrowRight,
	ArrowUp,
	CheckCircle,
	Circle,
	CircleOff,
	HelpCircle,
	Timer,
} from "lucide-react";
import type { MappedProduct } from "@/hooks/use-products";

export const labels = [
	{
		value: "bug",
		label: "Bug",
	},
	{
		value: "feature",
		label: "Feature",
	},
	{
		value: "documentation",
		label: "Documentation",
	},
];

export const statuses = [
	{
		value: "backlog",
		label: "Backlog",
		icon: HelpCircle,
	},
	{
		value: "todo",
		label: "Todo",
		icon: Circle,
	},
	{
		value: "in progress",
		label: "In Progress",
		icon: Timer,
	},
	{
		value: "done",
		label: "Done",
		icon: CheckCircle,
	},
	{
		value: "canceled",
		label: "Canceled",
		icon: CircleOff,
	},
];

export const priorities = [
	{
		label: "Low",
		value: "low",
		icon: ArrowDown,
	},
	{
		label: "Medium",
		value: "medium",
		icon: ArrowRight,
	},
	{
		label: "High",
		value: "high",
		icon: ArrowUp,
	},
];

export function getBooleanFilterOptions() {
	return [
		{ label: "Sí", value: "true" },
		{ label: "No", value: "false" },
	];
}

export function getMaterialFilterOptions(
	products: MappedProduct[],
): Array<{ label: string; value: string }> {
	const uniqueMaterials = Array.from(new Set(products.map((p) => p.material)));
	return uniqueMaterials.map((material) => ({
		label: material,
		value: material,
	}));
}

export function getTipoFilterOptions(
	products: MappedProduct[],
): Array<{ label: string; value: string }> {
	const uniqueTipos = Array.from(new Set(products.map((p) => p.tipo)));
	return uniqueTipos.map((tipo) => ({
		label: tipo,
		value: tipo,
	}));
}

export function getPrescriptionRangeFilterOptions(
	products: MappedProduct[],
): Array<{ label: string; value: string }> {
	const uniqueCodes = Array.from(
		new Set(products.map((p) => p.prescriptionRangeCode)),
	);
	return uniqueCodes.map((code) => {
		const product = products.find((p) => p.prescriptionRangeCode === code);
		return {
			label: product?.prescriptionRangeDescription ?? code,
			value: code,
		};
	});
}
