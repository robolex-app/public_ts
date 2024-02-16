import { describe, expect, it } from 'vitest'
import {
  InferBad,
  InferGood,
  InferInput,
  InferMeta,
  MetaNever,
  MetaObj,
  Sure,
  number,
  object,
  optional,
  or,
  string,
  undef,
} from '../index.js'

import { assertEqual } from './typeTestUtils.js'

const optionalObj = object({
  name: string,
  // There's a difference, see `exactOptionalPropertyTypes`
  age: optional(number),

  lastName: optional(or(string, undef)),
})

// TypeChecks
type InferredGood = InferGood<typeof optionalObj>
type InferredBad = InferBad<typeof optionalObj>
type InferredInput = InferInput<typeof optionalObj>
type InferredMeta = InferMeta<typeof optionalObj>

assertEqual<
  InferredGood,
  {
    name: string
    age?: number
    lastName?: string | undefined
  }
>(true)

assertEqual<
  InferredBad,
  {
    name?: 'not string'
    age?: 'not number'
    lastName?: 'not string' | 'not undefined'
  }
>(true)

assertEqual<InferredInput, unknown>(true)

assertEqual<
  InferredMeta,
  MetaObj<{
    parent: typeof object
    schema: {
      name: typeof string
      age: Sure<
        'not number',
        number,
        unknown,
        MetaObj<{
          parent: typeof optional
          schema: typeof number
        }>
      >
      lastName: Sure<
        'not string' | 'not undefined',
        string | undefined,
        unknown,
        MetaObj<{
          parent: typeof optional
          schema: Sure<
            'not string' | 'not undefined',
            string | undefined,
            unknown,
            MetaObj<{
              parent: typeof or

              first: Sure<'not string', string, unknown, MetaObj<undefined>>
              second: Sure<'not undefined', undefined, unknown, MetaNever | MetaObj>
            }>
          >
        }>
      >
    }
  }>
>(true)

assertEqual<
  typeof optionalObj,
  Sure<
    //
    InferredBad,
    InferredGood,
    InferredInput,
    InferredMeta
  >
>(true)

describe('optional', () => {
  it('good: age is number', () => {
    // Ok when age is number
    expect(
      optionalObj({
        name: 'John',
        age: 12,
        lastName: 'Doe',
      })
    ) //
      .toStrictEqual([true, { name: 'John', age: 12, lastName: 'Doe' }])
  })

  it('good: age is not present', () => {
    // Ok when age is not present
    expect(
      optionalObj({
        name: 'John',
        lastName: 'Doe',
      })
    ) //
      .toStrictEqual([true, { name: 'John', lastName: 'Doe' }])
  })

  it('bad: age is undefined', () => {
    // Not ok when age is undefined
    expect(
      optionalObj({
        name: 'John',
        age: undefined,
        lastName: 'Doe',
      })
    ) //
      .toStrictEqual([false, { age: 'not number' }])
  })

  it('bad: age is string', () => {
    expect(
      optionalObj({
        name: 'John',
        age: '12',
        lastName: 'Doe',
      })
    ) //
      .toStrictEqual([false, { age: 'not number' }])
  })

  it('ok: lastName is not present', () => {
    expect(
      optionalObj({
        name: 'John',
        age: 12,
      })
    ) //
      .toStrictEqual([
        true,
        {
          name: 'John',
          age: 12,
        },
      ])
  })

  it('ok: lastName is undefined', () => {
    expect(
      optionalObj({
        name: 'John',
        age: 12,
        lastName: undefined,
      })
    ) //
      .toStrictEqual([
        true,
        {
          name: 'John',
          age: 12,
          lastName: undefined,
        },
      ])
  })
})
