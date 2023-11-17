import { sure, good, bad } from './core.js'
import type { Sure, InferGood, InferBad, Pure, MetaNever, MetaObj } from './core.js'

/**
Necessary because `typeof x` is not a type guard.
 */
function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null
}

export function object<
  //
  TPropFail,
  TPropGood,
  TSchema extends Record<string, Pure<TPropFail, TPropGood, unknown>>,
>(
  schema: TSchema
): Sure<
  Pure<
    { [K in keyof TSchema & string]?: InferBad<TSchema[K]> },
    { [K in keyof TSchema & string]: InferGood<TSchema[K]> },
    unknown
  >,
  TSchema
> {
  const struct = sure(value => {
    if (!isObject(value)) {
      return bad({})
    }

    const groupFail = {}
    const groupGood = {}

    for (const [key, sureFunction] of Object.entries(schema)) {
      // TODO: Make different between `| undefined` and `?: somthing`
      // check if key actually exists

      const [good, unsure] = sureFunction(value[key])

      if (good) {
        // @ts-expect-error
        groupGood[key] = unsure
      } else {
        // @ts-expect-error
        groupFail[key] = unsure
      }
    }

    if (Object.keys(groupFail).length) {
      return bad(groupFail)
    }

    return good(groupGood)
  }, schema)

  // @ts-expect-error
  return struct
}
