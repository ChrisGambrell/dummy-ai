'use client'

import { addGeneration } from '@/actions/generations'
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

export function AddGeneration({ children, schemaId }: { children: ReactNode; schemaId: Schema['id'] }) {
	const [state, action] = useFormState(addGeneration, null)
	const [open, onOpenChange] = useCloseOnComplete(state)

	return (
		<DrawerDialog title='Add Generation' trigger={children} open={open} onOpenChange={onOpenChange}>
			<form action={action} className='grid gap-4'>
				<input type='hidden' name='schemaId' value={schemaId} />

				<div className='grid gap-2'>
					<Label htmlFor='rows'>Number of rows</Label>
					<Input id='rows' name='rows' defaultValue={10} />
					<FormError value={state?.errors.rows} />
				</div>
				<DialogFooter>
					<ActionButton className='w-full md:w-fit'>Generate</ActionButton>
				</DialogFooter>
			</form>
		</DrawerDialog>
	)
}
