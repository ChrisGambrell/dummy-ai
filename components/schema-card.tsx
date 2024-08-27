import { deleteField } from '@/actions/fields'
import { deleteGeneration } from '@/actions/generations'
import { deleteRule } from '@/actions/rules'
import { deleteSchema } from '@/actions/schema'
import { Field, Generation, Prisma, Rule, Schema } from '@prisma/client'
import { EditIcon, EllipsisIcon, EyeIcon, FormInputIcon, RefreshCcw, ScaleIcon, Trash2Icon } from 'lucide-react'
import { AddGeneration } from './add-generation'
import { ConfirmDelete } from './confirm-delete'
import { EmptyState } from './empty-state'
import { FormatDate } from './format-date'
import { GenerationDialog } from './generation-dialog'
import { Badge } from './ui/badge'
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { UpsertField } from './upsert-field'
import { UpsertRule } from './upsert-rule'

export function SchemaCard({
	schema,
}: {
	schema: Prisma.SchemaGetPayload<{ include: { fields: true; generations: true; rules: true; user: true } }>
}) {
	return (
		<Card>
			<CardHeader>
				<div className='flex flex-col gap-4'>
					<div className='flex justify-between items-start gap-4'>
						<div className='space-y-1.5'>
							<CardTitle>{schema.name}</CardTitle>
							<div>
								<CardDescription>{schema.desc}</CardDescription>
								<CardDescription className='text-xs italic'>
									Created by {schema.user.name} on <FormatDate date={schema.createdAt} formatStr='PPp' />
								</CardDescription>
							</div>
						</div>
						<ConfirmDelete action={deleteSchema.bind(null, { id: schema.id })}>
							<Button size='icon' variant='secondary'>
								<Trash2Icon className='size-4' />
							</Button>
						</ConfirmDelete>
					</div>
					<div className='grid gap-2 sm:grid-cols-3'>
						{/* TODO: Tooltip not working */}
						<TooltipProvider>
							<Tooltip open={schema.fields.length > 0 ? false : undefined}>
								<TooltipTrigger asChild>
									<AddGeneration schemaId={schema.id}>
										<Button disabled={schema.fields.length === 0}>
											<RefreshCcw className='size-4 mr-2' />
											<span>Generate</span>
										</Button>
									</AddGeneration>
								</TooltipTrigger>
								<TooltipContent>
									<p>You must have at least one field to generate data.</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<UpsertField schemaId={schema.id}>
							<Button variant='secondary'>
								<FormInputIcon className='size-4 mr-2' />
								<span>Add field</span>
							</Button>
						</UpsertField>
						<UpsertRule schemaId={schema.id}>
							<Button variant='secondary'>
								<ScaleIcon className='size-4 mr-2' />
								<span>Add rule</span>
							</Button>
						</UpsertRule>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{schema.fields.length > 0 ? (
					<FieldsList fields={schema.fields} />
				) : (
					<EmptyState className='h-[100px]'>No fields yet.</EmptyState>
				)}
			</CardContent>
			{schema.rules.length > 0 && (
				<>
					<CardContent>
						<Separator />
					</CardContent>
					<CardFooter>
						<RulesList rules={schema.rules} />
					</CardFooter>
				</>
			)}
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

function RulesList({ rules }: { rules: Array<Rule> }) {
	return (
		<div className='grid gap-2 w-full'>
			<Label className='text-base'>Rules</Label>
			<div className='grid divide-y'>
				{rules.map((rule) => (
					<div key={rule.id} className='text-sm py-3 first:pt-0 last:pb-0 flex justify-between gap-4'>
						{/* BUG: Overflow is bad */}
						<div className='flex-1'>{rule.rule}</div>
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
									<UpsertRule rule={rule} schemaId={rule.schemaId}>
										<DropdownMenuItem preventDefault>
											<EditIcon className='size-4 mr-2' />
											<span>Edit</span>
										</DropdownMenuItem>
									</UpsertRule>
									<ConfirmDelete action={deleteRule.bind(null, { id: rule.id })}>
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
