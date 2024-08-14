'use client'

import { deleteField } from '@/lib/actions'
import { Field } from '@prisma/client'
import { Trash2Icon } from 'lucide-react'
import { ConfirmDelete } from './confirm-delete'
import { DropdownMenuItem } from './ui/dropdown-menu'

export function DeleteFieldButton({ fieldId }: { fieldId: Field['id'] }) {
	return (
		<ConfirmDelete action={deleteField.bind(null, { id: fieldId })}>
			<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
				<Trash2Icon className='size-4 mr-2' />
				<span>Delete</span>
			</DropdownMenuItem>
		</ConfirmDelete>
	)
}
