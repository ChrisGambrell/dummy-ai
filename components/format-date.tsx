'use client'

import { format } from 'date-fns'

export function FormatDate({ date, format: f }: { date: Date; format: string }) {
	return format(date, f)
}
