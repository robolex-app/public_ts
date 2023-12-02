import { sure, good, bad } from './core.js'
import type { Sure, InferGood, InferBad, MetaNever, MetaObj } from './core.js'
import { KVPair, Objectify, Prettify, Unionize } from './utils.js'

type PickOptionalsGood<T extends KVPair<Sure>> = T extends {
  v: Sure<
    unknown,
    unknown,
    any,
    MetaObj<{
      parent: typeof optional
    }>
  >
}
  ? { k: T['k']; v: InferGood<T['v']> }
  : never

type PickNonOptionals<T extends KVPair<Sure>> = T extends {
  v: Sure<
    unknown,
    unknown,
    any,
    MetaObj<{
      parent: typeof optional
    }>
  >
}
  ? never
  : { k: T['k']; v: InferGood<T['v']> }

export type InferSchemaGood<T extends Record<string, Sure>> = Prettify<
  Partial<Objectify<PickOptionalsGood<Unionize<T>>>> & Objectify<PickNonOptionals<Unionize<T>>>
>

/**
Necessary because `typeof x` is not a type guard.
 */
export function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null
}

/**
 * Makes a object property `optional`
 * It doesn't make it nullable or undefinedable
 *
 * The `optional` function will be checked `only` by the `object` function.
 * In all other cases it will the value will not be perceived as optional.
 */
export function optional<TSchema extends Sure<unknown, unknown, any>>(
  schema: TSchema
): Sure<
  InferBad<TSchema>,
  InferGood<TSchema>,
  unknown,
  MetaObj<{
    parent: typeof optional

    schema: TSchema
  }>
> {
  // IMPORTANT: It's important to pass a new function here
  //            since `sure` will update the function with the meta
  // @ts-expect-error
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
  InferSchemaGood<TSchema>,
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
        const isOptional = isObject(sureFunction.meta) && sureFunction.meta.parent === optional

        if (isOptional && !(key in value)) {
          continue
        }

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
