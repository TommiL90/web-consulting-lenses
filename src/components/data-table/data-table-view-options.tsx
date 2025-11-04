"use no memo";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import type { Table } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "../ui/dropdown-menu";

const dictionaryNames = {
	sku: "SKU",
	name: "Nombre",
	material: "Material",
	tipo: "Tipo",
	hasAntiReflective: "Antirreflejo",
	hasBlueFilter: "Filtro Azul",
	isPhotochromic: "Fotocromático",
	hasUVProtection: "Protección UV",
	isPolarized: "Polarizado",
	isMirrored: "Espejado",
	basePrice: "Precio Base",
	finalPrice: "Precio Final",
	deliveryDays: "Días de Entrega",
	observations: "Observaciones",
	prescriptionRangeCode: "Rango de Prescripción",
} as const;

export function DataTableViewOptions<TData>({
	table,
}: {
	table: Table<TData>;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="ml-auto hidden h-8 lg:flex"
				>
					<Settings2 />
					Vista
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[200px]">
				<DropdownMenuLabel>Mostrar/Ocultar columnas</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{table
					.getAllColumns()
					.filter(
						(column) =>
							typeof column.accessorFn !== "undefined" && column.getCanHide(),
					)
					.map((column) => {
						return (
							<DropdownMenuCheckboxItem
								key={column.id}
								checked={column.getIsVisible()}
								onCheckedChange={(value) => column.toggleVisibility(!!value)}
							>
								{dictionaryNames[column.id as keyof typeof dictionaryNames] ??
									column.id}
							</DropdownMenuCheckboxItem>
						);
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
