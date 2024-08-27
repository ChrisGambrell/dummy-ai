import { Generation, Schema } from '@prisma/client'
import { FilesIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { CopyButton } from './copy-button'
import { DrawerDialog } from './drawer-dialog'
import { FormatDate } from './format-date'
import { Button } from './ui/button'

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
			<div className='grid gap-2'>
				<CopyButton value={JSON.stringify(generation.data, null, 2)}>
					<Button className='md:w-fit'>
						<FilesIcon className='size-4 mr-2' />
						<span>Copy data</span>
					</Button>
				</CopyButton>
				<pre className='text-wrap'>{JSON.stringify(generation.data, null, 2)}</pre>
			</div>
		</DrawerDialog>
	)
}
