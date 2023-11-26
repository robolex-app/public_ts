import { describe, it, expect } from 'vitest'
import { number, union, string } from '../index.js'
import type { InferBad, InferGood, InferInput, InferMeta, MetaNever, MetaObj, Sure } from '../index.js'
import { assertEqual } from './typeTestUtils.js'

const simple = union(number, string)

// TypeChecks
type InferredGood = InferGood<typeof simple>
type InferredBad = InferBad<typeof simple>
type InferredInput = InferInput<typeof simple>
type InferredMeta = InferMeta<typeof simple>

assertEqual<InferredGood, number | string>(true)
assertEqual<InferredBad, 'not number' | 'not string'>(true)
assertEqual<InferredInput, unknown>(true)
assertEqual<
  InferredMeta,
  MetaObj<{
    first: Sure<'not number', number, unknown, MetaNever>
    second: Sure<'not string', string, unknown, MetaObj<undefined>>
  }>
>(true)
//
//

describe('or', () => {
  it('should return good value', () => {
    const value = simple(1)

    expect(value).toStrictEqual([true, 1])

    // TypeChecks
    if (value[0] === true) {
      assertEqual<(typeof value)[1], number | string>(true)
    }
  })

  it('should return good value', () => {
    const value = simple('1')

    expect(value).toStrictEqual([true, '1'])

    // TypeChecks
    if (value[0] === true) {
      assertEqual<(typeof value)[1], number | string>(true)
    }
  })

  it('should return bad value', () => {
    const value = simple(true)

    expect(value).toStrictEqual([false, 'not string'])

    // TypeChecks
    if (value[0] === false) {
      assertEqual<(typeof value)[1], 'not number' | 'not string'>(true)
    }
  })

  it('if first value bad, return second', () => {
    const value = simple({})

    expect(value).toStrictEqual([false, 'not string'])
  })
})
