import { describe, it, expect } from 'vitest'
import { array, number } from '../index.js'
import type { InferGood, InferBad, InferInput, InferMeta, Sure, MetaObj, MetaNever } from '../index.js'
import { assertEqual } from './typeTestUtils.js'

const someArray = array(number)

// Type Checks
type InferredSure = typeof someArray
type InferredGood = InferGood<typeof someArray>
type InferredBad = InferBad<typeof someArray>
type InferredInput = InferInput<typeof someArray>
type InferredMeta = InferMeta<typeof someArray>

assertEqual<InferredGood, number[]>(true)
assertEqual<InferredBad, ('not number' | undefined)[]>(true)
assertEqual<InferredInput, unknown>(true)
assertEqual<
  InferredMeta,
  {
    meta: {
      parent: typeof array

      schema: Sure<'not number', number, unknown, MetaNever>
    }
  }
>(true)

describe('array', () => {
  it('should return good value', () => {
    const value = someArray([1, 2, 3])

    expect(value).toStrictEqual([true, [1, 2, 3]])
  })

  it('should return bad value', () => {
    const value = someArray([1, 'two', 3])

    expect(value).toStrictEqual([false, [undefined, 'not number', undefined]])
  })
})
