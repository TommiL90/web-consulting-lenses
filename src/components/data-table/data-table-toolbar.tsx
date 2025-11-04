"use no memo";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import type { MappedProduct } from "@/hooks/use-products";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import {
	getBooleanFilterOptions,
	getMaterialFilterOptions,
	getPrescriptionRangeFilterOptions,
	getTipoFilterOptions,
} from "./helpers";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	data?: TData[];
}

export function DataTableToolbar<TData>({
	table,
	data,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;

	// Cast data to MappedProduct[] for helper functions
	const products = (data ?? []) as unknown as MappedProduct[];

	// Generate dynamic filter options
	const materialOptions = getMaterialFilterOptions(products);
	const tipoOptions = getTipoFilterOptions(products);
	const prescriptionRangeOptions = getPrescriptionRangeFilterOptions(products);
	const booleanOptions = getBooleanFilterOptions();

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center gap-2">
				<Input
					placeholder="Filtrar productos..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				{table.getColumn("prescriptionRangeCode") && (
					<DataTableFacetedFilter
						column={table.getColumn("prescriptionRangeCode")}
						title="Rango"
						options={prescriptionRangeOptions}
					/>
				)}
				{table.getColumn("tipo") && (
					<DataTableFacetedFilter
						column={table.getColumn("tipo")}
						title="Tipo"
						options={tipoOptions}
					/>
				)}
				{table.getColumn("material") && (
					<DataTableFacetedFilter
						column={table.getColumn("material")}
						title="Material"
						options={materialOptions}
					/>
				)}

				{table.getColumn("hasAntiReflective") && (
					<DataTableFacetedFilter
						column={table.getColumn("hasAntiReflective")}
						title="Antirreflejo"
						options={booleanOptions}
					/>
				)}
				{table.getColumn("hasBlueFilter") && (
					<DataTableFacetedFilter
						column={table.getColumn("hasBlueFilter")}
						title="Filtro Azul"
						options={booleanOptions}
					/>
				)}
				{table.getColumn("isPhotochromic") && (
					<DataTableFacetedFilter
						column={table.getColumn("isPhotochromic")}
						title="Fotocromático"
						options={booleanOptions}
					/>
				)}

				{isFiltered && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => table.resetColumnFilters()}
					>
						Reset
						<X />
					</Button>
				)}
			</div>
			<div className="flex items-center gap-2">
				<DataTableViewOptions table={table} />
			</div>
		</div>
	);
}
