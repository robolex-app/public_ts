import { sure, good, evil } from './core.js'
import type { Sure, InferGood, InferEvil, Pure } from './core.js'

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
  TSchema extends Record<string, Sure<TPropFail, TPropGood, unknown, unknown>>,
>(
  schema: TSchema
): Sure<
  { [K in keyof TSchema & string]?: InferEvil<TSchema[K]> },
  { [K in keyof TSchema & string]: InferGood<TSchema[K]> },
  unknown,
  TSchema
> {
  const struct = sure(value => {
    if (!isObject(value)) {
      return evil({})
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
      return evil(groupFail)
    }

    return good(groupGood)
  }, schema)

  // @ts-expect-error
  return struct
}
