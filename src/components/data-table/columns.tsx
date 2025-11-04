"use no memo";

import type { ColumnDef } from "@tanstack/react-table";
import type { MappedProduct } from "@/hooks/use-products";
import { formatCurrency } from "@/lib/formatters";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<MappedProduct>[] = [
	// {
	// 	accessorKey: "sku",
	// 	header: ({ column }) => (
	// 		<DataTableColumnHeader column={column} title="SKU" />
	// 	),
	// 	cell: ({ row }) => <div>{row.getValue("sku")}</div>,
	// },
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Nombre" />
		),
		cell: ({ row }) => <div>{row.getValue("name")}</div>,
		enableSorting: false,
	},
	{
		accessorKey: "prescriptionRangeCode",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Rango" />
		),
		cell: ({ row }) => (
			<div className="bg-fuchsia-300 dark:bg-fuchsia-600 text-gray-900 dark:text-white font-bold px-3 py-2 -mx-3 -my-2 rounded">
				{row.getValue("prescriptionRangeCode")}
			</div>
		),
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: "material",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Material" />
		),
		cell: ({ row }) => <div>{row.getValue("material")}</div>,
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: "tipo",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Tipo" />
		),
		cell: ({ row }) => <div>{row.getValue("tipo")}</div>,
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		id: "hasAntiReflective",
		accessorFn: (row) => String(row.hasAntiReflective),
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="AR" />
		),
		cell: ({ row }) => (
			<div>{row.original.hasAntiReflective ? "Sí" : "No"}</div>
		),
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		id: "hasBlueFilter",
		accessorFn: (row) => String(row.hasBlueFilter),
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="FA" />
		),
		cell: ({ row }) => (
			<div>{row.original.hasBlueFilter ? "Sí" : "No"}</div>
		),
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		id: "isPhotochromic",
		accessorFn: (row) => String(row.isPhotochromic),
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="FC" />
		),
		cell: ({ row }) => (
			<div>{row.original.isPhotochromic ? "Sí" : "No"}</div>
		),
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		id: "hasUVProtection",
		accessorFn: (row) => String(row.hasUVProtection),
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="UV" />
		),
		cell: ({ row }) => (
			<div>{row.original.hasUVProtection ? "Sí" : "No"}</div>
		),
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	// {
	// 	accessorKey: "isPolarized",
	// 	header: ({ column }) => (
	// 		<DataTableColumnHeader column={column} title="Polarizado" />
	// 	),
	// 	cell: ({ row }) => <div>{row.getValue("isPolarized") ? "Sí" : "No"}</div>,
	// 	filterFn: (row, id, value) => {
	// 		const boolValue = row.getValue(id) as boolean;
	// 		return value.some((val: string) => {
	// 			if (val === "true") return boolValue === true;
	// 			if (val === "false") return boolValue === false;
	// 			return false;
	// 		});
	// 	},
	// },
	// {
	// 	accessorKey: "isMirrored",
	// 	header: ({ column }) => (
	// 		<DataTableColumnHeader column={column} title="Espejado" />
	// 	),
	// 	cell: ({ row }) => <div>{row.getValue("isMirrored") ? "Sí" : "No"}</div>,
	// 	filterFn: (row, id, value) => {
	// 		const boolValue = row.getValue(id) as boolean;
	// 		return value.some((val: string) => {
	// 			if (val === "true") return boolValue === true;
	// 			if (val === "false") return boolValue === false;
	// 			return false;
	// 		});
	// 	},
	// },
	{
		accessorKey: "basePrice",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Precio base" />
		),
		cell: ({ row }) => (
			<div className="bg-yellow-300 dark:bg-yellow-500 text-gray-900 dark:text-gray-900 font-bold tabular-nums px-3 py-2 -mx-3 -my-2 rounded">
				{formatCurrency(row.getValue("basePrice"))}
			</div>
		),
	},
	{
		accessorKey: "finalPrice",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Precio final" />
		),
		cell: ({ row }) => (
			<div className="bg-lime-300 dark:bg-lime-400 text-gray-900 dark:text-gray-900 font-extrabold tabular-nums px-3 py-2 -mx-3 -my-2 rounded">
				{formatCurrency(row.getValue("finalPrice"))}
			</div>
		),
	},
	{
		accessorKey: "observations",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Observaciones" />
		),
		cell: ({ row }) => <div>{row.getValue("observations") || "-"}</div>,
	},
	{
		id: "actions",
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
];