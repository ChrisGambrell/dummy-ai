import { useEffect, useState } from 'react'

// BUG: After submit, then submit again, the modal doesn't close
export const useCloseOnComplete = (state: any | undefined, defaultState = false) => {
	const [open, onOpenChange] = useState(defaultState)

	useEffect(() => {
		if (state === undefined) onOpenChange(false)
	}, [state])

	return [open, onOpenChange] as const
}
