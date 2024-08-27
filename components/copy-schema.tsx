import prisma from '@/lib/db'
import { Prisma, Schema } from '@prisma/client'
import { FilesIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { CopyButton } from './copy-button'
import { DrawerDialog } from './drawer-dialog'
import { Button } from './ui/button'

export async function CopySchema({ children, schemaId }: { children: ReactNode; schemaId: Schema['id'] }) {
	const schema = await prisma.schema.findUnique({ where: { id: schemaId }, include: { fields: true, rules: true } })
	if (!schema) return null

	function getValue() {
		if (!schema) return null

		const { id, createdAt, updatedAt, userId, ...s } = schema
		const f = schema.fields.map(({ id, createdAt, updatedAt, schemaId, userId, ...f }) => f)
		const r = schema.rules.map(({ id, createdAt, updatedAt, schemaId, userId, ...r }) => r)

		return JSON.stringify({ ...s, fields: f, rules: r }, null, 2)
	}

	return (
		<DrawerDialog className='max-w-2xl' title={schema.name} trigger={children}>
			<div className='grid gap-2'>
				<CopyButton value={getValue() ?? ''}>
					<Button className='md:w-fit'>
						<FilesIcon className='size-4 mr-2' />
						<span>Copy schema</span>
					</Button>
				</CopyButton>
				<div className='bg-muted rounded-lg text-xs p-2'>
					<pre className='text-wrap'>{getValue()}</pre>
				</div>
			</div>
		</DrawerDialog>
	)
}
