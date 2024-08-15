'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import { ReactNode } from 'react'
import { useMediaQuery } from 'usehooks-ts'

export function DrawerDialog({
	children,
	className,
	description,
	title,
	trigger,
	open,
	onOpenChange,
}: {
	children: ReactNode
	className?: string
	description?: ReactNode
	title?: string
	trigger: ReactNode
	open?: boolean
	onOpenChange?: (open: boolean) => void
}) {
	const isDesktop = useMediaQuery('(min-width: 768px)')

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogTrigger asChild>{trigger}</DialogTrigger>
				<DialogContent className={className}>
					{(title || description) && (
						<DialogHeader>
							{title && <DialogTitle>{title}</DialogTitle>}
							{description && <DialogDescription>{description}</DialogDescription>}
						</DialogHeader>
					)}
					<div className='pt-2'>{children}</div>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerTrigger asChild>{trigger}</DrawerTrigger>
			<DrawerContent>
				{(title || description) && (
					<DrawerHeader className='text-left'>
						{title && <DrawerTitle>{title}</DrawerTitle>}
						{description && <DrawerDescription>{description}</DrawerDescription>}
					</DrawerHeader>
				)}
				<div className='px-4'>{children}</div>
				<DrawerFooter className='pt-2'>
					<DrawerClose asChild>
						<Button variant='outline'>Close</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
