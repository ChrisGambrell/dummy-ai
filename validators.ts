import { z } from 'zod'

export const loginSchema = z.object({
	email: z.string({ required_error: 'Email is required' }).min(1, { message: 'Email is required' }).email({ message: 'Invalid email' }),
})

export const upsertSchemaSchema = z.object({
	id: z
		.string()
		.optional()
		.transform((arg) => (!arg?.trim() ? undefined : arg)),
	name: z.string().min(1),
	desc: z.string().min(1),
})

export const importSchemaSchema = z.object({
	code: z
		.string()
		.transform((arg) => JSON.parse(arg))
		.refine((arg) => arg.name && arg.desc, { message: 'Invalid schema' })
		.refine(
			(arg) => arg.fields && Array.isArray(arg.fields) && arg.fields.every((field: any) => field.name && field.desc && field.type),
			{ message: 'Invalid fields' }
		)
		.refine((arg) => arg.rules && Array.isArray(arg.rules) && arg.rules.every((rule: any) => rule.rule), { message: 'Invalid rules' }),
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

export const addGenerationSchema = z.object({ schemaId: z.string(), rows: z.coerce.number().int().positive().max(100).default(10) })
