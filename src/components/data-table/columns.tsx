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
		cell: ({ row }) => <div>{row.getValue("prescriptionRangeCode")}</div>,
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
		accessorKey: "hasAntiReflective",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="AR" />
		),
		cell: ({ row }) => (
			<div>{row.getValue("hasAntiReflective") ? "Sí" : "No"}</div>
		),
		filterFn: (row, id, value) => {
			const boolValue = row.getValue(id) as boolean;
			return value.some((val: string) => {
				if (val === "true") return boolValue === true;
				if (val === "false") return boolValue === false;
				return false;
			});
		},
	},
	{
		accessorKey: "hasBlueFilter",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="FA" />
		),
		cell: ({ row }) => <div>{row.getValue("hasBlueFilter") ? "Sí" : "No"}</div>,
		filterFn: (row, id, value) => {
			const boolValue = row.getValue(id) as boolean;
			return value.some((val: string) => {
				if (val === "true") return boolValue === true;
				if (val === "false") return boolValue === false;
				return false;
			});
		},
	},
	{
		accessorKey: "isPhotochromic",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="FC" />
		),
		cell: ({ row }) => (
			<div>{row.getValue("isPhotochromic") ? "Sí" : "No"}</div>
		),
		filterFn: (row, id, value) => {
			const boolValue = row.getValue(id) as boolean;
			return value.some((val: string) => {
				if (val === "true") return boolValue === true;
				if (val === "false") return boolValue === false;
				return false;
			});
		},
	},
	{
		accessorKey: "hasUVProtection",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="UV" />
		),
		cell: ({ row }) => (
			<div>{row.getValue("hasUVProtection") ? "Sí" : "No"}</div>
		),
		filterFn: (row, id, value) => {
			const boolValue = row.getValue(id) as boolean;
			return value.some((val: string) => {
				if (val === "true") return boolValue === true;
				if (val === "false") return boolValue === false;
				return false;
			});
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
		cell: ({ row }) => <div>{formatCurrency(row.getValue("basePrice"))}</div>,
	},
	{
		accessorKey: "finalPrice",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Precio final" />
		),
		cell: ({ row }) => <div>{formatCurrency(row.getValue("finalPrice"))}</div>,
	},
	{
		accessorKey: "observations",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Observaciones" />
		),
		cell: ({ row }) => <div>{row.getValue("observations") || "-"}</div>,
	},
	{
		accessorKey: "prescriptionRangeCode",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Rango de prescripción" />
		),
		cell: ({ row }) => <div>{row.getValue("prescriptionRangeCode")}</div>,
		filterFn: (row, id, value) => {
			const cellValue = row.getValue(id) as string;
			if (!value || typeof value !== "string") return true;
			return cellValue.toLowerCase().includes(value.toLowerCase());
		},
	},
	{
		id: "actions",
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
];