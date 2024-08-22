import { logout } from '@/actions/auth'
import icon from '@/app/icon.png'
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
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { LogOutIcon, PlusIcon, User2Icon } from 'lucide-react'
import Image from 'next/image'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function RootPage() {
	const user = await auth()

	const schemas = await prisma.schema.findMany({
		where: { userId: user.id },
		include: { fields: { orderBy: { createdAt: 'asc' } }, generations: { orderBy: { createdAt: 'desc' } } },
		orderBy: { createdAt: 'desc' },
	})

	return (
		<div className='grid gap-4 md:gap-6 max-w-3xl mx-auto my-4 md:my-8 px-4'>
			<div className='flex gap-4 items-end'>
				<Image className='rounded-lg size-10 sm:size-12' src={icon} width={40} height={40} alt='Dummy AI' />
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
