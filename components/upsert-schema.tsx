'use client'

import { importSchema, upsertSchema } from '@/actions/schema'
import { Schema } from '@prisma/client'
import { ReactNode } from 'react'
import { useFormState } from 'react-dom'
import { ActionButton } from './action-button'
import { DrawerDialog } from './drawer-dialog'
import { FormError } from './form-error'
import { DialogFooter } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Textarea } from './ui/textarea'

export function UpsertSchema({ children, schema }: { children: ReactNode; schema?: Schema }) {
	const [formState, formAction] = useFormState(upsertSchema, null)
	const [importState, importAction] = useFormState(importSchema, null)

	return (
		<DrawerDialog title={`${schema ? 'Update' : 'Add'} Schema`} trigger={children}>
			<Tabs defaultValue='form'>
				<TabsList className='grid w-full grid-cols-2 mb-4'>
					<TabsTrigger value='form'>Form</TabsTrigger>
					<TabsTrigger value='import'>Import</TabsTrigger>
				</TabsList>
				<TabsContent value='form'>
					<form action={formAction} className='grid gap-4'>
						<input type='hidden' name='id' value={schema?.id} />

						<div className='grid gap-2'>
							<Label htmlFor='name'>Name</Label>
							<Input id='name' name='name' placeholder='User' defaultValue={schema?.name} />
							<FormError value={formState?.errors.name} />
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='desc'>Description</Label>
							<Textarea
								id='name'
								name='desc'
								placeholder='A user of a social media application.'
								defaultValue={schema?.desc}
							/>
							<FormError value={formState?.errors.desc} />
						</div>
						<DialogFooter>
							<ActionButton className='w-full md:w-fit'>Save</ActionButton>
						</DialogFooter>
					</form>
				</TabsContent>
				<TabsContent value='import'>
					<form action={importAction} className='grid gap-4'>
						<div className='grid gap-2'>
							<Label htmlFor='code'>Code</Label>
							<Textarea id='name' name='code' placeholder='Import code here...' rows={16} />
							<FormError value={importState?.errors.code} />
						</div>
						<DialogFooter>
							<ActionButton className='w-full md:w-fit'>Save</ActionButton>
						</DialogFooter>
					</form>
				</TabsContent>
			</Tabs>
		</DrawerDialog>
	)
}
