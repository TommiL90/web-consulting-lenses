import type { Row } from "@tanstack/react-table";
import { Loader2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { columns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { LensProductForm } from "@/features/lens-management/components/lens-product-form";
import {
	useCreateLensProductMutation,
	useDeleteLensProductMutation,
	useLensProductsQuery,
	usePrescriptionRangesQuery,
	useUpdateLensProductMutation,
} from "@/features/lenses/api/hooks";
import {
	FRAME_TYPES,
	LENS_MATERIALS,
	LENS_TYPES,
} from "@/features/lenses/constants";
import type { LensProductFormValues } from "@/features/lenses/schemas";
import type { LensProduct } from "@/features/lenses/types";
import type { MappedProduct } from "@/hooks/use-products";
import { isApiError } from "@/lib/api-client";
import { mapProductToFlat } from "@/lib/helpers";

type SheetState =
	| {
			mode: "create";
			initialValues: Partial<LensProductFormValues>;
	  }
	| {
			mode: "edit";
			product: LensProduct;
			initialValues: Partial<LensProductFormValues>;
	  };

const INITIAL_FORM_VALUES: Partial<LensProductFormValues> = {
	sku: "",
	name: "",
	material: LENS_MATERIALS[0],
	tipo: LENS_TYPES[0],
	frameType: FRAME_TYPES[0],
	hasAntiReflective: false,
	hasBlueFilter: false,
	isPhotochromic: false,
	hasUVProtection: false,
	isPolarized: false,
	isMirrored: false,
	costPrice: null,
	basePrice: undefined,
	finalPrice: undefined,
	deliveryDays: undefined,
	observations: undefined,
	available: true,
	prescriptionRangeId: undefined,
};

function getErrorMessage(error: unknown, fallback: string) {
	if (isApiError(error)) {
		return error.message;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return fallback;
}

function mapProductToFormValues(
	product: LensProduct,
): Partial<LensProductFormValues> {
	return {
		sku: product.sku,
		name: product.name,
		material: product.material,
		tipo: product.tipo,
		frameType: product.frameType,
		hasAntiReflective: product.features.hasAntiReflective,
		hasBlueFilter: product.features.hasBlueFilter,
		isPhotochromic: product.features.isPhotochromic,
		hasUVProtection: product.features.hasUVProtection,
		isPolarized: product.features.isPolarized,
		isMirrored: product.features.isMirrored,
		costPrice: product.costPrice ?? null,
		basePrice: product.pricing.basePrice,
		finalPrice: product.pricing.finalPrice,
		deliveryDays: product.deliveryDays,
		observations: product.observations ?? undefined,
		available: product.available,
		prescriptionRangeId: product.prescriptionRangeId,
	};
}

export function LensManagementPage() {
	const [sheetState, setSheetState] = useState<SheetState | null>(null);
	const [productToDelete, setProductToDelete] = useState<LensProduct | null>(
		null,
	);

	const {
		data: lensProducts = [],
		isLoading,
		error: productsError,
	} = useLensProductsQuery();
	const { data: ranges = [], isLoading: rangesLoading } =
		usePrescriptionRangesQuery();

	const products = useMemo(() => {
		return lensProducts.map((product) => mapProductToFlat(product));
	}, [lensProducts]);

	const createMutation = useCreateLensProductMutation();
	const updateMutation = useUpdateLensProductMutation();
	const deleteMutation = useDeleteLensProductMutation();

	const managementColumns = useMemo(() => {
		return columns.map((col) => {
			if (col.id === "actions") {
				return {
					...col,
					cell: ({ row }: { row: Row<MappedProduct> }) => (
						<DataTableRowActions
							row={row}
							onEdit={(id) => {
								const product = lensProducts.find((p) => p.id === id);
								if (product) {
									setSheetState({
										mode: "edit",
										product,
										initialValues: mapProductToFormValues(product),
									});
								}
							}}
							onDelete={(id) => {
								const product = lensProducts.find((p) => p.id === id);
								if (product) setProductToDelete(product);
							}}
						/>
					),
				};
			}
			return col;
		});
	}, [columns, lensProducts]);

	const isSubmitting = createMutation.isPending || updateMutation.isPending;

	const handleCreateClick = () => {
		setSheetState({
			mode: "create",
			initialValues: {
				...INITIAL_FORM_VALUES,
				prescriptionRangeId: ranges[0]?.id ?? undefined,
			},
		});
	};

	const handleSheetClose = () => {
		setSheetState(null);
	};

	const handleFormSubmit = async (values: LensProductFormValues) => {
		try {
			if (sheetState?.mode === "create") {
				await createMutation.mutateAsync(values);
				toast.success("Lente creado correctamente.");
			} else if (sheetState?.mode === "edit") {
				await updateMutation.mutateAsync({
					id: sheetState.product.id,
					values,
				});
				toast.success("Lente actualizado correctamente.");
			}
			handleSheetClose();
		} catch (mutationError) {
			toast.error(
				getErrorMessage(
					mutationError,
					"No pudimos guardar el producto. Intenta nuevamente.",
				),
			);
		}
	};

	const handleConfirmDelete = async () => {
		if (!productToDelete) return;
		try {
			await deleteMutation.mutateAsync(productToDelete.id);
			toast.success("Producto eliminado.");
			setProductToDelete(null);
		} catch (mutationError) {
			toast.error(
				getErrorMessage(
					mutationError,
					"No pudimos eliminar el producto. Intenta más tarde.",
				),
			);
		}
	};

	const disableCreate = rangesLoading || ranges.length === 0;

	return (
		<div className="flex flex-col gap-6 p-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="font-semibold text-2xl">Gestión de lentes</h1>
					<p className="text-muted-foreground">
						Administra el catálogo disponible para el cotizador, controla la
						disponibilidad y actualiza precios cuando sea necesario.
					</p>
				</div>
				<Button disabled={disableCreate} onClick={handleCreateClick}>
					<Plus className="mr-2 size-4" />
					Agregar nuevo lente
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Listado de productos</CardTitle>
					<CardDescription>
						Usa los filtros de la tabla para encontrar productos específicos.

            <pre>
              <code>
                {JSON.stringify(ranges, null, 2)}
              </code>
            </pre>
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
							<Loader2 className="size-6 animate-spin text-primary" />
							<p className="font-medium">Cargando productos...</p>
						</div>
					) : productsError ? (
						<div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
							<p className="font-medium text-destructive">
								Error al cargar los productos
							</p>
							<p className="text-sm text-muted-foreground">
								{getErrorMessage(
									productsError,
									"Hubo un problema al cargar el listado.",
								)}
							</p>
						</div>
					) : lensProducts.length === 0 ? (
						<div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
							<p className="font-medium">Aún no hay productos cargados.</p>
							<p className="text-sm text-muted-foreground">
								Usa el botón "Agregar nuevo lente" para cargar el primer
								producto.
							</p>
						</div>
					) : (
						<DataTable data={products} columns={managementColumns} />
					)}
				</CardContent>
			</Card>

			<Sheet
				open={sheetState !== null}
				onOpenChange={(open) => {
					if (!open) {
						handleSheetClose();
					}
				}}
			>
				<SheetContent className="flex flex-col gap-0 sm:max-w-xl" side="right">
					<SheetHeader className="border-b p-4">
						<SheetTitle>
							{sheetState?.mode === "edit"
								? "Editar producto"
								: "Nuevo producto"}
						</SheetTitle>
						<SheetDescription>
							Completa los campos obligatorios para que el lente aparezca en el
							cotizador.
						</SheetDescription>
					</SheetHeader>
					<div className="flex-1 overflow-y-auto p-4">
						{sheetState ? (
							rangesLoading && ranges.length === 0 ? (
								<div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
									<Loader2 className="size-6 animate-spin text-primary" />
									<p className="text-sm text-muted-foreground">
										Cargando rangos de prescripción...
									</p>
								</div>
							) : (
								<LensProductForm
									defaultValues={sheetState.initialValues}
									onSubmit={handleFormSubmit}
									onCancel={handleSheetClose}
									isSubmitting={isSubmitting}
									submitLabel={
										sheetState.mode === "edit"
											? "Guardar cambios"
											: "Crear lente"
									}
									ranges={ranges}
								/>
							)
						) : null}
					</div>
				</SheetContent>
			</Sheet>

			<AlertDialog
				open={productToDelete !== null}
				onOpenChange={(open) => {
					if (!open) {
						setProductToDelete(null);
					}
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Eliminar este producto?</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción no se puede deshacer. El producto dejará de estar
							disponible en el cotizador.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={deleteMutation.isPending}>
							Cancelar
						</AlertDialogCancel>
						<AlertDialogAction
							disabled={deleteMutation.isPending}
							onClick={handleConfirmDelete}
						>
							{deleteMutation.isPending ? (
								<Loader2 className="mr-2 size-4 animate-spin" />
							) : null}
							Sí, eliminar
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
