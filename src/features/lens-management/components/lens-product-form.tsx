import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
  lensProductFormSchema,
  type LensProductFormValues,
} from "@/features/lenses/schemas";
import type { PrescriptionRange } from "@/features/lenses/types";

type LensProductFormProps = {
  defaultValues: Partial<LensProductFormValues>;
  onSubmit: (values: LensProductFormValues) => void;
  onCancel?: () => void;
  isSubmitting: boolean;
  submitLabel: string;
  ranges: PrescriptionRange[];
};

export function LensProductForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
  ranges,
}: LensProductFormProps) {
  const resolver = zodResolver(lensProductFormSchema as any) as Resolver<LensProductFormValues>;

  const form = useForm<LensProductFormValues>({
    resolver,
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <section className="grid gap-4">
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ej: ORG-AR-4242-CERRADO"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre comercial</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej: Orgánico antirreflejo azul" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un material" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de lente</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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

            <FormField
              control={form.control}
              name="frameType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de armazón</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un armazón" />
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="costPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio costo (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step="100"
                      value={field.value ?? ""}
                      onChange={(event) => field.onChange(event.target.value)}
                    />
                  </FormControl>
                  <FormDescription>
                    Solo referencia interna. Se guarda como número entero.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio base</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step="100"
                      value={
                        field.value === undefined ? "" : field.value
                      }
                      onChange={(event) => field.onChange(event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="finalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio final</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step="100"
                      value={
                        field.value === undefined ? "" : field.value
                      }
                      onChange={(event) => field.onChange(event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Días de entrega</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step="1"
                      value={
                        field.value === undefined ? "" : field.value
                      }
                      onChange={(event) => field.onChange(event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="grid gap-3">
          <h3 className="text-sm font-medium uppercase text-muted-foreground">
            Características
          </h3>
          <div className="grid gap-2">
            {LENS_FEATURES.map(({ key, label, description }) => (
              <FormField
                key={key}
                control={form.control}
                name={key as keyof LensProductFormValues}
                render={({ field }) => (
                  <FormItem className="flex items-start gap-3 space-y-0 rounded-md border p-3">
                    <FormControl>
                      <Checkbox
                        checked={Boolean(field.value)}
                        onCheckedChange={(checked) =>
                          field.onChange(Boolean(checked))
                        }
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="text-sm font-medium">
                        {label}
                      </FormLabel>
                      <FormDescription>{description}</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <FormField
            control={form.control}
            name="prescriptionRangeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rango de prescripción</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rango" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ranges.map((range) => (
                      <SelectItem key={range.id} value={range.id}>
                        {range.code} — {range.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Determina para qué receta aplica este producto.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="available"
            render={({ field }) => (
              <FormItem className="flex items-start gap-3 space-y-0 rounded-md border p-3">
                <FormControl>
                  <Checkbox
                    checked={Boolean(field.value)}
                    onCheckedChange={(checked) =>
                      field.onChange(Boolean(checked))
                    }
                  />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-medium">
                    Disponible para venta
                  </FormLabel>
                  <FormDescription>
                    Desmarca para ocultar temporalmente este producto del
                    cotizador.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="observations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observaciones</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Notas internas o condiciones de despacho"
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          {onCancel ? (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          ) : null}
          <Button disabled={isSubmitting} type="submit">
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
