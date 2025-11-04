import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { columns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import type { Task } from "@/components/data-table/schema";
import { useProducts } from "@/hooks/use-products";
import { apiFetch } from "@/lib/api-client";
import tasksData from "../../tasks.json";

export const Route = createFileRoute("/example")({
	component: Page,
});

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

type ProductsResponse = {
	products: Product[];
};

function Page() {
	const { products, errorProducts, isLoadingProducts } = useProducts();

	const tasks = tasksData as Task[];

	if (isLoadingProducts) return <div className="p-6">Cargando...</div>;
	if (errorProducts)
		return (
			<div className="p-6">
				Error:{" "}
				{errorProducts instanceof Error
					? errorProducts.message
					: "Error desconocido"}
			</div>
		);

	return (
		<div className="p-6">
			<h2 className="text-xl font-semibold mb-4">Productos</h2>
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-semibold tracking-tight">
						Welcome back!
					</h2>
					<p className="text-muted-foreground">
						Here&apos;s a list of your tasks for this month.
					</p>
				</div>
			</div>
			<DataTable data={tasks} columns={columns} />
			<pre className="text-sm bg-muted p-4 rounded overflow-auto">
				{JSON.stringify(products, null, 2)}
			</pre>
		</div>
	);
}
