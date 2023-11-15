import { object, evil, number, string, sure, good, pure, InferGood } from '../index.js'
import type { InferEvil, InferInput, InferMeta, MetaNever, MetaObj, Sure } from '../index.js'
import { assertEqual } from './typeTestUtils.js'

const someObj = object({
  age: number,

  // with inner sure
  firstName: sure(value => (typeof value === 'string' ? good(value) : evil('not string (sure)' as const))),

  // with inner pure
  middleName: pure(value => (typeof value === 'string' ? good(value) : evil('not string (pure)' as const))),

  // with inner raw
  lastName: (value: unknown) =>
    typeof value === 'string' ? ([true, value] as const) : ([false, 'not string (raw)'] as const),

  address: object({
    country: string,
  }),
})

// TypeChecks
type InferredGood = InferGood<typeof someObj>
type InferredEvil = InferEvil<typeof someObj>
type InferredInput = InferInput<typeof someObj>
type InferredMeta = InferMeta<typeof someObj>

assertEqual<
  InferredGood,
  {
    age: number
    firstName: string
    middleName: string
    lastName: string
    address: {
      country: string
    }
  }
>(true)

assertEqual<
  InferredEvil,
  {
    age?: 'not number' | undefined
    firstName?: 'not string (sure)' | undefined
    middleName?: 'not string (pure)' | undefined
    lastName?: string | undefined
    address?:
      | {
          country?: 'not string' | undefined
        }
      | undefined
  }
>(true)

assertEqual<InferredInput, unknown>(true)

assertEqual<
  InferredMeta,
  {
    meta: {
      age: Sure<'not number', number, unknown, MetaObj<undefined>>
      firstName: Sure<'not string (sure)', string, unknown, MetaObj<undefined>>
      middleName: Sure<'not string (pure)', string, unknown, MetaNever>
      lastName: (value: unknown) => [true, string] | [false, 'not string (raw)']
      address: Sure<
        {
          country?: 'not string' | undefined
        },
        {
          country: string
        },
        unknown,
        MetaObj<{
          country: Sure<'not string', string, unknown, MetaObj<undefined>>
        }>
      >
    }
  }
>(true)

assertEqual<typeof someObj, Sure<InferredEvil, InferredGood, InferredInput, InferredMeta>>(true)

describe('object', () => {
  it('should return good value', () => {
    const value = someObj({
      name: 'John',
      age: 12,
      address: {
        country: 'USA',
      },
    })

    expect(value).toEqual([
      true,
      {
        name: 'John',
        age: 12,
        address: {
          country: 'USA',
        },
      },
    ])
  })

  it('should return evil value', () => {
    const value = someObj({
      name: 'John',
      age: 12,
      address: {
        country: 123,
      },
    })

    expect(value).toEqual([
      false,
      {
        address: {
          country: 'not string',
        },
      },
    ])

    expect(value).toEqual(
      evil({
        address: {
          country: 'not string',
        },
      })
    )
  })
})
