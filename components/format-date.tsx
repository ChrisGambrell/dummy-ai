'use client'

import { format, FormatOptions } from 'date-fns'

export function FormatDate({
	date,
	formatStr = 'yyyy-MM-dd h:mm:ss a',
	options,
}: {
	date: string | number | Date
	formatStr?: string
	options?: FormatOptions
}) {
	return format(date, formatStr, options)
}
