import { array, evil, number } from '../index.js'
import type { InferGood, InferEvil, InferInput, InferMeta, Sure, MetaObj } from '../index.js'
import { assertEqual } from './typeTestUtils.js'

const someArray = array(number)

// Type Checks
type InferredSure = typeof someArray
type InferredGood = InferGood<typeof someArray>
type InferredEvil = InferEvil<typeof someArray>
type InferredInput = InferInput<typeof someArray>
type InferredMeta = InferMeta<typeof someArray>

assertEqual<InferredGood, number[]>(true)
assertEqual<InferredEvil, ('not number' | undefined)[]>(true)
assertEqual<InferredInput, unknown>(true)
assertEqual<
  InferredMeta,
  {
    meta: Sure<'not number', number, unknown, MetaObj<undefined>>
  }
>(true)

describe('array', () => {
  it('should return good value', () => {
    const value = someArray([1, 2, 3])

    expect(value).toStrictEqual([true, [1, 2, 3]])
  })

  it('should return evil value', () => {
    const value = someArray([1, 'two', 3])

    expect(value).toStrictEqual([false, [undefined, 'not number', undefined]])
  })
})
