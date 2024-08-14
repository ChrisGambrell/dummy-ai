import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	server: {
		OPENAI_API_KEY: z.string().min(1),
		POSTGRES_URL: z.string().url(),
		POSTGRES_PRISMA_URL: z.string().url(),
		POSTGRES_URL_NO_SSL: z.string().url(),
		POSTGRES_URL_NON_POOLING: z.string().url(),
		POSTGRES_USER: z.string().min(1),
		POSTGRES_HOST: z.string().min(1),
		POSTGRES_PASSWORD: z.string().min(1),
		POSTGRES_DATABASE: z.string().min(1),
	},
	client: {},
	runtimeEnv: {
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		POSTGRES_URL: process.env.POSTGRES_URL,
		POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
		POSTGRES_URL_NO_SSL: process.env.POSTGRES_URL_NO_SSL,
		POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
		POSTGRES_USER: process.env.POSTGRES_USER,
		POSTGRES_HOST: process.env.POSTGRES_HOST,
		POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
		POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
	},
})
