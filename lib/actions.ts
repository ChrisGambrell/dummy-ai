// TODO: Move this to actions folder

'use server'

import { openai } from '@ai-sdk/openai'
import { getErrorRedirect, getSuccessRedirect, parseFormData } from '@cgambrell/utils'
import { Field, Generation, Schema } from '@prisma/client'
import { generateObject } from 'ai'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import camelCase from 'voca/camel_case'
import { z, ZodTypeAny } from 'zod'
import prisma from './db'
import { upsertFieldSchema, upsertSchemaSchema } from './validators'

const GENERATE_DATA_LIMIT = 10

// MARK: Schemas

export async function upsertSchema(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, upsertSchemaSchema)
	if (errors) return { errors }

	if (!data.id) await prisma.schema.create({ data })
	else await prisma.schema.update({ where: { id: data.id }, data })

	revalidatePath('/')
	redirect(getSuccessRedirect('/', `${data.name} upserted successfully`))
}

export async function deleteSchema({ id }: { id: Schema['id'] }) {
	await prisma.schema.delete({ where: { id } })

	revalidatePath('/')
	redirect(getSuccessRedirect('/', 'Successfully deleted schema'))
}

// MARK: Fields

export async function upsertField(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, upsertFieldSchema)
	if (errors) return { errors }

	if (!data.id) await prisma.field.create({ data })
	else await prisma.field.update({ where: { id: data.id }, data })

	revalidatePath('/')
	redirect(getSuccessRedirect('/', `${data.name} upserted successfully`))
}

export async function deleteField({ id }: { id: Field['id'] }) {
	await prisma.field.delete({ where: { id } })

	revalidatePath('/')
	redirect(getSuccessRedirect('/', 'Successfully deleted field'))
}

// MARK: Generations

export async function addGeneration({ id }: { id: Schema['id'] }) {
	const schema = await prisma.schema.findUnique({ where: { id }, include: { fields: true } })
	if (!schema) redirect(getErrorRedirect('/', `Failed to fetch schema.`))

	const { object } = await generateObject({
		model: openai('gpt-4o-mini'),
		schemaName: camelCase(schema.name),
		schemaDescription: schema.desc,
		schema: z.object({
			data: z.array(
				z.object(
					schema.fields.reduce((acc, field) => {
						let v: ZodTypeAny

						if (field.type === 'boolean') v = z.boolean()
						else if (field.type === 'date')
							v = z
								.string()
								.date()
								.transform((arg) => new Date(arg))
						else if (field.type === 'decimal') v = z.number()
						else if (field.type === 'enum') v = z.enum(field.options as [string, ...string[]])
						else if (field.type === 'integer') v = z.number().int()
						else if (field.type === 'json') v = z.string().transform((arg) => JSON.parse(arg))
						else if (field.type === 'string') v = z.string()
						else throw new Error(`Invalid field type.`)

						v = v.describe(
							`${field.type === 'json' ? '** FIELD SHOULD BE JSON ** ' : ''}${field.unique ? '** UNIQUE ** ' : ''}${
								field.desc
							}${field.type === 'json' && field.structure ? ` (structure: ${field.structure})` : ''}`
						)
						if (field.nullable && field.type !== 'date') acc[field.name] = v.nullable()
						else acc[field.name] = v
						return acc
					}, {} as any)
				)
			),
		}),
		prompt: `Generate ${GENERATE_DATA_LIMIT} rows of data for the ${schema.name} schema (${schema.desc})`,
	})

	await prisma.generation.create({ data: { schemaId: id, data: object.data } })

	revalidatePath('/')
	redirect(getSuccessRedirect('/', 'Successfully generated data'))
}

export async function deleteGeneration({ id }: { id: Generation['id'] }) {
	await prisma.generation.delete({ where: { id } })

	revalidatePath('/')
	redirect(getSuccessRedirect('/', 'Successfully deleted generation'))
}
