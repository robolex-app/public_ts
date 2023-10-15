import { good, sure, evil } from './core.js'

export const rawString = sure(x => {
  return typeof x === 'string' //
    ? good(x)
    : evil('not string' as const)
})
