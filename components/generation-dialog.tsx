import { Generation } from '@prisma/client'
import { ReactNode } from 'react'
import { DrawerDialog } from './drawer-dialog'

export function GenerationDialog({ children, generation, name }: { children: ReactNode; generation: Generation; name: string }) {
	return (
		<DrawerDialog
			className='max-w-3xl'
			title={`Generation of ${name}`}
			description={`Generated on ${generation.createdAt.toLocaleString()}`}
			trigger={children}>
			<pre>{JSON.stringify(generation.data, null, 2)}</pre>
		</DrawerDialog>
	)
}
