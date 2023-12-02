import { describe, it, expect } from 'vitest'
import { object, bad, number, string, good, pure, sure } from '../index.js'
import type { InferBad, InferGood, InferInput, InferMeta, MetaNever, MetaObj, Sure } from '../index.js'
import { assertEqual } from './typeTestUtils.js'

const someObj = object({
  age: number,

  // with inner sure
  firstName: pure(value => (typeof value === 'string' ? good(value) : bad('not string (sure)' as const))),

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
type InferredBad = InferBad<typeof someObj>
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
  InferredBad,
  {
    age?: 'not number'
    firstName?: 'not string (sure)'
    middleName?: 'not string (pure)'
    lastName?: 'not string (raw)'
    address?: {
      country?: 'not string'
    }
  }
>(true)

assertEqual<InferredInput, unknown>(true)

assertEqual<
  InferredMeta,
  {
    meta: {
      parent: <TPropFail, TPropGood, TSchema extends Record<string, Sure<TPropFail, TPropGood, unknown>>>(
        schema: TSchema
      ) => Sure<
        { [K in keyof TSchema & string]?: InferBad<TSchema[K]> },
        { [K in keyof TSchema & string]: InferGood<TSchema[K]> },
        unknown,
        MetaObj<{
          parent: typeof object
          schema: TSchema
        }>
      >
      schema: {
        age: Sure<'not number', number, unknown, MetaNever>
        firstName: Sure<'not string (sure)', string, unknown, MetaNever>
        middleName: Sure<'not string (pure)', string, unknown, MetaNever>
        lastName: (value: unknown) => readonly [true, string] | readonly [false, 'not string (raw)']
        address: Sure<
          {
            country?: 'not string'
          },
          {
            country: string
          },
          unknown,
          MetaObj<{
            parent: <TPropFail, TPropGood, TSchema extends Record<string, Sure<TPropFail, TPropGood, unknown>>>(
              schema: TSchema
            ) => Sure<
              { [K in keyof TSchema & string]?: InferBad<TSchema[K]> },
              { [K in keyof TSchema & string]: InferGood<TSchema[K]> },
              unknown,
              MetaObj<{
                parent: typeof object
                schema: TSchema
              }>
            >
            schema: {
              country: Sure<'not string', string, unknown, MetaObj<undefined>>
            }
          }>
        >
      }
    }
  }
>(true)

assertEqual<typeof someObj, Sure<InferredBad, InferredGood, InferredInput, InferredMeta>>(true)

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
