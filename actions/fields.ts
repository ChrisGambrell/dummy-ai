'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { upsertFieldSchema } from '@/validators'
import { getSuccessRedirect, parseFormData } from '@cgambrell/utils'
import { Field } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function upsertField(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, upsertFieldSchema)
	if (errors) return { errors }
	const user = await auth()

	if (!data.id) await prisma.field.create({ data: { ...data, userId: user.id } })
	else await prisma.field.update({ where: { id: data.id }, data })

	revalidatePath('/')
	redirect(getSuccessRedirect('/', `${data.name} upserted successfully`))
}

export async function deleteField({ id }: { id: Field['id'] }) {
	await prisma.field.delete({ where: { id } })

	revalidatePath('/')
	redirect(getSuccessRedirect('/', 'Successfully deleted field'))
}
