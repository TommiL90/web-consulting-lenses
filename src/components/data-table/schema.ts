import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
	id: z.string(),
	title: z.string(),
	status: z.string(),
	label: z.string(),
	priority: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

// Product schema for data table validation
export const productSchema = z.object({
	id: z.string(),
	sku: z.string(),
	name: z.string(),
	material: z.string(),
	tipo: z.string(),
	hasAntiReflective: z.boolean(),
	hasBlueFilter: z.boolean(),
	isPhotochromic: z.boolean(),
	hasUVProtection: z.boolean(),
	isPolarized: z.boolean(),
	isMirrored: z.boolean(),
	basePrice: z.number(),
	finalPrice: z.number(),
	deliveryDays: z.number(),
	observations: z.string(),
	prescriptionRangeCode: z.string(),
	prescriptionRangeDescription: z.string(),
});

export type ProductData = z.infer<typeof productSchema>;