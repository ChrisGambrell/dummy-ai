import { addGeneration, deleteGeneration, deleteSchema } from '@/lib/actions'
import { Field, Generation, Prisma, Schema } from '@prisma/client'
import { EditIcon, EllipsisIcon, EyeIcon, PlusIcon, RefreshCcw, Trash2Icon } from 'lucide-react'
import { ActionButton } from './action-button'
import { ConfirmDelete } from './confirm-delete'
import { DeleteFieldButton } from './delete-field-button'
import { FormatDate } from './format-date'
import { GenerationDialog } from './generation-dialog'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { UpsertField } from './upsert-field'

export function SchemaCard({ schema }: { schema: Prisma.SchemaGetPayload<{ include: { fields: true; generations: true } }> }) {
	return (
		<Card>
			<CardHeader>
				<div className='flex flex-col gap-4'>
					<div className='flex justify-between items-start gap-4'>
						<div className='space-y-1.5'>
							<CardTitle>{schema.name}</CardTitle>
							<CardDescription>{schema.desc}</CardDescription>
						</div>
						<ConfirmDelete action={deleteSchema.bind(null, { id: schema.id })}>
							<Button size='icon' variant='secondary'>
								<Trash2Icon className='size-4' />
							</Button>
						</ConfirmDelete>
					</div>
					<div className='grid gap-2 sm:grid-cols-2'>
						<form action={addGeneration.bind(null, { id: schema.id })}>
							<ActionButton className='w-full'>
								<RefreshCcw className='size-4 mr-2' />
								<span>Generate</span>
							</ActionButton>
						</form>
						<UpsertField schemaId={schema.id}>
							<Button variant='secondary'>
								<PlusIcon className='size-4 mr-2' />
								<span>Add field</span>
							</Button>
						</UpsertField>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<FieldsList fields={schema.fields} />
			</CardContent>
			{schema.generations.length > 0 && (
				<>
					<CardContent>
						<Separator />
					</CardContent>
					<CardFooter>
						<GenerationsList generations={schema.generations} schemaName={schema.name} />
					</CardFooter>
				</>
			)}
		</Card>
	)
}

function FieldsList({ fields }: { fields: Array<Field> }) {
	return (
		<div className='grid divide-y'>
			{fields.map((field) => (
				<div key={field.id} className='py-3 first:pt-0 last:pb-0 flex items-center gap-4'>
					<div className='flex-1'>
						<div>
							<span className='font-bold mr-2'>{field.name}</span>
							<span className='text-muted-foreground text-xs'>
								{field.type === 'enum' ? field.options?.join(', ') : field.type}
							</span>
						</div>
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
									<DropdownMenuItem noaction>
										<EditIcon className='size-4 mr-2' />
										<span>Edit</span>
									</DropdownMenuItem>
								</UpsertField>
								<DeleteFieldButton fieldId={field.id} />
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			))}
		</div>
	)
}

function GenerationsList({ generations, schemaName }: { generations: Array<Generation>; schemaName: Schema['name'] }) {
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
