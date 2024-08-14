import { SchemaCard } from '@/components/schema-card'
import { Button } from '@/components/ui/button'
import { UpsertSchema } from '@/components/upsert-schema'
import prisma from '@/lib/db'
import { PlusIcon } from 'lucide-react'

export default async function RootPage() {
	const schemas = await prisma.schema.findMany({
		include: { fields: { orderBy: { createdAt: 'asc' } }, generations: true },
		orderBy: { createdAt: 'desc' },
	})

	return (
		<div className='grid gap-6 max-w-3xl mx-auto mt-12 mb-8'>
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
