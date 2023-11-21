import { describe, it, expect } from 'vitest'
import { tuple, number, string, boolean, good, bad } from '../index.js'
import type { InferGood, InferBad, InferInput, InferMeta, Sure, MetaObj, Pure, MetaNever } from '../index.js'
import { assertEqual } from './typeTestUtils.js'

const someTuple = tuple([number, string, boolean])

// Type Checks
type InferredSure = typeof someTuple
type InferredGood = InferGood<typeof someTuple>
type InferredEvil = InferBad<typeof someTuple>
type InferredInput = InferInput<typeof someTuple>
type InferredMeta = InferMeta<typeof someTuple>

assertEqual<InferredGood, [number, string, boolean]>(true)
assertEqual<InferredEvil, ['not number' | undefined, 'not string' | undefined, 'not boolean' | undefined]>(true)
assertEqual<InferredInput, unknown>(true)
assertEqual<
  InferredMeta,
  {
    meta: [
      Sure<Pure<'not number', number, unknown>, MetaNever>,
      Sure<Pure<'not string', string, unknown>, MetaObj<undefined>>,
      Pure<'not boolean', boolean, unknown>,
    ]
  }
>(true)

describe('array', () => {
  it('should return good value', () => {
    const value = someTuple([1, 'hello', true])

    const expected: InferGood<typeof someTuple> = [1, 'hello', true]

    expect(value).toStrictEqual(good(expected))
  })

  it('should return bad value', () => {
    const value = someTuple([1, 'two', 3])

    const expected: InferBad<typeof someTuple> = [undefined, undefined, 'not boolean']

    expect(value).toStrictEqual(bad(expected))
  })
})