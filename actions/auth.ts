'use server'

import { signIn, signOut } from '@/lib/auth'
import prisma from '@/lib/db'
import { loginSchema, registerSchema, verifyEmailSchema } from '@/validators/auth'
import { getErrorRedirect, getSuccessRedirect, parseFormData } from '@cgambrell/utils'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'
import { BuiltInProviderType } from 'next-auth/providers'
import { redirect } from 'next/navigation'

export async function register(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, registerSchema)
	if (errors) return { errors }

	try {
		const passwordHash = await bcrypt.hash(data.password, 10)
		await prisma.user.create({ data: { name: `${data.firstName} ${data.lastName}`, email: data.email, passwordHash } })
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
			return { errors: { email: ['User already exists with that email'] } }
		else if (error instanceof AuthError) redirect(getErrorRedirect('/register', error.cause?.err?.message))
		throw error
	}

	redirect(getSuccessRedirect('/login', 'Account created, please login'))
}

export async function login(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, loginSchema)
	if (errors) return { errors }

	try {
		await signIn('credentials', { email: data.email, password: data.password, redirectTo: '/' })
	} catch (error) {
		if (error instanceof AuthError) redirect(getErrorRedirect('/login', error.cause?.err?.message))
		throw error
	}
}

export async function oauth(provider: BuiltInProviderType) {
	try {
		await signIn(provider, { redirectTo: '/' })
	} catch (error) {
		if (error instanceof AuthError) redirect(getErrorRedirect('/login', error.cause?.err?.message))
		throw error
	}
}

export async function verifyEmail(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, verifyEmailSchema)
	if (errors) return { errors }

	try {
		await signIn('resend', { email: data.email, redirect: false })
	} catch (error) {
		if (error instanceof AuthError) redirect(getErrorRedirect('/forgot', error.cause?.err?.message))
		throw error
	}

	redirect(getSuccessRedirect('/login', 'A sign in link has been sent to your email address.'))
}

export async function logout() {
	await signOut({ redirectTo: '/login' })
}
