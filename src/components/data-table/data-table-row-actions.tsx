"use no memo";

import type { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
	onEdit?: (id: string) => void;
	onDelete?: (id: string) => void;
}

export function DataTableRowActions<TData>({
	row,
	onEdit,
	onDelete,
}: DataTableRowActionsProps<TData>) {
	const data = row.original as { id: string };

	const handleEdit = () => {
		onEdit?.(data.id);
	};

	const handleDelete = () => {
		onDelete?.(data.id);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="data-[state=open]:bg-muted size-8"
				>
					<MoreHorizontal />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[160px]">
				<DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive" onClick={handleDelete}>
					Delete
					<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
