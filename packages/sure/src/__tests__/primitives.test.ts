import { InferEvil, InferGood, InferInput, Sure, good, sure, bad, InferMeta, MetaObj } from '../index.js'
import { assertEqual } from './typeTestUtils.js'

export const nonEmptyString = sure(x => {
  return typeof x === 'string' //
    ? good(x)
    : bad('not string' as const)
})

describe('primitives', () => {
  it('should return good value', () => {
    nonEmptyString('1')

    assertEqual<typeof nonEmptyString, Sure<'not string', string, unknown, MetaObj<undefined>>>(true)

    assertEqual<InferGood<typeof nonEmptyString>, string>(true)
    assertEqual<InferEvil<typeof nonEmptyString>, 'not string'>(true)
    assertEqual<InferInput<typeof nonEmptyString>, unknown>(true)
    assertEqual<InferMeta<typeof nonEmptyString>, MetaObj<undefined>>(true)
  })
})
