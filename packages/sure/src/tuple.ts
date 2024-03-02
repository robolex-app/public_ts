import { InferBad, InferGood, MetaNever, MetaObj, Sure, bad, good, sure } from './core.js'
import { isObject } from './object.js'

// TODO: add tests, also implement tuple spread
export type TupleInferGoods_old<T> = T extends readonly [infer First, ...infer InferRest]
  ? First extends Sure<unknown, infer Good, any, MetaObj | MetaNever>
    ? [Good, ...TupleInferGoods<InferRest>]
    : []
  : []

// Add test
export type TupleInferGoods<T> = //
  T extends readonly [infer First, ...infer InferRest]
    ? First extends Sure<unknown, infer Good, any, infer Meta>
      ? Meta extends MetaObj<{ parent: typeof spread_NOT_IMPLEMENTED }>
        ? // try spreading the rest if it's an array
          Good extends readonly unknown[]
          ? [...Good, ...TupleInferGoods<InferRest>]
          : // otherwise just return the good
            [Good, ...TupleInferGoods<InferRest>]
        : [Good, ...TupleInferGoods<InferRest>]
      : []
    : []

export type TupleInferBads_old<T> = T extends readonly [infer First, ...infer InferRest]
  ? First extends Sure<infer Bad, unknown, any, MetaObj | MetaNever>
    ? [Bad | undefined, ...TupleInferBads<InferRest>]
    : []
  : []

export type TupleInferBads<T> = T extends readonly [infer First, ...infer InferRest]
  ? First extends Sure<infer Bad, unknown, any, infer Meta>
    ? Meta extends MetaObj<{ parent: typeof spread_NOT_IMPLEMENTED }>
      ? // try spreading the rest if it's an array
        Bad extends readonly unknown[]
        ? [...Bad, ...TupleInferBads<InferRest>]
        : // otherwise just return the bad
          [Bad | undefined, ...TupleInferBads<InferRest>]
      : [Bad | undefined, ...TupleInferBads<InferRest>]
    : []
  : []

/**
 * @deprecated
 *
 * It's possible to add a spread operator.
 * But it's seems that it would add a lot of complexity and will have to link the library too much.
 *
 * A tuple would have to know about both the spread and an array.
 *
 * It made sense for `object` and `optional`, since they're linked.
 * But for tuples it can be more clearly implemented as a separate user-land function.
 */
export function spread_NOT_IMPLEMENTED<Arr extends Sure<unknown, unknown[], unknown>>(
  schema: Arr
): Sure<
  InferBad<Arr>,
  InferGood<Arr>,
  unknown,
  MetaObj<{
    parent: typeof spread_NOT_IMPLEMENTED
    schema: typeof schema
  }>
> {
  // IMPORTANT: It's important to pass a new function here
  const val = sure(value => schema(value), {
    parent: spread_NOT_IMPLEMENTED,
    schema,
  })

  // @ts-expect-error - this is fine
  return val
}

export function tuple<Arr extends [Sure<unknown, unknown, any>, ...Sure<unknown, unknown, any>[]] | []>(
  arr: Arr
): Sure<
  //
  TupleInferBads<Arr>,
  TupleInferGoods<Arr>,
  unknown,
  MetaObj<{
    parent: typeof tuple

    schema: Arr
  }>
> {
  const struct = sure(
    value => {
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
    },
    {
      parent: tuple,

      initial: arr,
    }
  )

  struct.meta

  // @ts-expect-error
  return struct
}
