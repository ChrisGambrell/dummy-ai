import { deleteSchema } from '@/actions/schema'
import { Prisma } from '@prisma/client'
import { FormInputIcon, RefreshCcw, ScaleIcon, Trash2Icon } from 'lucide-react'
import { AddGeneration } from './add-generation'
import { ConfirmDelete } from './confirm-delete'
import { EmptyState } from './empty-state'
import { FieldsList } from './field-list'
import { FormatDate } from './format-date'
import { RulesList } from './fules-list'
import { GenerationsList } from './generations-list'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
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
