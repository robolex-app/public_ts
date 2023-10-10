import { InferFail, InferGood, InferInput, Sure, good, sure, fail, InferMeta } from '../index.js'
import { assertEqual } from './typeTestUtils.js'

export const nonEmptyString = sure(x => {
  return typeof x === 'string' //
    ? good(x)
    : fail('not string' as const)
})

describe('primitives', () => {
  it('should return good value', () => {
    nonEmptyString('1')

    assertEqual<typeof nonEmptyString, Sure<'not string', string, unknown, never>>(true)

    assertEqual<InferGood<typeof nonEmptyString>, string>(true)
    assertEqual<InferFail<typeof nonEmptyString>, 'not string'>(true)
    assertEqual<InferInput<typeof nonEmptyString>, unknown>(true)
    assertEqual<InferMeta<typeof nonEmptyString>, never>(true)
  })
})
