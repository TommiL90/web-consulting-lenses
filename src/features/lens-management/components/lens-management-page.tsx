import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  FRAME_TYPES,
  FRAME_TYPE_LABELS,
  LENS_FEATURES,
  LENS_MATERIALS,
  LENS_TYPES,
  MATERIAL_LABELS,
  LENS_TYPE_LABELS,
} from "@/features/lenses/constants";
import {
  useCreateLensProductMutation,
  useDeleteLensProductMutation,
  useLensProductsQuery,
  usePrescriptionRangesQuery,
  useUpdateLensProductMutation,
} from "@/features/lenses/api/hooks";
import type {
  LensProduct,
  LensFeatureKey,
  PrescriptionRange,
} from "@/features/lenses/types";
import type { LensProductFormValues } from "@/features/lenses/schemas";
import { LensProductForm } from "@/features/lens-management/components/lens-product-form";
import { formatCurrency, formatDeliveryDays } from "@/lib/formatters";
import { isApiError } from "@/lib/api-client";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

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

const FEATURE_LOOKUP: Record<
  LensFeatureKey,
  (typeof LENS_FEATURES)[number]
> = LENS_FEATURES.reduce(
  (acc, feature) => {
    acc[feature.key] = feature;
    return acc;
  },
  {} as Record<LensFeatureKey, (typeof LENS_FEATURES)[number]>,
);

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

function mapProductToFormValues(product: LensProduct): Partial<LensProductFormValues> {
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
  const [filters, setFilters] = useState({ search: "", sku: "" });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sheetState, setSheetState] = useState<SheetState | null>(null);
  const [productToDelete, setProductToDelete] = useState<LensProduct | null>(null);

  const { data: products = [], isLoading, error: productsError } = useLensProductsQuery();
  const { data: ranges = [], isLoading: rangesLoading } = usePrescriptionRangesQuery();

  const createMutation = useCreateLensProductMutation();
  const updateMutation = useUpdateLensProductMutation();
  const deleteMutation = useDeleteLensProductMutation();

  const rangeById = useMemo(() => {
    return ranges.reduce<Record<string, PrescriptionRange>>((acc, range) => {
      acc[range.id] = range;
      return acc;
    }, {});
  }, [ranges]);

  const filteredData = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();
    const normalizedSku = filters.sku.trim().toLowerCase();

    return products.filter((product) => {
      const matchesName =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch);
      const matchesSku =
        normalizedSku.length === 0 ||
        product.sku.toLowerCase().includes(normalizedSku);
      return matchesName && matchesSku;
    });
  }, [filters.search, filters.sku, products]);

  const columns = useMemo<ColumnDef<LensProduct>[]>(
    () => [
      {
        header: "Producto",
        accessorKey: "name",
        cell: ({ row }) => {
          const product = row.original;
          const activeFeatures = Object.entries(
            product.features,
          ).filter(([_, value]) => value === true) as Array<
            [LensFeatureKey, true]
          >;

          return (
            <div className="flex flex-col gap-2">
              <div>
                <p className="font-medium text-sm">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.sku}</p>
              </div>
              {activeFeatures.length ? (
                <div className="flex flex-wrap gap-1">
                  {activeFeatures.map(([key]) => (
                    <Badge key={key} variant="secondary">
                      {FEATURE_LOOKUP[key].label}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          );
        },
      },
      {
        header: "Material",
        accessorKey: "material",
        cell: ({ getValue }) => (
          <span className="text-sm font-medium">
            {MATERIAL_LABELS[getValue() as keyof typeof MATERIAL_LABELS]}
          </span>
        ),
      },
      {
        header: "Tipo",
        accessorKey: "tipo",
        cell: ({ getValue }) => (
          <span className="text-sm">
            {LENS_TYPE_LABELS[getValue() as keyof typeof LENS_TYPE_LABELS]}
          </span>
        ),
      },
      {
        header: "Marco",
        accessorKey: "frameType",
        cell: ({ getValue }) => (
          <span className="text-sm">
            {FRAME_TYPE_LABELS[getValue() as keyof typeof FRAME_TYPE_LABELS]}
          </span>
        ),
      },
      {
        header: "Precio final",
        accessorFn: (row) => row.pricing.finalPrice,
        cell: ({ getValue, row }) => (
          <div className="flex flex-col text-sm font-medium">
            <span>{formatCurrency(getValue<number>())}</span>
            <span className="text-xs text-muted-foreground">
              Base {formatCurrency(row.original.pricing.basePrice)}
            </span>
          </div>
        ),
      },
      {
        header: "Entrega",
        accessorKey: "deliveryDays",
        cell: ({ getValue }) => (
          <span className="text-sm">{formatDeliveryDays(getValue<number>())}</span>
        ),
      },
      {
        header: "Rango",
        accessorKey: "prescriptionRangeId",
        cell: ({ getValue }) => {
          const rangeId = getValue<string>();
          const range = rangeById[rangeId];
          return (
            <span className="text-sm font-medium">
              {range ? `${range.code}` : "—"}
            </span>
          );
        },
      },
      {
        header: "Estado",
        accessorKey: "available",
        cell: ({ getValue }) => {
          const available = getValue<boolean>();
          return available ? (
            <Badge className="w-fit" variant="secondary">
              Disponible
            </Badge>
          ) : (
            <Badge className="w-fit" variant="outline">
              Pausado
            </Badge>
          );
        },
      },
      {
        header: "Acciones",
        id: "actions",
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  setSheetState({
                    mode: "edit",
                    product,
                    initialValues: mapProductToFormValues(product),
                  })
                }
              >
                <Pencil className="size-4" />
                <span className="sr-only">Editar</span>
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => setProductToDelete(product)}
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Eliminar</span>
              </Button>
            </div>
          );
        },
      },
    ],
    [rangeById],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending;

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

  const totalRows = filteredData.length;
  const totalProducts = products.length;
  const pageFrom = pagination.pageIndex * pagination.pageSize + 1;
  const pageTo = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    totalRows,
  );

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
        <CardHeader className="flex flex-col gap-2">
          <CardTitle>Listado de productos</CardTitle>
          <CardDescription>
            Usa los filtros rápidos para encontrar productos por nombre o SKU.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Buscar por nombre..."
              value={filters.search}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  search: event.target.value,
                }))
              }
            />
            <Input
              placeholder="Buscar por SKU..."
              value={filters.sku}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  sku: event.target.value,
                }))
              }
            />
          </div>

          <div className="rounded-lg border">
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
            ) : totalProducts === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
                <p className="font-medium">Aún no hay productos cargados.</p>
                <p className="text-sm text-muted-foreground">
                  Usa el botón “Agregar nuevo lente” para cargar el primer
                  producto.
                </p>
              </div>
            ) : totalRows === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
                <p className="font-medium">Sin resultados</p>
                <p className="text-sm text-muted-foreground">
                  Ajusta los filtros o limpia la búsqueda para ver más
                  productos.
                </p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="align-top">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex flex-col items-start justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center">
                  <span>
                    Mostrando {pageFrom} – {pageTo} de {totalRows} productos
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
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
