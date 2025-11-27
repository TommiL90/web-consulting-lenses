import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PackageOpen, Search, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table/data-table";
import { quoteColumns } from "./quote-columns";
import { useQuoteLensesData } from "@/features/lens-quoting/api/use-quote-lenses";
import {
	type QuoteFormValues,
	type QuoteFormFields,
	quoteFormSchema,
} from "@/features/lens-quoting/schemas";
import { isApiError } from "@/lib/api-client";

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

function getFieldDisplayValue(value: unknown) {
	if (value === undefined || value === null) {
		return "";
	}

	if (typeof value === "number") {
		return Number.isNaN(value) ? "" : value;
	}

	if (typeof value === "string") {
		return value;
	}

	return "";
}

export function LensQuotePage() {
	const [hasSubmitted, setHasSubmitted] = useState(false);
	const { products, meta, isPending, error, mutate } = useQuoteLensesData();

	const form = useForm<QuoteFormFields, unknown, QuoteFormValues>({
		resolver: zodResolver(quoteFormSchema),
		defaultValues: {
			prescription: {
				od: { sphere: undefined, cylinder: undefined },
				oi: { sphere: undefined, cylinder: undefined },
			},
		},
	});

	const handleSubmit = (values: QuoteFormValues) => {
		setHasSubmitted(true);
		mutate(values, {
			onSuccess: (result) => {
				toast.success(
					`Cotización generada: ${result.meta.totalResults} resultado(s) encontrados.`,
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
					Ingresa la receta del cliente para encontrar los lentes compatibles.
				</p>
			</div>

			<div className="grid gap-6 xl:grid-cols-[420px,1fr]">
				<Card>
					<CardHeader>
						<CardTitle>Receta</CardTitle>
						<CardDescription>
							Los valores de esfera y cilindro deben avanzar de 0.25 en 0.25.
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
																onChange={(event) => {
																	const value = event.target.value;
																	// Permitir vacío, signo negativo, o números con máximo 2 decimales
																	if (
																		value === "" ||
																		value === "-" ||
																		/^-?\d*\.?\d{0,2}$/.test(value)
																	) {
																		field.onChange(value);
																	}
																}}
																onBlur={(event) => {
																	const value = event.target.value;
																	if (value && value !== "-") {
																		const numValue = Number.parseFloat(value);
																		if (!Number.isNaN(numValue)) {
																			// Redondear al múltiplo de 0.25 más cercano
																			const rounded =
																				Math.round(numValue * 4) / 4;
																			field.onChange(rounded);
																		}
																	}
																	field.onBlur();
																}}
																step={0.25}
																type="text"
																value={getFieldDisplayValue(field.value)}
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
																onChange={(event) => {
																	const value = event.target.value;
																	if (
																		value === "" ||
																		value === "-" ||
																		/^-?\d*\.?\d{0,2}$/.test(value)
																	) {
																		field.onChange(value);
																	}
																}}
																onBlur={(event) => {
																	const value = event.target.value;
																	if (value && value !== "-") {
																		const numValue = Number.parseFloat(value);
																		if (!Number.isNaN(numValue)) {
																			const rounded =
																				Math.round(numValue * 4) / 4;
																			field.onChange(rounded);
																		}
																	}
																	field.onBlur();
																}}
																step={0.25}
																type="text"
																value={getFieldDisplayValue(field.value)}
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
																onChange={(event) => {
																	const value = event.target.value;
																	if (
																		value === "" ||
																		value === "-" ||
																		/^-?\d*\.?\d{0,2}$/.test(value)
																	) {
																		field.onChange(value);
																	}
																}}
																onBlur={(event) => {
																	const value = event.target.value;
																	if (value && value !== "-") {
																		const numValue = Number.parseFloat(value);
																		if (!Number.isNaN(numValue)) {
																			const rounded =
																				Math.round(numValue * 4) / 4;
																			field.onChange(rounded);
																		}
																	}
																	field.onBlur();
																}}
																step={0.25}
																type="text"
																value={getFieldDisplayValue(field.value)}
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
																onChange={(event) => {
																	const value = event.target.value;
																	if (
																		value === "" ||
																		value === "-" ||
																		/^-?\d*\.?\d{0,2}$/.test(value)
																	) {
																		field.onChange(value);
																	}
																}}
																onBlur={(event) => {
																	const value = event.target.value;
																	if (value && value !== "-") {
																		const numValue = Number.parseFloat(value);
																		if (!Number.isNaN(numValue)) {
																			const rounded =
																				Math.round(numValue * 4) / 4;
																			field.onChange(rounded);
																		}
																	}
																	field.onBlur();
																}}
																step={0.25}
																type="text"
																value={getFieldDisplayValue(field.value)}
															/>
														</FormControl>
														<FormMessage />
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
					{meta ? (
						<Card>
							<CardHeader className="space-y-2">
								<CardTitle>Cotización generada</CardTitle>
								<CardDescription>
									Usando el rango {meta.prescriptionRangeUsed.code} (
									{meta.prescriptionRangeUsed.description})
								</CardDescription>
								<div className="flex flex-wrap gap-3 text-sm">
									<div className="rounded-md border bg-muted/50 px-3 py-2">
										<span className="font-medium">
											{meta.totalResults}{" "}
											{meta.totalResults === 1 ? "resultado" : "resultados"}
										</span>
									</div>
									<div className="rounded-md border bg-muted/50 px-3 py-2">
										<span className="text-muted-foreground text-xs uppercase">
											Prescripción usada
										</span>
										<div className="mt-1 grid gap-1 text-sm">
											<span>
												OD: Esf{" "}
												{meta.normalizedPrescription.od.sphere.toFixed(2)} / Cil{" "}
												{meta.normalizedPrescription.od.cylinder.toFixed(2)}
											</span>
											<span>
												OI: Esf{" "}
												{meta.normalizedPrescription.oi.sphere.toFixed(2)} / Cil{" "}
												{meta.normalizedPrescription.oi.cylinder.toFixed(2)}
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
								<p className="font-medium">No pudimos completar la cotización</p>
								<p className="text-muted-foreground text-sm">
									{getQuoteErrorMessage(error)}
								</p>
							</div>
						) : meta && products.length > 0 ? (
							<div className="flex flex-col gap-3 p-4">
								<DataTable data={products} columns={quoteColumns} />
							</div>
						) : hasSubmitted ? (
							<div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
								<PackageOpen className="size-8 text-muted-foreground" />
								<p className="font-medium">No encontramos productos</p>
								<p className="text-muted-foreground text-sm">
									Intenta con una receta diferente para ver más opciones.
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
