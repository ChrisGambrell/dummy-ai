'use client'

import { upsertRule } from '@/lib/actions'
import { useCloseOnComplete } from '@/lib/hooks'
import { Rule, Schema } from '@prisma/client'
import { ReactNode } from 'react'
import { useFormState } from 'react-dom'
import { ActionButton } from './action-button'
import { DrawerDialog } from './drawer-dialog'
import { FormError } from './form-error'
import { DialogFooter } from './ui/dialog'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

export function UpsertRule({ children, rule, schemaId }: { children: ReactNode; rule?: Rule; schemaId: Schema['id'] }) {
	const [state, action] = useFormState(upsertRule, null)
	const [open, onOpenChange] = useCloseOnComplete(state)

	return (
		<DrawerDialog title={`${rule ? 'Update' : 'Add'} Rule`} trigger={children} open={open} onOpenChange={onOpenChange}>
			<form action={action} className='grid gap-4'>
				<input type='hidden' name='id' value={rule?.id} />
				<input type='hidden' name='schemaId' value={rule?.schemaId ?? schemaId} />

				<div className='grid gap-2'>
					<Label htmlFor='rule'>Rule</Label>
					<Textarea
						id='rule'
						name='rule'
						placeholder='Have an increase of DOBs from 2/17/84 - 12/12/84.'
						defaultValue={rule?.rule}
					/>
					<FormError value={state?.errors.rule} />
				</div>
				<DialogFooter>
					<ActionButton className='w-full md:w-fit'>Save</ActionButton>
				</DialogFooter>
			</form>
		</DrawerDialog>
	)
}
