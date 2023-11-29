import { Sure } from '../core.js'

const jjj = ((value: unknown) => {
  if (typeof value === 'string') {
    return [true, value] as const
  }

  return [false, value] as const
}) satisfies Sure
