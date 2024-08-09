import { describe, it, expect } from 'vitest'
import { number, intersection, string, object } from '../index.js'
import type { InferBad, InferGood, InferInput, InferMeta, InferSchemaGood, MetaNever, MetaObj, Sure } from '../index.js'
import { assertEqual } from './typeTestUtils.js'

const option1 = object({
  name: string,
})

const simple = intersection(
  option1,
  object({
    age: number,
  })
)

// TypeChecks
type InferredGood = InferGood<typeof simple>
type InferredBad = InferBad<typeof simple>
type InferredInput = InferInput<typeof simple>
type InferredMeta = InferMeta<typeof simple>

assertEqual<InferredGood, { name: string } & { age: number }>(true)
assertEqual<InferredBad, { name?: 'not string' } | { age?: 'not number' }>(true)
assertEqual<InferredInput, unknown>(true) // The input needs more tests
assertEqual<
  InferredMeta,
  {
    meta: {
      type: 'intersection'
      first: Sure<
        {
          name?: 'not string'
        },
        {
          name: string
        },
        unknown,
        MetaObj<{
          type: 'object'
          schema: {
            name: Sure<'not string', string, unknown, MetaObj<undefined>>
          }
        }>
      >
      second: Sure<
        {
          age?: 'not number'
        },
        {
          age: number
        },
        unknown,
        MetaObj<{
          type: 'object'
          schema: {
            age: Sure<'not number', number, unknown, MetaNever>
          }
        }>
      >
    }
  }
>(true)

//
//
describe('and', () => {
  it('should return good value', () => {
    const value = simple({
      name: '1',
      age: 1,
    })

    expect(value).toStrictEqual([true, { name: '1', age: 1 }])

    // TypeChecks
    if (value[0] === true) {
      assertEqual<(typeof value)[1], { name: string } & { age: number }>(true)
    }
  })

  it('should return bad value', () => {
    const value = simple({
      name: 1,
      age: 1,
    })

    expect(value).toStrictEqual([false, { name: 'not string' }])

    // TypeChecks
    if (value[0] === false) {
      assertEqual<
        (typeof value)[1],
        | {
            name?: 'not string'
          }
        | {
            age?: 'not number'
          }
      >(true)
    }
  })

  it('should return bad value', () => {
    const value = simple({
      name: '1',
      age: '1',
    })

    expect(value).toStrictEqual([false, { age: 'not number' }])
  })
})
