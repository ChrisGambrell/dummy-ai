'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { upsertRuleSchema } from '@/validators'
import { getSuccessRedirect, parseFormData } from '@cgambrell/utils'
import { Rule } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function upsertRule(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, upsertRuleSchema)
	if (errors) return { errors }
	const user = await auth()

	if (!data.id) await prisma.rule.create({ data: { ...data, userId: user.id } })
	else await prisma.rule.update({ where: { id: data.id }, data })

	revalidatePath('/')
	redirect(getSuccessRedirect('/', 'Rule upserted successfully'))
}

export async function deleteRule({ id }: { id: Rule['id'] }) {
	await prisma.rule.delete({ where: { id } })

	revalidatePath('/')
	redirect(getSuccessRedirect('/', 'Successfully deleted rule'))
}
