import { GlobalToaster } from '@/components/global-toaster'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'

// Verify all environment variables are set
import '@/lib/env'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Dummy AI',
	description: 'Generate dummy data for your projects',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				{children}
				<Suspense>
					<GlobalToaster />
				</Suspense>
			</body>
		</html>
	)
}
