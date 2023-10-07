import { objEntries, objMapEntries } from '@robo/dependent-ts'
import { sure, good, evil } from './sure.js'
import type { Sure, InferGood, InferEvil, Unsure, Dictionary } from './sure.js'

/**
  A common use-case is to first validate that a value is a string.
  And then validate other things about the string.

  This function will run the @see fromStruct validator first.
  If it returns a bad value, then the bad value is returned.

  If it returns a good value, then the new @see validate function will be run.
 */

export function after<TDefine, TFromFailures, TFromParsed, TFromInput, TFailure>(
  fromStruct: Sure<TFromFailures, TFromParsed, TFromInput, unknown>,
  validate: (value: TFromParsed) => Unsure<TFailure, TDefine>
): Sure<TFromFailures | TFailure, TDefine, TFromInput, undefined>

export function after<TDefine, TFromFailures, TFromParsed, TFromInput, TFailure, TMeta>(
  fromStruct: Sure<TFromFailures, TFromParsed, TFromInput, unknown>,
  validate: (value: TFromParsed) => Unsure<TFailure, TDefine>,
  meta: TMeta
): Sure<TFromFailures | TFailure, TDefine, TFromInput, TMeta>

export function after<TDefine, TFromFailures, TFromParsed, TFromInput, TFailure, TMeta>(
  fromStruct: Sure<TFromFailures, TFromParsed, TFromInput, unknown>,
  validate: (value: TFromParsed) => Unsure<TFailure, TDefine>,
  meta?: TMeta
): Sure<TFromFailures | TFailure, TDefine, TFromInput, TMeta | undefined> {
  const structValue = sure((value: TFromInput) => {
    const [good, out] = fromStruct(value)

    if (!good) return evil<TFailure | TFromFailures>(out)

    return validate(out)
  }, meta)

  return structValue
}

/**
 * Necessary because `typeof x` is not a type guard.
 */
function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null
}

const record = sure(value => {
  return isObject(value) ? good(value) : evil('not an object')
})

export const rawString = sure(value => {
  return typeof value === 'string' ? good(value) : evil('not a string' as const)
})

export function object<
  //
  TFailures,
  TPropParsed,
  TMeta,
  TSchema extends Record<string, Sure<TFailures, TPropParsed, unknown, TMeta>>,
>(
  schema: TSchema
): Sure<
  { [K in keyof TSchema & string]?: InferEvil<TSchema[K]> },
  { [K in keyof TSchema & string]: InferGood<TSchema[K]> },
  unknown,
  { [K in keyof TSchema & string]: TMeta }
> {
  // get meta of all fields
  const objectMeta = objMapEntries(schema, ([key, struct]) => {
    return [key, struct.meta] as const
  })

  const struct = sure(value => {
    if (!isObject(value)) return evil<{ [K in keyof TSchema]?: InferEvil<TSchema[K]> }>({})

    const groupIssue: {
      [K in keyof TSchema]?: InferEvil<TSchema[K]>
    } = {}

    // @ts-expect-error TODO: Fix this
    const groupValue: {
      [K in keyof TSchema]: InferGood<TSchema[K]>
    } = {}

    for (const [key, struct] of objEntries(schema)) {
      const [good, unsure] = struct(value[key])

      if (good) {
        // @ts-expect-error TODO: Fix this
        groupValue[key] = unsure
      } else {
        // @ts-expect-error TODO: Fix this
        groupIssue[key] = unsure
      }
    }

    if (Object.keys(groupIssue).length) {
      return evil(groupIssue)
    }

    return good(groupValue)
  }, objectMeta)

  return struct
}
