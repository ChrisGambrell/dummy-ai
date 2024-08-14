'use client'

import { upsertSchema } from '@/lib/actions'
import { useCloseOnComplete } from '@/lib/hooks'
import { Schema } from '@prisma/client'
import { ReactNode } from 'react'
import { useFormState } from 'react-dom'
import { ActionButton } from './action-button'
import { DrawerDialog } from './drawer-dialog'
import { FormError } from './form-error'
import { DialogFooter } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

export function UpsertSchema({ children, schema }: { children: ReactNode; schema?: Schema }) {
	const [state, action] = useFormState(upsertSchema, null)
	const [open, onOpenChange] = useCloseOnComplete(state)

	return (
		<DrawerDialog title={`${schema ? 'Update' : 'Add'} Schema`} trigger={children} open={open} onOpenChange={onOpenChange}>
			<form action={action} className='grid gap-4'>
				<input type='hidden' name='id' value={schema?.id} />

				<div className='grid gap-2'>
					<Label htmlFor='name'>Name</Label>
					<Input id='name' name='name' placeholder='User' defaultValue={schema?.name} />
					<FormError value={state?.errors.name} />
				</div>
				<div className='grid gap-2'>
					<Label htmlFor='desc'>Description</Label>
					<Textarea id='name' name='desc' placeholder='A user of a social media application.' defaultValue={schema?.desc} />
					<FormError value={state?.errors.desc} />
				</div>
				<DialogFooter>
					<ActionButton className='w-full md:w-fit'>Save</ActionButton>
				</DialogFooter>
			</form>
		</DrawerDialog>
	)
}
