'use server'

import { signIn, signOut } from '@/lib/auth'
import { loginSchema } from '@/validators/auth'
import { getErrorRedirect, getSuccessRedirect, parseFormData } from '@cgambrell/utils'
import { AuthError } from 'next-auth'
import { BuiltInProviderType } from 'next-auth/providers'
import { redirect } from 'next/navigation'

export async function oauth(provider: BuiltInProviderType, _prevState: any, formData: FormData) {
	let email

	if (provider === 'resend') {
		const { data, errors } = parseFormData(formData, loginSchema)
		if (errors) return { errors }
		email = data.email
	}

	try {
		await signIn(provider, { email, redirect: provider === 'resend' ? false : undefined, redirectTo: '/' })
		if (provider === 'resend') redirect(getSuccessRedirect('/login', 'A sign in link has been sent to your email address.'))
	} catch (error) {
		if (error instanceof AuthError) redirect(getErrorRedirect('/login', error.cause?.err?.message))
		throw error
	}
}

export async function logout() {
	await signOut({ redirectTo: '/login' })
}
