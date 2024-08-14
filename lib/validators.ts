import { z } from 'zod'

export const upsertSchemaSchema = z.object({
	id: z
		.string()
		.optional()
		.transform((arg) => (!arg?.trim() ? undefined : arg)),
	name: z.string().min(1),
	description: z.string().min(1),
})

export const upsertFieldSchema = z.object({
	id: z
		.string()
		.optional()
		.transform((arg) => (!arg?.trim() ? undefined : arg)),
	schema_id: z.string().uuid(),
	name: z.string().min(1),
	description: z.string().min(1),
	type: z.string().min(1),
	options: z
		.string()
		.min(1)
		.optional()
		.transform((arg) => (!arg?.trim() ? null : arg.split(','))),
	nullable: z
		.string()
		.optional()
		.transform((arg) => (!arg?.trim() ? false : true)),
	unique: z
		.string()
		.optional()
		.transform((arg) => (!arg?.trim() ? false : true)),
})
