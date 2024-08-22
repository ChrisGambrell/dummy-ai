'use client'

import { oauth } from '@/actions/auth'
import { ActionButton } from '@/components/action-button'
import { FormError } from '@/components/form-error'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from 'react-dom'

export function LoginClient() {
	const [state, action] = useFormState(oauth.bind(null, 'resend'), null)

	return (
		<form action={action} className='grid gap-4'>
			<div className='grid gap-2'>
				<Label htmlFor='email'>Email</Label>
				<Input id='email' name='email' placeholder='m@example.com' />
				<FormError value={state?.errors.email} />
			</div>
			<ActionButton>Login</ActionButton>
			<ActionButton formAction={oauth.bind(null, 'github', null)} variant='outline'>
				Login with Github
			</ActionButton>
		</form>
	)
}
