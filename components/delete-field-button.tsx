'use client'

import { deleteField } from '@/lib/actions'
import { Row } from '@/lib/supabase/types'
import { Trash2Icon } from 'lucide-react'
import { ConfirmDelete } from './confirm-delete'
import { DropdownMenuItem } from './ui/dropdown-menu'

export function DeleteFieldButton({ fieldId }: { fieldId: Row<'fields'>['id'] }) {
	return (
		<ConfirmDelete action={deleteField.bind(null, { id: fieldId })}>
			<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
				<Trash2Icon className='size-4 mr-2' />
				<span>Delete</span>
			</DropdownMenuItem>
		</ConfirmDelete>
	)
}
