import { ActionButton } from '@/components/action-button'
import { DeleteFieldButton } from '@/components/delete-field-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UpsertField } from '@/components/upsert-field'
import { UpsertSchema } from '@/components/upsert-schema'
import { generateData } from '@/lib/actions'
import { createClient } from '@/lib/supabase/server'
import { EditIcon, EllipsisIcon, PlusIcon, RefreshCcw } from 'lucide-react'

export default async function RootPage() {
	const supabase = createClient()
	const { data: schemas, error } = await supabase
		.from('schemas')
		.select('*, fields(*)')
		.order('created_at', { ascending: false })
		.order('created_at', { referencedTable: 'fields' })
	if (error) throw error

	return (
		<div className='grid gap-6 max-w-3xl mx-auto mt-12 mb-8'>
			<div className='ml-auto'>
				<UpsertSchema>
					<Button>
						<PlusIcon className='size-4 mr-2' />
						Add schema
					</Button>
				</UpsertSchema>
			</div>
			{schemas.map((schema) => (
				<Card key={schema.id}>
					<CardHeader>
						<div className='flex justify-between gap-4'>
							<div className='space-y-1.5'>
								<CardTitle>{schema.name}</CardTitle>
								<CardDescription>{schema.description}</CardDescription>
							</div>
							<div className='flex items-center gap-2'>
								<form action={generateData.bind(null, { id: schema.id })}>
									<ActionButton>
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
						<div className='grid divide-y'>
							{schema.fields.map((field) => (
								<div key={field.id} className='py-3 first:pt-0 last:pb-0 flex items-center gap-4'>
									<div className='flex-1'>
										<div>
											<span className='font-bold mr-2'>{field.name}</span>
											<span className='text-muted-foreground text-xs'>
												{field.type === 'enum' ? field.options?.join(', ') : field.type}
											</span>
										</div>
										<div className='text-muted-foreground text-sm'>{field.description}</div>
									</div>
									<div className='flex-shrink-0 flex items-center'>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button className='h-8 px-2' variant='secondary'>
													<EllipsisIcon className='size-4' />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												<DropdownMenuLabel>Actions</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<UpsertField field={field} schemaId={field.schema_id}>
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
					</CardContent>
				</Card>
			))}
		</div>
	)
}
