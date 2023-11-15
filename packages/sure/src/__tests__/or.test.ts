import { number, or, string } from '../index.js'
import type { InferEvil as InferBad, InferGood, InferInput, InferMeta, MetaNever, MetaObj, Sure } from '../index.js'
import { assertEqual } from './typeTestUtils.js'

const simple = or(number, string)

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
    first: Sure<'not number', number, unknown, MetaObj<undefined>>
    second: Sure<'not string', string, unknown, MetaObj<undefined>>
  }>
>(true)
//
//

describe('or', () => {
  it('should return good value', () => {
    const value = simple(1)

    expect(value).toStrictEqual([true, 1])
  })

  it('should return good value', () => {
    const value = simple('1')

    expect(value).toStrictEqual([true, '1'])
  })

  it('should return evil value', () => {
    const value = simple(true)

    expect(value).toStrictEqual([false, 'not number'])
  })

  it('should return evil value', () => {
    const value = simple({})

    expect(value).toStrictEqual([false, 'not number'])
  })
})
