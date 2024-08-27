'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { importSchemaSchema, upsertSchemaSchema } from '@/validators'
import { getSuccessRedirect, parseFormData } from '@cgambrell/utils'
import { Schema } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function upsertSchema(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, upsertSchemaSchema)
	if (errors) return { errors }
	const user = await auth()

	if (!data.id) await prisma.schema.create({ data: { ...data, userId: user.id } })
	else await prisma.schema.update({ where: { id: data.id }, data })

	revalidatePath('/')
	redirect(getSuccessRedirect('/', `${data.name} upserted successfully`))
}

export async function importSchema(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, importSchemaSchema)
	if (errors) return { errors }
	const user = await auth()

	const { fields, rules, ...schema } = data.code
	await prisma.schema.create({
		data: {
			...schema,
			userId: user.id,
			fields: { createMany: { data: fields.map((f: any) => ({ ...f, userId: user.id })) } },
			rules: { createMany: { data: rules.map((r: any) => ({ ...r, userId: user.id })) } },
		},
	})

	revalidatePath('/')
	redirect(getSuccessRedirect('/', `${data.code.name} imported successfully`))
}

export async function deleteSchema({ id }: { id: Schema['id'] }) {
	await prisma.schema.delete({ where: { id } })

	revalidatePath('/')
	redirect(getSuccessRedirect('/', 'Successfully deleted schema'))
}
