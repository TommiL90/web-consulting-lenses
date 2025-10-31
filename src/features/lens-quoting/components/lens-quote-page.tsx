import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Loader2,
  PackageOpen,
  Search,
  ShieldAlert,
} from "lucide-react";
import { useMemo, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuoteLenses } from "@/features/lens-quoting/api/use-quote-lenses";
import {
  type QuoteFormValues,
  quoteFormSchema,
} from "@/features/lens-quoting/schemas";
import {
  FRAME_TYPE_LABELS,
  FRAME_TYPES,
  LENS_FEATURES,
  LENS_MATERIALS,
  LENS_TYPE_LABELS,
  LENS_TYPES,
  MATERIAL_LABELS,
} from "@/features/lenses/constants";
import type {
  LensFeatureKey,
  LensMaterial,
  LensProduct,
  LensType,
} from "@/features/lenses/types";
import { isApiError } from "@/lib/api-client";
import { formatCurrency, formatDeliveryDays } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const FEATURE_CONFIG: Record<LensFeatureKey, (typeof LENS_FEATURES)[number]> =
  LENS_FEATURES.reduce(
    (acc, feature) => {
      acc[feature.key] = feature;
      return acc;
    },
    {} as Record<LensFeatureKey, (typeof LENS_FEATURES)[number]>
  );

function getQuoteErrorMessage(error: unknown) {
  if (isApiError(error)) {
    switch (error.code) {
      case "PRESCRIPTION_RANGE_NOT_FOUND":
        return "No encontramos un rango de receta que cubra los valores ingresados. Revisa la receta o consulta a soporte.";
      case "VALIDATION_ERROR":
        return "Hay datos inválidos en la receta. Revisa los campos e intenta nuevamente.";
      default:
        return error.message || "No pudimos generar la cotización.";
    }
  }

  return "No pudimos generar la cotización. Intenta nuevamente.";
}

