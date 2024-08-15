import { Generation, Schema } from '@prisma/client'
import { ReactNode } from 'react'
import { DrawerDialog } from './drawer-dialog'
import { FormatDate } from './format-date'

export function GenerationDialog({
	children,
	generation,
	schemaName,
}: {
	children: ReactNode
	generation: Generation
	schemaName: Schema['name']
}) {
	return (
		<DrawerDialog
			className='max-w-3xl'
			title={`Generation of ${schemaName}`}
			description={
				<>
					Generated on <FormatDate date={generation.createdAt} />
				</>
			}
			trigger={children}>
			<pre className='text-wrap'>{JSON.stringify(generation.data, null, 2)}</pre>
		</DrawerDialog>
	)
}
