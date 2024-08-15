'use client'

import { upsertField } from '@/lib/actions'
import { useCloseOnComplete } from '@/lib/hooks'
import { Field, Schema } from '@prisma/client'
import { ReactNode, useState } from 'react'
import { useFormState } from 'react-dom'
import { ActionButton } from './action-button'
import { DrawerDialog } from './drawer-dialog'
import { FormError } from './form-error'
import { DialogFooter } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Switch } from './ui/switch'
import { Textarea } from './ui/textarea'

export function UpsertField({ children, field, schemaId }: { children: ReactNode; field?: Field; schemaId: Schema['id'] }) {
	const [state, action] = useFormState(upsertField, null)
	const [open, onOpenChange] = useCloseOnComplete(state)
	const [type, setType] = useState(field?.type.toString())

	return (
		<DrawerDialog title={`${field ? 'Update' : 'Add'} Field`} trigger={children} open={open} onOpenChange={onOpenChange}>
			<form action={action} className='grid gap-4'>
				<input type='hidden' name='id' value={field?.id} />
				<input type='hidden' name='schemaId' value={schemaId} />

				<div className='grid gap-2'>
					<Label htmlFor='name'>Name</Label>
					<Input id='name' name='name' placeholder='full_name' defaultValue={field?.name} />
					<FormError value={state?.errors.name} />
				</div>
				<div className='grid gap-2'>
					<Label htmlFor='desc'>Description</Label>
					<Textarea id='name' name='desc' placeholder='The first, middle, and last name of a user' defaultValue={field?.desc} />
					<FormError value={state?.errors.desc} />
				</div>
				<div className='grid gap-2'>
					<Label htmlFor='type'>Type</Label>
					<Select name='type' value={type} onValueChange={setType}>
						<SelectTrigger>
							<SelectValue placeholder='Select an option' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='boolean'>boolean</SelectItem>
							<SelectItem value='date'>date</SelectItem>
							<SelectItem value='decimal'>decimal</SelectItem>
							<SelectItem value='enum'>enum</SelectItem>
							<SelectItem value='integer'>integer</SelectItem>
							<SelectItem value='json'>json</SelectItem>
							<SelectItem value='string'>string</SelectItem>
						</SelectContent>
					</Select>
					<FormError value={state?.errors.type} />
				</div>
				{type === 'enum' && (
					<div className='grid gap-2'>
						<Label htmlFor='options'>Options</Label>
						<Input id='options' name='options' placeholder='option1,option2' defaultValue={field?.options?.join(',')} />
						<div className='text-xs text-muted-foreground'>Each option separated with a comma.</div>
						<FormError value={state?.errors.options} />
					</div>
				)}
				{type === 'json' && (
					<div className='grid gap-2'>
						<Label htmlFor='structure'>Structure</Label>
						<Input
							id='structure'
							name='structure'
							placeholder='{ "hello": string, "foo": integer }'
							defaultValue={field?.structure ?? ''}
						/>
						<FormError value={state?.errors.structure} />
					</div>
				)}
				<div className='flex items-center space-x-2'>
					<Switch id='nullable' name='nullable' defaultChecked={field?.nullable} />
					<Label htmlFor='nullable'>Nullable</Label>
					<FormError value={state?.errors.nullable} />
				</div>
				<div className='flex items-center space-x-2'>
					<Switch id='unique' name='unique' defaultChecked={field?.unique} />
					<Label htmlFor='unique'>Unique</Label>
					<FormError value={state?.errors.unique} />
				</div>
				<DialogFooter>
					<ActionButton className='w-full md:w-fit'>Save</ActionButton>
				</DialogFooter>
			</form>
		</DrawerDialog>
	)
}
