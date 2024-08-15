import { SchemaCard } from '@/components/schema-card'
import { Button } from '@/components/ui/button'
import { UpsertSchema } from '@/components/upsert-schema'
import prisma from '@/lib/db'
import { PlusIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function RootPage() {
	const schemas = await prisma.schema.findMany({
		include: { fields: { orderBy: { createdAt: 'asc' } }, generations: { orderBy: { createdAt: 'desc' } } },
		orderBy: { createdAt: 'desc' },
	})

	return (
		<div className='grid gap-4 md:gap-6 max-w-3xl mx-auto my-4 md:my-8 px-4'>
			<div className='ml-auto'>
				<UpsertSchema>
					<Button>
						<PlusIcon className='size-4 mr-2' />
						Add schema
					</Button>
				</UpsertSchema>
			</div>
			{schemas.map((schema) => (
				<SchemaCard key={schema.id} schema={schema} />
			))}
		</div>
	)
}
