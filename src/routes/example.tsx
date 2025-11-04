import { createFileRoute } from "@tanstack/react-router";
import { columns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { useProducts } from "@/hooks/use-products";

export const Route = createFileRoute("/example")({
	component: Page,
});

function Page() {
	const { products, errorProducts, isLoadingProducts } = useProducts();

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
			<div className="flex items-center justify-between gap-2 mb-4">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-semibold tracking-tight">Productos</h2>
					<p className="text-muted-foreground">
						Lista de productos disponibles en el catálogo.
					</p>
				</div>
			</div>
			<DataTable data={products} columns={columns as any} />
		</div>
	);
}
