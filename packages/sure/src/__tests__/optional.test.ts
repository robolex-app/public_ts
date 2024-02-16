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

  height: number,
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
    height: number
  }
>(true)

assertEqual<
  InferredBad,
  {
    name?: 'not string'
    age?: 'not number'
    lastName?: 'not string' | 'not undefined'
    height?: 'not number'
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
      height: typeof number
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
