import { logout } from '@/actions/auth'
import { ActionButton } from '@/components/action-button'
import { EmptyState } from '@/components/empty-state'
import { SchemaCard } from '@/components/schema-card'
import { Button } from '@/components/ui/button'
import { UpsertSchema } from '@/components/upsert-schema'
import prisma from '@/lib/db'
import { LogOutIcon, PlusIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function RootPage() {
	const schemas = await prisma.schema.findMany({
		include: { fields: { orderBy: { createdAt: 'asc' } }, generations: { orderBy: { createdAt: 'desc' } } },
		orderBy: { createdAt: 'desc' },
	})

	return (
		<div className='grid gap-4 md:gap-6 max-w-3xl mx-auto my-4 md:my-8 px-4'>
			<div className='ml-auto flex items-center gap-2'>
				<UpsertSchema>
					<Button>
						<PlusIcon className='size-4 mr-2' />
						Add schema
					</Button>
				</UpsertSchema>
				<form action={logout}>
					<ActionButton variant='destructive'>
						<LogOutIcon className='size-4 mr-2' />
						Logout
					</ActionButton>
				</form>
			</div>
			{schemas.length > 0 ? (
				schemas.map((schema) => <SchemaCard key={schema.id} schema={schema} />)
			) : (
				<EmptyState>No schemas yet.</EmptyState>
			)}
		</div>
	)
}
