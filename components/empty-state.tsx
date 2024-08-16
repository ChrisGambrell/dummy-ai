import { ReactNode } from 'react'
import { cn } from '../lib/utils'

export function EmptyState({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<div
			className={cn(
				'flex items-center justify-center h-48 text-xl italic font-medium border-2 border-dashed rounded-lg text-foreground/40',
				className
			)}>
			{children}
		</div>
	)
}
