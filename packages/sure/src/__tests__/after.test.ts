import { describe, it, expect } from 'vitest'
import {
  good,
  bad,
  after,
  MetaObj,
  MetaNever,
  InferGood,
  InferBad,
  InferInput,
  InferMeta,
  object,
  string,
  Sure,
  Good,
  Bad,
} from '../index.js'
import { assertEqual, assertIs } from './typeTestUtils.js'

const sureNumber = (value: unknown) =>
  typeof value === 'number' //
    ? good(value)
    : bad('not number')

const positiveNum = (value: number) => {
  if (value > 0) {
    return [true, value] as const
  }

  return [false, 'not positive'] as const
}

const combined = after(sureNumber, positiveNum)

{
  type InferredGood = InferGood<typeof positiveNum>
  type InferredBad = InferBad<typeof positiveNum>
  type InferredInput = InferInput<typeof positiveNum>
  type InferredMeta = InferMeta<typeof positiveNum>

  assertEqual<InferredGood, number>(true)
  assertEqual<InferredBad, 'not positive'>(true)
  assertEqual<InferredInput, number>(true)

  // TODO: Not liking this, should it by MetaNever by default?
  assertEqual<InferredMeta, MetaNever | MetaObj>(true)
}

{
  type InferredSure = typeof combined

  type InferredGood = InferGood<typeof combined>
  type InferredBad = InferBad<typeof combined>
  type InferredInput = InferInput<typeof combined>
  type InferredMeta = InferMeta<typeof combined>

  assertEqual<InferredGood, number>(true)
  assertEqual<InferredBad, 'not positive' | 'not number'>(true)
  assertEqual<InferredInput, unknown>(true)
  assertEqual<
    InferredMeta,
    MetaObj<{
      first: typeof sureNumber
      second: typeof positiveNum
    }>
  >(true)
}

/*
Big Object
 */

const sureBig = after(
  object({
    age: after(sureNumber, val => {
      if (val % 1 !== 0) return bad('not integer')
      if (val < 0) return bad('not positive')
      if (val > 200) return bad('too old, sorry')

      return good(val)
    }),
    name: string,
  }),
  val => {
    if (val.name === 'john' && val.age < 30) {
      return bad({ name: `john's below 30 are too young` as const })
    }

    return good(val)
  }
)

{
  type InferredGood = InferGood<typeof sureBig>
  type InferredBad = InferBad<typeof sureBig>
  type InferredInput = InferInput<typeof sureBig>
  type InferredMeta = InferMeta<typeof sureBig>

  assertEqual<InferredInput, unknown>(true)
  assertEqual<
    InferredGood,
    {
      age: number
      name: string
    }
  >(true)

  assertEqual<
    InferredBad,
    | {
        age?: 'not number' | 'not positive' | 'not integer' | 'too old, sorry'
        name?: 'not string'
      }
    | {
        name: "john's below 30 are too young"
      }
  >(true)

  assertEqual<
    InferredMeta,
    {
      meta: {
        first: Sure<
          {
            age?: 'not number' | 'not integer' | 'not positive' | 'too old, sorry'
            name?: 'not string'
          },
          {
            age: number
            name: string
          },
          unknown,
          MetaObj<{
            parent: typeof object
            schema: {
              age: Sure<
                'not number' | 'not integer' | 'not positive' | 'too old, sorry',
                number,
                unknown,
                MetaObj<{
                  first: typeof sureNumber
                  second: (
                    val: number
                  ) => Good<number> | Bad<'not integer'> | Bad<'not positive'> | Bad<'too old, sorry'>
                }>
              >
              name: Sure<'not string', string, unknown, MetaObj<undefined>>
            }
          }>
        >

        second: (val: { age: number; name: string }) =>
          | Good<{
              age: number
              name: string
            }>
          | Bad<{
              name: "john's below 30 are too young"
            }>
      }
    }
  >(true)
}

describe('after', () => {
  it('should correctly run', () => {
    const [ok, out] = combined(1)

    expect(ok).toBe(true)
    expect(out).toBe(1)

    {
      // DX checks
      assertIs<boolean>(ok)
      assertIs<number | 'not number' | 'not positive'>(out)

      if (ok) {
        assertIs<number>(out)
      } else {
        assertIs<'not number' | 'not positive'>(out)
      }
    }
  })
})
