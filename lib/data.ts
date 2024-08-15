export type Request = {
	name: string
	description: string
	amount: number
	fields: Array<
		{ name: string; description: string; nullable?: boolean; unique?: boolean } & (
			| { type: 'boolean' | 'date' | 'decimal' | 'integer' | 'json' | 'string' }
			| { type: 'enum'; options: string[] }
		)
	>
}

export const ticket: Request = {
	name: 'Ticket',
	description: 'A ticket for an IT support system.',
	amount: 5,
	fields: [
		{ type: 'string', name: 'title', description: 'The title of the ticket.' },
		{ type: 'string', name: 'description', description: 'The description of the ticket.' },
		{ type: 'enum', name: 'priority', description: 'The priority of the ticket.', options: ['low', 'medium', 'high'] },
		{ type: 'enum', name: 'status', description: 'The status of the ticket.', options: ['open', 'closed', 'on hold'] },
		{ type: 'date', name: 'opened_date', description: 'The date the ticket was opened.' },
		{ type: 'date', name: 'due_date', description: 'The date the ticket is due.', nullable: true },
		{ type: 'date', name: 'closed_date', description: 'The date the ticket was closed.', nullable: true },
		{ type: 'integer', name: 'hours', description: 'The hours needed to complete the ticket.' },
		{ type: 'boolean', name: 'urgent', description: 'Whether the ticket is urgent or not.' },
		{ type: 'decimal', name: 'cost', description: 'The cost of the ticket.' },
	],
}
