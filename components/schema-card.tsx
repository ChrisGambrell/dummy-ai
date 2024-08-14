import { generateData } from '@/lib/actions'
import { Prisma } from '@prisma/client'
import { EditIcon, EllipsisIcon, EyeIcon, PlusIcon, RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import { ActionButton } from './action-button'
import { DeleteFieldButton } from './delete-field-button'
import { Button, buttonVariants } from './ui/button'
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
				<div className='flex justify-between gap-4'>
					<div className='space-y-1.5'>
						<CardTitle>{schema.name}</CardTitle>
						<CardDescription>{schema.desc}</CardDescription>
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
								<div className='text-muted-foreground text-sm'>{field.desc}</div>
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
			</CardContent>
			{schema.generations.length > 0 && (
				<>
					<CardContent>
						<Separator />
					</CardContent>
					<CardFooter>
						<div className='grid gap-2 w-full'>
							<Label className='text-base'>Generations</Label>
							<div className='grid divide-y'>
								{schema.generations.map((gen) => (
									<div key={gen.id} className='text-sm py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4'>
										<div>{new Date(gen.createdAt).toLocaleString()}</div>
										<div>{gen.data.length} item(s)</div>
										<div className='flex items-center'>
											{/* TODO: Make dialog instead of page */}
											<Link
												className={buttonVariants({ variant: 'secondary', className: 'h-8 px-2' })}
												href={`/generations/${gen.id}`}>
												<EyeIcon className='size-4' />
											</Link>
											{/* TODO: Delete generation */}
										</div>
									</div>
								))}
							</div>
						</div>
					</CardFooter>
				</>
			)}
		</Card>
	)
}
