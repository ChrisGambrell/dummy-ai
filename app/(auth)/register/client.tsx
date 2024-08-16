'use client'

import { register } from '@/actions/auth'
import { ActionButton } from '@/components/action-button'
import { FormError } from '@/components/form-error'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from 'react-dom'

export function RegisterClient() {
	const [state, action] = useFormState(register, null)

	return (
		<form action={action} className='grid gap-4'>
			<div className='grid grid-cols-2 gap-4'>
				<div className='grid gap-2'>
					<Label htmlFor='firstName'>First name</Label>
					<Input id='firstName' name='firstName' placeholder='Max' />
					<FormError value={state?.errors.firstName} />
				</div>
				<div className='grid gap-2'>
					<Label htmlFor='lastName'>Last name</Label>
					<Input id='lastName' name='lastName' placeholder='Robinson' />
					<FormError value={state?.errors.lastName} />
				</div>
			</div>
			<div className='grid gap-2'>
				<Label htmlFor='email'>Email</Label>
				<Input id='email' name='email' placeholder='m@example.com' />
				<FormError value={state?.errors.email} />
			</div>
			<div className='grid gap-2'>
				<Label htmlFor='password'>Password</Label>
				<Input id='password' name='password' type='password' />
				<FormError value={state?.errors.password} />
			</div>
			<div className='grid gap-2'>
				<Label htmlFor='confirmPassword'>Confirm password</Label>
				<Input id='confirmPassword' name='confirmPassword' type='password' />
				<FormError value={state?.errors.confirmPassword} />
			</div>
			<ActionButton>Create an account</ActionButton>
		</form>
	)
}
