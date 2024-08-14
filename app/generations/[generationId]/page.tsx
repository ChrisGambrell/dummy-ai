import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/lib/db'
import { ServerProps } from '@cgambrell/utils'
import { notFound } from 'next/navigation'

export default async function Generation({ params: { generationId } }: ServerProps) {
	const generation = await prisma.generation.findUnique({ where: { id: generationId }, include: { schema: true } })
	if (!generation) notFound()

	return (
		<Card className='max-w-3xl mx-auto mt-12 mb-8'>
			<CardHeader>
				<CardTitle>{generation.schema?.name} generation</CardTitle>
				<CardDescription>Generated on {generation.createdAt.toLocaleString()}</CardDescription>
			</CardHeader>
			<CardContent>
				<pre>{JSON.stringify(generation.data, null, 2)}</pre>
			</CardContent>
		</Card>
	)
}
