import { MetaNever, MetaObj, Sure, bad, good, sure } from './core.js'

// TODO: add tests, also implement tuple spread
export type TupleInferGoods<T> = T extends readonly [infer First, ...infer InferRest]
  ? First extends Sure<unknown, infer Good, any, MetaObj | MetaNever>
    ? [Good, ...TupleInferGoods<InferRest>]
    : []
  : []

export type TupleInferBads<T> = T extends readonly [infer First, ...infer InferRest]
  ? First extends Sure<infer Bad, unknown, any, MetaObj | MetaNever>
    ? [Bad | undefined, ...TupleInferBads<InferRest>]
    : []
  : []

export function tupleRest<Arr extends Sure<unknown, unknown[], unknown>>(struct: Arr) {
  const val = sure(struct, {
    func: tupleRest,

    initial: struct.meta,
  })

  return val
}

export function tuple<Arr extends [Sure<unknown, unknown, any>, ...Sure<unknown, unknown, any>[]] | []>(
  arr: Arr
): Sure<
  //
  TupleInferBads<Arr>,
  TupleInferGoods<Arr>,
  unknown,
  MetaObj<Arr>
> {
  const struct = sure(value => {
    if (!Array.isArray(value)) {
      return bad([])
    }

    let atLeastOneBad = false
    let bads = []
    let goods = []

    for (let i = 0; i < arr.length; i++) {
      // @ts-expect-error
      const elem: Sure<unknown, unknown, any> = arr[i]

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
