import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { ServerProps } from '@cgambrell/utils'
import { notFound } from 'next/navigation'

export default async function Generation({ params: { generationId } }: ServerProps) {
	const supabase = await createClient()

	const { data: generation, error } = await supabase.from('generations').select('*, schema:schemas(*)').eq('id', generationId).single()
	if (error) throw error
	else if (!generation) notFound()

	return (
		<Card className='max-w-3xl mx-auto mt-12 mb-8'>
			<CardHeader>
				<CardTitle>{generation.schema?.name} generation</CardTitle>
				<CardDescription>Generated on {new Date(generation.created_at).toLocaleString()}</CardDescription>
			</CardHeader>
			<CardContent>
				<pre>{JSON.stringify(generation.data, null, 2)}</pre>
			</CardContent>
		</Card>
	)
}
