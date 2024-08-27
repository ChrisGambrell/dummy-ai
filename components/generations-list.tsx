import { deleteGeneration } from '@/actions/generations'
import { Generation, Schema } from '@prisma/client'
import { EyeIcon, Trash2Icon } from 'lucide-react'
import { ConfirmDelete } from './confirm-delete'
import { FormatDate } from './format-date'
import { GenerationDialog } from './generation-dialog'
import { Button } from './ui/button'
import { Label } from './ui/label'

export function GenerationsList({ generations, schemaName }: { generations: Array<Generation>; schemaName: Schema['name'] }) {
	return (
		<div className='grid gap-2 w-full'>
			<Label className='text-base'>Generations</Label>
			<div className='grid divide-y'>
				{generations.map((gen) => (
					<div key={gen.id} className='text-sm py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4'>
						<div>
							<FormatDate date={gen.createdAt} />
						</div>
						<div>{gen.data.length} item(s)</div>
						<div className='flex items-center gap-1'>
							<GenerationDialog generation={gen} schemaName={schemaName}>
								<Button className='h-8 px-2' variant='outline'>
									<EyeIcon className='size-4' />
								</Button>
							</GenerationDialog>
							<ConfirmDelete action={deleteGeneration.bind(null, { id: gen.id })}>
								<Button className='h-8 px-2' variant='outline'>
									<Trash2Icon className='size-4' />
								</Button>
							</ConfirmDelete>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
