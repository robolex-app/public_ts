import { good, sure, fail } from './core.js'

export const rawString = sure(x => {
  return typeof x === 'string' //
    ? good(x)
    : fail('not string' as const)
})
