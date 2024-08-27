'use client'

import { ReactNode } from 'react'
import toast from 'react-hot-toast'

export function CopyButton({ children, value }: { children: ReactNode; value: string }) {
	return (
		<div
			onClick={() => {
				navigator.clipboard.writeText(value)
				toast.success('Copied to clipboard')
			}}>
			{children}
		</div>
	)
}