function QuoteResultsTable({ data }: { data: LensProduct[] }) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "finalPrice", desc: false },
  ]);

  const columns = useMemo<ColumnDef<LensProduct>[]>(
    () => [
      {
        header: "Producto",
        accessorKey: "name",
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex flex-col gap-1">
              <span className="font-medium text-sm">{product.name}</span>
              <span className="text-muted-foreground text-xs">
                {product.sku}
              </span>
            </div>
          );
        },
      },
      {
        header: "Material",
        accessorKey: "material",
        cell: ({ getValue }) => (
          <span className="font-medium text-sm">
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
        id: "features",
        header: "Características",
        cell: ({ row }) => {
          const features = row.original.features;

          const activeFeatures = Object.entries(features).filter(
            ([, value]) => value === true
          ) as Array<[LensFeatureKey, true]>;

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
      },
      {
        id: "finalPrice",
        header: ({ column }) => {
          const sorted = column.getIsSorted();
          return (
            <button
              className="flex w-full items-center justify-end gap-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide transition hover:text-foreground"
              onClick={column.getToggleSortingHandler()}
              type="button"
            >
              Precio final
              <ArrowUpDown
                className={cn(
                  "size-3 transition",
                  sorted === "asc" && "-rotate-180 text-foreground",
                  sorted === "desc" && "text-foreground"
                )}
              />
            </button>
          );
        },
        accessorFn: (row) => row.pricing.finalPrice,
        cell: ({ getValue, row }) => {
          const finalPrice = getValue<number>();
          const basePrice = row.original.pricing.basePrice;
          return (
            <div className="flex flex-col text-right">
              <span className="font-semibold text-sm">
                {formatCurrency(finalPrice)}
              </span>
              <span className="text-muted-foreground text-xs">
                Base {formatCurrency(basePrice)}
              </span>
            </div>
          );
        },
      },
      {
        header: "Entrega",
        accessorKey: "deliveryDays",
        cell: ({ getValue }) => (
          <div className="text-sm">
            {formatDeliveryDays(getValue<number>())}
          </div>
        ),
      },
      {
        header: "Observaciones",
        accessorKey: "observations",
        cell: ({ getValue }) => {
          const value = getValue<string | null>();
          if (!value) {
            return (
              <span className="text-muted-foreground text-xs">
                Sin observaciones
              </span>
            );
          }
          return <span className="text-sm">{value}</span>;
        },
      },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  className={cn(
                    "font-semibold text-muted-foreground text-xs uppercase tracking-wide",
                    header.column.id === "finalPrice" && "text-right"
                  )}
                  key={header.id}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
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
                <TableCell
                  className={cn(
                    "align-top",
                    cell.column.id === "finalPrice" && "text-right"
                  )}
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function LensQuotePage() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const quoteMutation = useQuoteLenses();

  const resolver = zodResolver(
    quoteFormSchema as any
  ) as Resolver<QuoteFormValues>;

  const form = useForm<QuoteFormValues>({
    resolver,
    defaultValues: {
      prescription: {
        od: { sphere: undefined, cylinder: undefined },
        oi: { sphere: undefined, cylinder: undefined },
      },
      filters: {
        frameType: "cerrado",
        hasAntiReflective: false,
        hasBlueFilter: false,
        isPhotochromic: false,
        isPolarized: false,
      },
    },
  });

  const { data, isPending, error } = quoteMutation;

  const handleSubmit = (values: QuoteFormValues) => {
    setHasSubmitted(true);
    quoteMutation.mutate(values, {
      onSuccess: (result) => {
        toast.success(
          `Cotización generada: ${result.meta.totalResults} resultado(s) encontrados.`
        );
      },
      onError: (mutationError) => {
        toast.error(getQuoteErrorMessage(mutationError));
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="font-semibold text-2xl">Cotizador de lentes</h1>
        <p className="text-muted-foreground">
          Ingresa la receta del cliente y filtra por características para
          encontrar los lentes compatibles.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Receta y filtros</CardTitle>
            <CardDescription>
              Los valores deben avanzar de 0.25 en 0.25. El tipo de armazón es
              obligatorio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="flex flex-col gap-6"
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                <section className="grid gap-4">
                  <div>
                    <h2 className="font-medium text-muted-foreground text-sm uppercase">
                      Ojo derecho (OD)
                    </h2>
                    <div className="grid gap-4 pt-2 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="prescription.od.sphere"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Esfera</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                inputMode="decimal"
                                onChange={(event) =>
                                  field.onChange(event.target.value)
                                }
                                step={0.25}
                                type="number"
                                value={
                                  field.value === undefined ||
                                  Number.isNaN(field.value)
                                    ? ""
                                    : field.value
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="prescription.od.cylinder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cilindro</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                inputMode="decimal"
                                onChange={(event) =>
                                  field.onChange(event.target.value)
                                }
                                step={0.25}
                                type="number"
                                value={
                                  field.value === undefined ||
                                  Number.isNaN(field.value)
                                    ? ""
                                    : field.value
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <h2 className="font-medium text-muted-foreground text-sm uppercase">
                      Ojo izquierdo (OI)
                    </h2>
                    <div className="grid gap-4 pt-2 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="prescription.oi.sphere"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Esfera</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                inputMode="decimal"
                                onChange={(event) =>
                                  field.onChange(event.target.value)
                                }
                                step={0.25}
                                type="number"
                                value={
                                  field.value === undefined ||
                                  Number.isNaN(field.value)
                                    ? ""
                                    : field.value
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="prescription.oi.cylinder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cilindro</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                inputMode="decimal"
                                onChange={(event) =>
                                  field.onChange(event.target.value)
                                }
                                step={0.25}
                                type="number"
                                value={
                                  field.value === undefined ||
                                  Number.isNaN(field.value)
                                    ? ""
                                    : field.value
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </section>

                <section className="grid gap-4">
                  <div>
                    <h2 className="font-medium text-muted-foreground text-sm uppercase">
                      Tipo de armazón
                    </h2>
                    <FormField
                      control={form.control}
                      name="filters.frameType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Armazón</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tipo de armazón" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {FRAME_TYPES.map((frameType) => (
                                <SelectItem key={frameType} value={frameType}>
                                  {FRAME_TYPE_LABELS[frameType]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Obligatorio para ajustar la búsqueda a la montura.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="filters.material"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Material</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(
                                value === "all"
                                  ? undefined
                                  : (value as LensMaterial)
                              )
                            }
                            value={(field.value ?? "all") as string}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Todos los materiales" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">Todos</SelectItem>
                              {LENS_MATERIALS.map((material) => (
                                <SelectItem key={material} value={material}>
                                  {MATERIAL_LABELS[material]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="filters.tipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de lente</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(
                                value === "all"
                                  ? undefined
                                  : (value as LensType)
                              )
                            }
                            value={(field.value ?? "all") as string}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Todos los tipos" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">Todos</SelectItem>
                              {LENS_TYPES.map((lensType) => (
                                <SelectItem key={lensType} value={lensType}>
                                  {LENS_TYPE_LABELS[lensType]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-3">
                    <h2 className="font-medium text-muted-foreground text-sm uppercase">
                      Características adicionales
                    </h2>
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="filters.hasAntiReflective"
                        render={({ field }) => (
                          <FormItem className="flex items-start gap-3 space-y-0 rounded-md border p-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) =>
                                  field.onChange(Boolean(checked))
                                }
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel className="font-medium text-sm">
                                Antirreflejo
                              </FormLabel>
                              <FormDescription>
                                Muestra solo lentes con tratamiento
                                antirreflejo.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="filters.hasBlueFilter"
                        render={({ field }) => (
                          <FormItem className="flex items-start gap-3 space-y-0 rounded-md border p-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) =>
                                  field.onChange(Boolean(checked))
                                }
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel className="font-medium text-sm">
                                Filtro azul
                              </FormLabel>
                              <FormDescription>
                                Lentes con protección frente a pantallas.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="filters.isPhotochromic"
                        render={({ field }) => (
                          <FormItem className="flex items-start gap-3 space-y-0 rounded-md border p-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) =>
                                  field.onChange(Boolean(checked))
                                }
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel className="font-medium text-sm">
                                Fotocromático
                              </FormLabel>
                              <FormDescription>
                                Lentes que se adaptan a la luz del sol.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="filters.isPolarized"
                        render={({ field }) => (
                          <FormItem className="flex items-start gap-3 space-y-0 rounded-md border p-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) =>
                                  field.onChange(Boolean(checked))
                                }
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel className="font-medium text-sm">
                                Polarizado
                              </FormLabel>
                              <FormDescription>
                                Ideal para exteriores y reducción de reflejos.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </section>

                <Button className="w-full" disabled={isPending} type="submit">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Cotizando...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 size-4" />
                      Cotizar lentes
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          {data ? (
            <Card>
              <CardHeader className="space-y-2">
                <CardTitle>Cotización generada</CardTitle>
                <CardDescription>
                  Usando el rango {data.meta.prescriptionRangeUsed.code} (
                  {data.meta.prescriptionRangeUsed.description})
                </CardDescription>
                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="rounded-md border bg-muted/50 px-3 py-2">
                    <span className="font-medium">
                      {data.meta.totalResults}{" "}
                      {data.meta.totalResults === 1
                        ? "resultado"
                        : "resultados"}
                    </span>
                  </div>
                  <div className="rounded-md border bg-muted/50 px-3 py-2">
                    <span className="text-muted-foreground text-xs uppercase">
                      Prescripción usada
                    </span>
                    <div className="mt-1 grid gap-1 text-sm">
                      <span>
                        OD: Esf{" "}
                        {data.meta.normalizedPrescription.od.sphere.toFixed(2)}{" "}
                        / Cil{" "}
                        {data.meta.normalizedPrescription.od.cylinder.toFixed(
                          2
                        )}
                      </span>
                      <span>
                        OI: Esf{" "}
                        {data.meta.normalizedPrescription.oi.sphere.toFixed(2)}{" "}
                        / Cil{" "}
                        {data.meta.normalizedPrescription.oi.cylinder.toFixed(
                          2
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ) : null}

          <div className="flex-1 rounded-lg border border-dashed">
            {isPending ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
                <Loader2 className="size-6 animate-spin text-primary" />
                <p className="font-medium">Generando cotización...</p>
                <p className="text-muted-foreground text-sm">
                  Estamos buscando los lentes compatibles con la receta.
                </p>
              </div>
            ) : error && hasSubmitted ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
                <ShieldAlert className="size-8 text-destructive" />
                <p className="font-medium">
                  No pudimos completar la cotización
                </p>
                <p className="text-muted-foreground text-sm">
                  {getQuoteErrorMessage(error)}
                </p>
              </div>
            ) : data && data.results.length > 0 ? (
              <div className="flex flex-col gap-3 p-4">
                <QuoteResultsTable data={data.results} />
              </div>
            ) : hasSubmitted ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
                <PackageOpen className="size-8 text-muted-foreground" />
                <p className="font-medium">No encontramos productos</p>
                <p className="text-muted-foreground text-sm">
                  Ajusta la receta o relaja los filtros para ver más opciones.
                </p>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
                <Search className="size-8 text-muted-foreground" />
                <p className="font-medium">
                  Completa la receta para generar una cotización
                </p>
                <p className="text-muted-foreground text-sm">
                  Ingresaremos la receta, normalizaremos los valores y
                  encontraremos el mejor rango automáticamente.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
