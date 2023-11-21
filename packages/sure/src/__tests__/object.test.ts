import { describe, it, expect } from 'vitest'
import { object, bad, number, string, good, pure, sure } from '../index.js'
import type { InferBad, InferGood, InferInput, InferMeta, MetaNever, MetaObj, Pure, Sure } from '../index.js'
import { assertEqual } from './typeTestUtils.js'

const someObj = object({
  age: number,

  // with inner sure
  firstName: sure(value => (typeof value === 'string' ? good(value) : bad('not string (sure)' as const))),

  // with inner pure
  middleName: pure(value => (typeof value === 'string' ? good(value) : bad('not string (pure)' as const))),

  // with inner raw
  lastName: (value: unknown) =>
    typeof value === 'string' ? ([true, value] as const) : ([false, 'not string (raw)'] as const),

  address: object({
    country: string,
  }),
})

// TypeChecks
type InferredGood = InferGood<typeof someObj>
type InferredEvil = InferBad<typeof someObj>
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
      age: Sure<Pure<'not number', number, unknown>, MetaNever>
      firstName: Sure<Pure<'not string (sure)', string, unknown>, MetaObj<undefined>>
      middleName: Sure<Pure<'not string (pure)', string, unknown>, MetaNever>
      lastName: (value: unknown) => [true, string] | [false, 'not string (raw)']
      address: Sure<
        Pure<
          {
            country?: 'not string' | undefined
          },
          {
            country: string
          },
          unknown
        >,
        MetaObj<{
          country: Sure<Pure<'not string', string, unknown>, MetaObj<undefined>>
        }>
      >
    }
  }
>(true)

assertEqual<typeof someObj, Sure<Pure<InferredEvil, InferredGood, InferredInput>, InferredMeta>>(true)

describe('object', () => {
  it('should return good value', () => {
    const value = someObj({
      age: 12,
      address: {
        country: 'USA',
      },
      firstName: 'John',
      lastName: 'Doe',
      middleName: 'D.',
    })

    expect(value).toEqual([
      true,
      {
        age: 12,
        address: {
          country: 'USA',
        },
        firstName: 'John',
        lastName: 'Doe',
        middleName: 'D.',
      },
    ])
  })

  it('should return bad value', () => {
    const value = someObj({
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
        firstName: 'not string (sure)',
        lastName: 'not string (raw)',
        middleName: 'not string (pure)',
      },
    ])

    expect(value).toEqual(
      bad({
        address: {
          country: 'not string',
        },
        firstName: 'not string (sure)',
        lastName: 'not string (raw)',
        middleName: 'not string (pure)',
      })
    )
  })
})
