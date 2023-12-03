import { describe, it, expect } from 'vitest'
import { tuple, number, string, boolean, good, bad, spread, array, nil, undef } from '../index.js'
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
type InferredSure = typeof someTuple
type InferredGood = InferGood<typeof someTuple>
type InferredBad = InferBad<typeof someTuple>
type InferredInput = InferInput<typeof someTuple>
type InferredMeta = InferMeta<typeof someTuple>

assertEqual<InferredGood, [number, string, boolean]>(true)
assertEqual<InferredBad, ['not number' | undefined, 'not string' | undefined, 'not boolean' | undefined]>(true)
assertEqual<InferredInput, unknown>(true)
assertEqual<
  InferredMeta,
  {
    meta: {
      parent: typeof tuple
      schema: [
        Sure<'not number', number, unknown, MetaNever>,
        Sure<'not string', string, unknown, MetaObj<undefined>>,
        (x: unknown) => Good<boolean> | Bad<'not boolean'>,
      ]
    }
  }
>(true)

describe('array', () => {
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
      spread(array(number)),
    ] as const

    type InferSchema = TupleInferGoods<typeof arrSchema>

    assertEqual<InferSchema, [string, ...number[], string]>(true)
  })

  it('DX: should type well', () => {
    const myTuple = tuple([
      //
      string,
      spread(array(number)),
      string,
    ])

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
      MetaObj<{
        parent: typeof tuple
        schema: [
          Sure<'not string', string, unknown, MetaObj<undefined>>,
          Sure<
            ('not number' | undefined)[],
            number[],
            unknown,
            MetaObj<{
              parent: typeof spread
              initial: unknown
            }>
          >,
          Sure<'not string', string, unknown, MetaObj<undefined>>,
        ]
      }>
    >(true)
  })

  it('should allow spread tuples', () => {
    const arrSchema = [
      //
      string,
      spread(array(number)),
      string,
    ] as const

    type InferSchema = typeof arrSchema

    const schema = tuple([
      //
      string,
      spread(array(number)),
      string,
    ])

    type InferredGood = InferGood<typeof schema>

    assertEqual<InferredGood, [string, ...number[], string]>(true)

    schema(['hello', 1, 2, 3, 'world'])
  })

  it('more complex', () => {
    const smallSchema = tuple([
      //
      undef,
      spread(array(string)),
      number,
    ])

    type InferGood_01 = InferGood<typeof smallSchema>
    type InferBad_01 = InferBad<typeof smallSchema>
    type InferInput_01 = InferInput<typeof smallSchema>
    type InferMeta_01 = InferMeta<typeof smallSchema>

    assertEqual<InferInput_01, unknown>(true)

    assertEqual<InferGood_01, [undefined, ...string[], number]>(true)
    assertEqual<
      InferBad_01,
      [
        //
        'not undefined' | undefined,
        ...('not string' | undefined)[],
        'not number' | undefined,
      ]
    >(true)

    assertEqual<
      InferMeta_01,
      MetaObj<{
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
          (value: unknown) => Good<undefined> | Bad<'not undefined'>,
          Sure<
            ('not string' | undefined)[],
            string[],
            unknown,
            MetaObj<{
              parent: <Arr extends Sure<unknown, unknown[], unknown>>(
                struct: Arr
              ) => Sure<
                InferBad<Arr>,
                InferGood<Arr>,
                unknown,
                MetaObj<{
                  parent: typeof spread
                  initial: unknown
                }>
              >
              initial: unknown
            }>
          >,
          Sure<'not number', number, unknown, MetaNever>,
        ]
      }>
    >(true)

    const schema = tuple([
      //
      string,
      spread(array(number)),

      nil,

      spread(smallSchema),
    ])

    type InferredGood = InferGood<typeof schema>
    type InferredBad = InferBad<typeof schema>

    assertEqual<InferredGood, [string, ...number[], null, ...[undefined, ...string[], number]]>(true)

    // INFO & TODO: The actual type is `[string, ...(string | number | null | undefined)[], number]`
    //  but it's not possible to type it like this. Needs more docs
  })
})
