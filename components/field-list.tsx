import { deleteField } from '@/actions/fields'
import { Field } from '@prisma/client'
import { EditIcon, EllipsisIcon, Trash2Icon } from 'lucide-react'
import { ConfirmDelete } from './confirm-delete'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { UpsertField } from './upsert-field'

export function FieldsList({ fields }: { fields: Array<Field> }) {
	return (
		<div className='grid divide-y'>
			{fields.map((field) => (
				<div key={field.id} className='py-3 first:pt-0 last:pb-0 flex items-center gap-4'>
					<div className='flex-1'>
						<div className='flex items-center gap-2'>
							<span className='font-bold'>{field.name}</span>
							<Badge className='' variant='secondary'>
								{field.type === 'enum' ? field.options?.join(', ') : field.type}
							</Badge>
							{field.nullable && <Badge variant='outline'>nullable</Badge>}
							{field.unique && <Badge>unique</Badge>}
						</div>
						{field.structure && <div className='text-muted-foreground text-xs mb-1'>{field.structure}</div>}
						<div className='text-muted-foreground text-sm'>{field.desc}</div>
					</div>
					<div className='flex-shrink-0 flex items-center'>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button className='h-8 px-2' variant='outline'>
									<EllipsisIcon className='size-4' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<UpsertField field={field} schemaId={field.schemaId}>
									<DropdownMenuItem preventDefault>
										<EditIcon className='size-4 mr-2' />
										<span>Edit</span>
									</DropdownMenuItem>
								</UpsertField>
								<ConfirmDelete action={deleteField.bind(null, { id: field.id })}>
									<DropdownMenuItem preventDefault>
										<Trash2Icon className='size-4 mr-2' />
										<span>Delete</span>
									</DropdownMenuItem>
								</ConfirmDelete>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			))}
		</div>
	)
}
