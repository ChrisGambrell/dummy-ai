import { loginSchema } from '@/validators/auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import NextAuth, { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Github from 'next-auth/providers/github'
import Resend from 'next-auth/providers/resend'
import prisma from './db'

export const authConfig = {
	adapter: PrismaAdapter(prisma),
	callbacks: {
		authorized: ({ auth, request: { nextUrl } }) => {
			const isAuthed = !!auth?.user
			const isAuthRoute =
				nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register') || nextUrl.pathname.startsWith('/forgot')

			if (!isAuthRoute) {
				if (isAuthed) return true
				return false
			} else if (isAuthed) return Response.redirect(new URL('/', nextUrl))
			return true
		},
	},
	pages: { signIn: '/login' },
	providers: [
		Credentials({
			credentials: { email: {}, password: {} },
			authorize: async (credentials) => {
				const { email, password } = await loginSchema.parseAsync(credentials)
				const user = await prisma.user.findUnique({ where: { email } })

				if (!user) throw new Error('User not found')
				else if (!user.passwordHash) throw new Error('User does not have a password')
				else if (!(await bcrypt.compare(password, user.passwordHash))) throw new Error('Password does not match')

				return user
			},
		}),
		Github({ allowDangerousEmailAccountLinking: true }),
		Resend({ from: 'noreply@gambrell.dev' }),
	],
	session: { strategy: 'jwt' },
} satisfies NextAuthConfig

export const { handlers, auth: session, signIn, signOut } = NextAuth(authConfig)

export const auth = async () => {
	const session = await NextAuth(authConfig).auth()
	if (!session?.user) throw new Error('Not authenticated.')

	const user = await prisma.user.findFirst({ where: { email: session.user.email ?? '' } })
	if (!user) throw new Error('User not found')

	return user
}
