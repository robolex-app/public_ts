import { sure, good, bad } from './core.js'
import type { Sure, InferGood, InferBad, MetaNever, MetaObj } from './core.js'

/**
Necessary because `typeof x` is not a type guard.
 */
function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null
}

export function optional<TSchema extends Sure<unknown, unknown, any>>(schema: TSchema) {
  // IMPORTANT: It's important to pass a new function here
  //            since `sure` will update the function with the meta
  return sure(value => schema(value), {
    parent: optional,

    schema,
  })
}

export function object<
  //
  TPropFail,
  TPropGood,
  TSchema extends Record<string, Sure<TPropFail, TPropGood, unknown>>,
>(
  schema: TSchema
): Sure<
  { [K in keyof TSchema & string]?: InferBad<TSchema[K]> },
  { [K in keyof TSchema & string]: InferGood<TSchema[K]> },
  unknown,
  MetaObj<{
    parent: typeof object

    schema: TSchema
  }>
> {
  // @ts-expect-error - TODO: expected
  return sure(
    value => {
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
    },
    {
      parent: object,

      schema,
    }
  )
}
