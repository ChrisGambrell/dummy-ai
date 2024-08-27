'use client'

import { cn } from '@/lib/utils'
import { useFormStatus } from 'react-dom'

export function FormError({ value }: { value: string[] | undefined }) {
	const { pending } = useFormStatus()
	if (!value || !value.length) return null
	return <div className={cn('text-sm text-destructive', { hidden: pending })}>{value[0]}</div>
}
