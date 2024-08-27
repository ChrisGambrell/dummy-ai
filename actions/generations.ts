'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { addGenerationSchema } from '@/validators'
import { openai } from '@ai-sdk/openai'
import { getErrorRedirect, getSuccessRedirect, parseFormData } from '@cgambrell/utils'
import { Generation } from '@prisma/client'
import { generateObject, generateText } from 'ai'
import _ from 'lodash'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z, ZodTypeAny } from 'zod'

export async function addGeneration(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, addGenerationSchema)
	if (errors) return { errors }

	const schema = await prisma.schema.findUnique({ where: { id: data.schemaId }, include: { fields: true, rules: true } })
	if (!schema) redirect(getErrorRedirect('/', 'Failed to fetch schema.'))
	const user = await auth()

	const { object } = await generateObject({
		model: openai('gpt-4o-mini'),
		schemaName: _.camelCase(schema.name),
		schemaDescription: schema.desc,
		schema: z.object({
			data: z.array(
				z.object(
					schema.fields.reduce((acc, field) => {
						let v: ZodTypeAny

						if (field.type === 'boolean') v = z.boolean()
						else if (field.type === 'date') v = z.string().transform((arg) => new Date(arg))
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
		prompt: `Generate ${data.rows} rows of data for a schema with the name "${schema.name}" and the description "${
			schema.desc
		}". Also, take these rules into consideration: ${schema.rules.map((r) => r.rule).join(';')}`,
	})

	// TODO: Add starts of data export conversion
	// const { responseMessages } = await generateText({
	// 	model: openai('gpt-4o-mini'),
	// 	system: 'You are an assistant that converts JSON to CSV. Do not provide any commentary or extra text. Please ONLY return the CSV that I can parse.',
	// system: 'You are an assistant that converts JSON to XML. Do not provide any commentary or extra text. Please ONLY return the XML that I can parse.',
	// system: 'You are an assistant that converts JSON to SQL. Do not provide any commentary or extra text. Please ONLY return the SQL that I can parse.',
	// system: 'You are an assistant that converts JSON to YML. Do not provide any commentary or extra text. Please ONLY return the YML that I can parse.',
	// 	messages: [{ role: 'user', content: JSON.stringify(object.data) }],
	// })

	// console.log(responseMessages[0].content[0].text)

	await prisma.generation.create({ data: { schemaId: data.schemaId, userId: user.id, data: object.data } })

	revalidatePath('/')
	redirect(getSuccessRedirect('/', 'Successfully generated data'))
}

export async function deleteGeneration({ id }: { id: Generation['id'] }) {
	await prisma.generation.delete({ where: { id } })

	revalidatePath('/')
	redirect(getSuccessRedirect('/', 'Successfully deleted generation'))
}
