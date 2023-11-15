import { number, and, string, object } from '../index.js'
import type { InferEvil as InferBad, InferGood, InferInput, InferMeta, MetaNever, MetaObj, Sure } from '../index.js'
import { assertEqual } from './typeTestUtils.js'

const option1 = object({
  name: string,
})

const simple = and(
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
assertEqual<InferredBad, { name?: 'not string' | undefined } | { age?: 'not number' | undefined }>(true)
assertEqual<InferredInput, unknown>(true) // The input needs more tests
assertEqual<
  InferredMeta,
  MetaObj<{
    first: typeof option1
    second: Sure<
      {
        age?: 'not number' | undefined
      },
      {
        age: number
      },
      unknown,
      MetaObj<{
        age: Sure<'not number', number, unknown, MetaObj<undefined>>
      }>
    >
  }>
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

  it('should return evil value', () => {
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
            name?: 'not string' | undefined
          }
        | {
            age?: 'not number' | undefined
          }
      >(true)
    }
  })

  it('should return evil value', () => {
    const value = simple({
      name: '1',
      age: '1',
    })

    expect(value).toStrictEqual([false, { age: 'not number' }])
  })
})
