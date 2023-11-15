import { Sure, InferBad, InferGood, sure, bad, good, MetaNever, MetaObj, Pure } from './core.js'

export function array<
  //
  TPropFail,
  TPropGood,
  TSchema extends Sure<Pure<TPropFail, TPropGood, unknown>, MetaObj | MetaNever>,
>(
  schema: TSchema
): Sure<
  //
  Pure<
    //
    Array<InferBad<TSchema> | undefined>,
    Array<InferGood<TSchema>>,
    unknown
  >,
  MetaObj<TSchema>
> {
  const struct = sure(value => {
    if (!Array.isArray(value)) {
      return bad([])
    }

    let atLeastOneBad = false
    let bads = []
    let goods = []

    for (const elem of value) {
      const [good, unsure] = schema(elem)

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
  }, schema)

  // @ts-expect-error Expected error
  return struct
}
