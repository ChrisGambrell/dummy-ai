import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	server: {
		AUTH_SECRET: z.string().min(1),
		AUTH_GITHUB_ID: z.string().min(1),
		AUTH_GITHUB_SECRET: z.string().min(1),
		AUTH_RESEND_KEY: z.string().min(1),

		OPENAI_API_KEY: z.string().min(1),
		POSTGRES_PRISMA_URL: z.string().url().startsWith('postgres://'),
	},
	client: { NEXT_PUBLIC_SITE_URL: z.string().url() },
	runtimeEnv: {
		AUTH_SECRET: process.env.AUTH_SECRET,
		AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
		AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
		AUTH_RESEND_KEY: process.env.AUTH_RESEND_KEY,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,

		NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
	},
})
