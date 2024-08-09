import { describe, it, expect, assert } from 'vitest'
import { tuple, number, string, boolean, good, bad, spread_NOT_IMPLEMENTED, array, nil, undef } from '../index.js'
import type {
  InferGood,
  InferBad,
  InferInput,
  InferMeta,
  Sure,
  MetaObj,
  MetaNever,
  Good,
  Bad,
  TupleInferGoods,
  TupleInferBads,
} from '../index.js'
import { assertEqual } from './typeTestUtils.js'

const someTuple = tuple([number, string, boolean])

// Type Checks
{
  type InferredGood = InferGood<typeof someTuple>
  type InferredBad = InferBad<typeof someTuple>
  type InferredInput = InferInput<typeof someTuple>
  type InferredMeta = InferMeta<typeof someTuple>

  assertEqual<InferredInput, unknown>(true)
  assertEqual<InferredGood, [number, string, boolean]>(true)
  assertEqual<InferredBad, ['not number' | undefined, 'not string' | undefined, 'not boolean' | undefined]>(true)
  assertEqual<
    InferredMeta,
    {
      meta: {
        parent: typeof tuple
        schema: [
          Sure<'not number', number, unknown, MetaNever>,
          typeof string,
          (x: unknown) => Good<boolean> | Bad<'not boolean'>,
        ]
      }
    }
  >(true)
}

const myTuple = tuple([
  //
  string,
  spread_NOT_IMPLEMENTED(array(number)),
  string,
])

{
  type InferredGood = InferGood<typeof myTuple>
  type InferredBad = InferBad<typeof myTuple>
  type InferredInput = InferInput<typeof myTuple>
  type InferredMeta = InferMeta<typeof myTuple>

  assertEqual<InferredInput, unknown>(true)

  assertEqual<InferredGood, [string, ...number[], string]>(true)
  assertEqual<
    InferredBad,
    [
      //
      'not string' | undefined,
      ...('not number' | undefined)[],
      'not string' | undefined,
    ]
  >(true)

  assertEqual<
    InferredMeta,
    {
      meta: {
        parent: <Arr extends [Sure<unknown, unknown, any>, ...Sure<unknown, unknown, any>[]] | []>(
          arr: Arr
        ) => Sure<
          TupleInferBads<Arr>,
          TupleInferGoods<Arr>,
          unknown,
          MetaObj<{
            parent: typeof tuple
            schema: Arr
          }>
        >
        schema: [
          typeof string,
          Sure<
            ('not number' | undefined)[],
            number[],
            unknown,
            MetaObj<{
              parent: <Arr extends Sure<unknown, unknown[], unknown>>(
                schema: Arr
              ) => Sure<
                InferBad<Arr>,
                InferGood<Arr>,
                unknown,
                MetaObj<{
                  parent: typeof spread_NOT_IMPLEMENTED
                  schema: Arr
                }>
              >
              schema: Sure<
                ('not number' | undefined)[],
                number[],
                unknown,
                MetaObj<{
                  type: 'array'
                  schema: typeof number
                }>
              >
            }>
          >,
          typeof string,
        ]
      }
    }
  >(true)
}

const smallSchema = tuple([
  //
  undef,
  spread_NOT_IMPLEMENTED(array(string)),
  number,
])

{
  type InferredGood = InferGood<typeof smallSchema>
  type InferredBad = InferBad<typeof smallSchema>
  type InferredInput = InferInput<typeof smallSchema>
  type InferredMeta = InferMeta<typeof smallSchema>

  assertEqual<InferredInput, unknown>(true)

  assertEqual<InferredGood, [undefined, ...string[], number]>(true)
  assertEqual<
    InferredBad,
    [
      //
      'not undefined' | undefined,
      ...('not string' | undefined)[],
      'not number' | undefined,
    ]
  >(true)

  assertEqual<
    InferredMeta,
    {
      meta: {
        parent: <Arr extends [] | [Sure<unknown, unknown, any>, ...Sure<unknown, unknown, any>[]]>(
          arr: Arr
        ) => Sure<
          TupleInferBads<Arr>,
          TupleInferGoods<Arr>,
          unknown,
          MetaObj<{
            parent: typeof tuple
            schema: Arr
          }>
        >
        schema: [
          (value: unknown) => Good<undefined> | Bad<'not undefined'>,
          Sure<
            ('not string' | undefined)[],
            string[],
            unknown,
            MetaObj<{
              parent: <Arr extends Sure<unknown, unknown[], unknown>>(
                schema: Arr
              ) => Sure<
                InferBad<Arr>,
                InferGood<Arr>,
                unknown,
                MetaObj<{
                  parent: typeof spread_NOT_IMPLEMENTED
                  schema: Arr
                }>
              >
              schema: Sure<
                ('not string' | undefined)[],
                string[],
                unknown,
                MetaObj<{
                  type: 'array'
                  schema: Sure<
                    'not string',
                    string,
                    unknown,
                    MetaObj<{
                      type: 'string'
                    }>
                  >
                }>
              >
            }>
          >,
          Sure<'not number', number, unknown, MetaNever>,
        ]
      }
    }
  >(true)
}

describe('tuple', () => {
  it('should return good value', () => {
    const value = someTuple([1, 'hello', true])

    const expected: InferGood<typeof someTuple> = [1, 'hello', true]

    expect(value).toStrictEqual(good(expected))
  })

  it('should return bad value', () => {
    const value = someTuple([1, 'two', 3])

    const expected: InferBad<typeof someTuple> = [undefined, undefined, 'not boolean']

    expect(value).toStrictEqual(bad(expected))
  })

  it('DX: schema is inferred correctly', () => {
    const arrSchema = [
      //
      string,
      spread_NOT_IMPLEMENTED(array(number)),
    ] as const

    type InferSchema = TupleInferGoods<typeof arrSchema>

    assertEqual<InferSchema, [string, ...number[], string]>(true)
  })

  it('DX: should allow spread tuples', () => {
    const arrSchema = [
      //
      string,
      spread_NOT_IMPLEMENTED(array(number)),
      string,
    ] as const

    type InferSchema = typeof arrSchema

    const schema = tuple([
      //
      string,
      spread_NOT_IMPLEMENTED(array(number)),
      string,
    ])

    type InferredGood = InferGood<typeof schema>

    assertEqual<InferredGood, [string, ...number[], string]>(true)
  })

  it('ISSUE: Typescript does not allow multiple rest operators in a tuple', () => {
    const schema = tuple([
      //
      string,
      spread_NOT_IMPLEMENTED(array(number)),

      nil,

      spread_NOT_IMPLEMENTED(smallSchema),
    ])

    type InferredGood = InferGood<typeof schema>

    assertEqual<InferredGood, [string, ...number[], null, ...[undefined, ...string[], number]]>(true)

    // INFO & TODO: The actual type is `[string, ...(string | number | null | undefined)[], number]`
    //  but it's not possible to type it like this. Needs more docs
  })

  it.skip('UNIT: should actually validate at runtime', () => {
    const smallSchema = tuple([
      //
      undef,
      spread_NOT_IMPLEMENTED(array(string)),
      number,
    ])

    const value = smallSchema([undefined, 'adf', 'aaa', 3])

    const expected: InferGood<typeof smallSchema> = [undefined, 'adf', 'aaa', 3]

    expect(value).toStrictEqual(good(expected))
  })
})
