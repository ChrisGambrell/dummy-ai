import { z } from 'zod'

export const upsertSchemaSchema = z.object({
	id: z
		.string()
		.optional()
		.transform((arg) => (!arg?.trim() ? undefined : arg)),
	name: z.string().min(1),
	desc: z.string().min(1),
})

export const upsertFieldSchema = z.object({
	id: z
		.string()
		.optional()
		.transform((arg) => (!arg?.trim() ? undefined : arg)),
	schemaId: z.string(),
	name: z.string().min(1),
	desc: z.string().min(1),
	type: z.enum(['boolean', 'date', 'decimal', 'enum', 'integer', 'json', 'string']),
	options: z
		.string()
		.min(1)
		.optional()
		.transform((arg) => (!arg?.trim() ? [] : arg.split(','))),
	structure: z
		.string()
		.optional()
		.transform((arg) => (!arg?.trim() ? null : arg)),
	nullable: z
		.string()
		.optional()
		.transform((arg) => (!arg?.trim() ? false : true)),
	unique: z
		.string()
		.optional()
		.transform((arg) => (!arg?.trim() ? false : true)),
})

export const upsertRuleSchema = z.object({
	id: z
		.string()
		.optional()
		.transform((arg) => (!arg?.trim() ? undefined : arg)),
	schemaId: z.string(),
	rule: z.string().min(1),
})
