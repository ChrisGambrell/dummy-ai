import { deleteRule } from '@/actions/rules'
import { Rule } from '@prisma/client'
import { EditIcon, EllipsisIcon, Trash2Icon } from 'lucide-react'
import { ConfirmDelete } from './confirm-delete'
import { Button } from './ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Label } from './ui/label'
import { UpsertRule } from './upsert-rule'

export function RulesList({ rules }: { rules: Array<Rule> }) {
	return (
		<div className='grid gap-2 w-full'>
			<Label className='text-base'>Rules</Label>
			<div className='grid divide-y'>
				{rules.map((rule) => (
					<div key={rule.id} className='text-sm py-3 first:pt-0 last:pb-0 flex justify-between gap-4'>
						{/* BUG: Overflow is bad */}
						<div className='flex-1'>{rule.rule}</div>
						<div className='flex-shrink-0 flex items-center'>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button className='h-8 px-2' variant='outline'>
										<EllipsisIcon className='size-4' />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuLabel>Actions</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<UpsertRule rule={rule} schemaId={rule.schemaId}>
										<DropdownMenuItem preventDefault>
											<EditIcon className='size-4 mr-2' />
											<span>Edit</span>
										</DropdownMenuItem>
									</UpsertRule>
									<ConfirmDelete action={deleteRule.bind(null, { id: rule.id })}>
										<DropdownMenuItem preventDefault>
											<Trash2Icon className='size-4 mr-2' />
											<span>Delete</span>
										</DropdownMenuItem>
									</ConfirmDelete>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
