'use client'

import { useCloseOnComplete } from '@/lib/hooks'
import { ReactNode } from 'react'
import { useFormState } from 'react-dom'
import { ActionButton } from './action-button'
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './ui/alert-dialog'

export function ConfirmDelete({ action: _action, children }: { action: () => Promise<any>; children: ReactNode }) {
	const [state, action] = useFormState(_action, null)
	const [open, onOpenChange] = useCloseOnComplete(state)

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete this item and remove the data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<form action={action}>
						<ActionButton className='w-full' variant='destructive'>
							Confirm
						</ActionButton>
					</form>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
