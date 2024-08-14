import { SchemaCard } from '@/components/schema-card'
import { Button } from '@/components/ui/button'
import { UpsertSchema } from '@/components/upsert-schema'
import { createClient } from '@/lib/supabase/server'
import { PlusIcon } from 'lucide-react'

export default async function RootPage() {
	const supabase = createClient()
	const { data: schemas, error } = await supabase
		.from('schemas')
		.select('*, fields(*), generations(*)')
		.order('created_at', { ascending: false })
		.order('created_at', { referencedTable: 'fields' })
	if (error) throw error

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
