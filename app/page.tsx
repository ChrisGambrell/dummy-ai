import { logout } from '@/actions/auth'
import { EmptyState } from '@/components/empty-state'
import { SchemaCard } from '@/components/schema-card'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UpsertSchema } from '@/components/upsert-schema'
import prisma from '@/lib/db'
import { BirdIcon, LogOutIcon, PlusIcon, User2Icon } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function RootPage() {
	const schemas = await prisma.schema.findMany({
		include: { fields: { orderBy: { createdAt: 'asc' } }, generations: { orderBy: { createdAt: 'desc' } }, rules: true, user: true },
		orderBy: { createdAt: 'desc' },
	})

	return (
		<div className='grid gap-4 md:gap-6 max-w-3xl mx-auto my-4 md:my-8 px-4'>
			<div className='flex gap-4 items-end'>
				<h1 className='text-3xl font-black'>
					<BirdIcon className='size-8 -ml-[10px] -mb-3' />
					<span>DummyAI</span>
				</h1>
				<div className='ml-auto flex items-center gap-3'>
					<UpsertSchema>
						<Button>
							<PlusIcon className='size-4 mr-2' />
							Add schema
						</Button>
					</UpsertSchema>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline' size='icon' className='rounded-full flex items-center justify-center'>
								<User2Icon className='size-5' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<form action={logout}>
									<button className='w-full text-left flex items-center' type='submit'>
										<LogOutIcon className='size-4 mr-2' />
										Logout
									</button>
								</form>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			{schemas.length > 0 ? (
				schemas.map((schema) => <SchemaCard key={schema.id} schema={schema} />)
			) : (
				<EmptyState>No schemas yet.</EmptyState>
			)}
		</div>
	)
}
