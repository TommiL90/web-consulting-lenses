"use no memo";

import type { ColumnDef } from "@tanstack/react-table";
import type { MappedProduct } from "@/hooks/use-products";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDeliveryDays } from "@/lib/formatters";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { LENS_FEATURES } from "@/features/lenses/constants";
import type { LensFeatureKey } from "@/features/lenses/types";

const FEATURE_CONFIG: Record<LensFeatureKey, (typeof LENS_FEATURES)[number]> =
	LENS_FEATURES.reduce(
		(acc, feature) => {
			acc[feature.key] = feature;
			return acc;
		},
		{} as Record<LensFeatureKey, (typeof LENS_FEATURES)[number]>,
	);

export const quoteColumns: ColumnDef<MappedProduct>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Producto" />
		),
		cell: ({ row }) => {
			const product = row.original;
			return (
				<div className="flex flex-col gap-1">
					<span className="font-medium text-sm">{product.name}</span>
					<span className="text-muted-foreground text-xs">{product.sku}</span>
				</div>
			);
		},
		enableSorting: false,
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
		enableSorting: false,
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
		enableSorting: false,
	},
	{
		id: "features",
		header: "Características",
		cell: ({ row }) => {
			const activeFeatures = Object.entries({
				hasAntiReflective: row.original.hasAntiReflective,
				hasBlueFilter: row.original.hasBlueFilter,
				isPhotochromic: row.original.isPhotochromic,
				hasUVProtection: row.original.hasUVProtection,
				isPolarized: row.original.isPolarized,
				isMirrored: row.original.isMirrored,
			}).filter(([, value]) => value === true) as Array<[LensFeatureKey, true]>;

			if (!activeFeatures.length) {
				return (
					<span className="text-muted-foreground text-xs">
						Sin características especiales
					</span>
				);
			}

			return (
				<div className="flex flex-wrap gap-1">
					{activeFeatures.map(([key]) => (
						<Badge
							key={key}
							title={FEATURE_CONFIG[key].description}
							variant="secondary"
						>
							{FEATURE_CONFIG[key].label}
						</Badge>
					))}
				</div>
			);
		},
		enableSorting: false,
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
		accessorKey: "deliveryDays",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Entrega" />
		),
		cell: ({ row }) => (
			<div className="text-sm">
				{formatDeliveryDays(row.getValue("deliveryDays"))}
			</div>
		),
	},
	{
		accessorKey: "observations",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Observaciones" />
		),
		cell: ({ row }) => {
			const value = row.getValue("observations") as string | null | undefined;
			if (!value) {
				return (
					<span className="text-muted-foreground text-xs">
						Sin observaciones
					</span>
				);
			}
			return <span className="text-sm">{value}</span>;
		},
		enableSorting: false,
	},
];
