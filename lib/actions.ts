'use server'

import { openai } from '@ai-sdk/openai'
import { getErrorRedirect, getSuccessRedirect, parseFormData } from '@cgambrell/utils'
import { generateObject } from 'ai'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z, ZodTypeAny } from 'zod'
import { createClient } from './supabase/server'
import { Row } from './supabase/types'
import { upsertFieldSchema, upsertSchemaSchema } from './validators'

const GENERATE_DATA_LIMIT = 10

export async function generateData({ id }: { id: Row<'schemas'>['id'] }) {
	const supabase = createClient()

	const { data: schema, error } = await supabase.from('schemas').select('*, fields(*)').eq('id', id).single()
	if (error) redirect(getErrorRedirect('/', `Failed to fetch schema: ${error.message}`))

	const { object } = await generateObject({
		model: openai('gpt-4o-mini'),
		schemaName: schema.name,
		schemaDescription: schema.description,
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
						else if (field.type === 'integer') v = z.number().int()
						else if (field.type === 'enum') v = z.enum(field.options as [string, ...string[]])
						else if (field.type === 'string') v = z.string()
						else throw new Error(`Invalid field type.`)

						v = v.describe(`${field.unique ? '** UNIQUE ** ' : ''}${field.description}`)
						if (field.nullable) acc[field.name] = v.nullable()
						else acc[field.name] = v
						return acc
					}, {} as any)
				)
			),
		}),
		prompt: `Generate ${GENERATE_DATA_LIMIT} rows of data for the ${schema.name} schema (${schema.description})`,
	})

	const { data: gen, error: genError } = await supabase.from('generations').insert({ schema_id: id, data: object.data }).select().single()
	if (genError) redirect(getErrorRedirect('/', `Failed to save generated data: ${genError.message}`))

	redirect(`/generations/${gen.id}`)
}

// MARK: Schemas

export async function upsertSchema(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, upsertSchemaSchema)
	if (errors) return { errors }

	const supabase = createClient()

	const { error } = await supabase.from('schemas').upsert(data)
	if (error) redirect(getErrorRedirect('/', `Failed to upsert ${data.name}: ${error.message}`))

	revalidatePath('/')
	redirect(getSuccessRedirect('/', `${data.name} upserted successfully`))
}

// MARK: Fields

export async function upsertField(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, upsertFieldSchema)
	if (errors) return { errors }

	const supabase = createClient()

	const { error } = await supabase.from('fields').upsert(data)
	if (error) redirect(getErrorRedirect('/', `Failed to upsert ${data.name}: ${error.message}`))

	revalidatePath('/')
	redirect(getSuccessRedirect('/', `${data.name} upserted successfully`))
}

export async function deleteField({ id }: { id: Row<'fields'>['id'] }) {
	const supabase = createClient()

	const { error } = await supabase.from('fields').delete().eq('id', id)
	if (error) redirect(getErrorRedirect('/', `Failed to delete field: ${error.message}`))

	revalidatePath('/')
	redirect(getSuccessRedirect('/', 'Successfully deleted field'))
}
