import { describe, it, expect } from 'vitest'
import { object, bad, number, string, good, pure, sure, optional, union, literal, is, or } from '../index.js'
import type { InferBad, InferGood, InferInput, InferMeta, InferSchemaGood, MetaNever, MetaObj, Sure } from '../index.js'
import { assertEqual } from './typeTestUtils.js'
import { Prettify, PrettifyRec } from '../utils.js'
import { ExtractPrimitives, InferJustMeta } from '../meta.js'

const someObj = object({
  age: number,

  // with inner sure
  firstName: pure(value => (typeof value === 'string' ? good(value) : bad('not string (sure)'))),

  // with inner pure
  middleName: pure(value => (typeof value === 'string' ? good(value) : bad('not string (pure)'))),

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
      type: 'object'
      schema: {
        age: Sure<
          'not number',
          number,
          unknown,
          MetaObj<{
            type: 'number'
          }>
        >
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
            type: 'object'
            schema: {
              country: Sure<
                'not string',
                string,
                unknown,
                MetaObj<{
                  type: 'string'
                }>
              >
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

  describe('optionals', () => {
    it('should support optional properties', () => {
      const schema = object({
        name: string,
        age: optional(number),
      })

      // Ok when age is number
      expect(schema({ name: 'John', age: 12 })) //
        .toStrictEqual([true, { name: 'John', age: 12 }])

      // Not allow when age is undefined
      expect(schema({ name: 'John', age: undefined })) //
        .toStrictEqual([false, { age: 'not number' }])

      // Allow when age is not present !!
      expect(schema({ name: 'John' })) //
        .toStrictEqual([true, { name: 'John' }])
    })

    it('should combine with undefined and/or null', () => {
      const schema = object({
        name: string,
        age: optional(or(number, is(undefined))),
      })

      expect(schema({ name: 'John', age: 12 })) //
        .toStrictEqual([true, { name: 'John', age: 12 }])

      expect(schema({ name: 'John', age: undefined })) //
        .toStrictEqual([true, { name: 'John', age: undefined }])

      expect(schema({ name: 'John', age: null })) //
        // TODO: The error seems meh
        .toStrictEqual([false, { age: 'not literal undefined (undefined)' }])

      expect(schema({ name: 'John' })) //
        .toStrictEqual([true, { name: 'John' }])
    })
  })
})
