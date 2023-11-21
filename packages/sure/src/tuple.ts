import { InferBad, InferGood, MetaNever, MetaObj, Peasy, Sure, bad, good, sure } from './core.js'

// Remove this
import { number, string, unknown } from './primitives.js'

// type ExtractTuple <T extends Peasy<unknown>[]> =

const someTuple = tuple([number, string, number])

const testValue = [number, string, number] as const

type TestType = typeof testValue

// TODO: add tests, also implement tuple spread
export type TupleInferGoods<T> = T extends readonly [infer First, ...infer InferRest]
  ? [InferGood<First>, ...TupleInferGoods<InferRest>]
  : []

export type TupleInferBads<T> = T extends readonly [infer First, ...infer InferRest]
  ? [InferBad<First> | undefined, ...TupleInferBads<InferRest>]
  : []

type FinGoods = TupleInferGoods<TestType>
type FinBads = TupleInferBads<TestType>

export function tupleRest<Arr extends Sure<Peasy<unknown[]>, MetaNever | MetaObj>>(struct: Arr) {
  const val = sure(struct, {
    func: tupleRest,

    initial: struct.meta,
  })

  return val
}

export function tuple<Arr extends [Peasy<unknown>, ...Peasy<unknown>[]] | []>(
  arr: Arr
): Sure<
  //
  Peasy<TupleInferGoods<Arr>, TupleInferBads<Arr>, unknown>,
  MetaObj<Arr>
> {
  const struct = sure(value => {
    if (!Array.isArray(value)) {
      return bad([])
    }

    let atLeastOneBad = false
    let bads = []
    let goods = []

    for (const [i, elem] of arr.entries()) {
      const [good, unsure] = elem(value[i])

      if (good) {
        goods.push(unsure)
        // This is necessary in order to maintain the same length
        bads.push(undefined)
      } else {
        bads.push(unsure)

        // Since the `bads` array can containe `undefined` values, it's more clear to
        // have an imperative boolean to make the check
        atLeastOneBad = true
      }
    }

    if (atLeastOneBad) {
      return bad(bads)
    }

    return good(goods)
  }, arr)

  // @ts-expect-error
  return struct
}
