import { sure, good, Fail } from './sure.js'
import type { Sure, InferGood, InferFail, Unsure, Dictionary } from './sure.js'

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
): Sure<TFromFailures | TFailure, TDefine, TFromInput, unknown>

export function after<TDefine, TFromFailures, TFromParsed, TFromInput, TFailure, TMeta>(
  fromStruct: Sure<TFromFailures, TFromParsed, TFromInput>,
  validate: (value: TFromParsed) => Unsure<TFailure, TDefine>,
  meta: TMeta
): Sure<TFromFailures | TFailure, TDefine, TFromInput, TMeta>

export function after<TDefine, TFromFailures, TFromParsed, TFromInput, TFailure, TMeta>(
  fromStruct: Sure<TFromFailures, TFromParsed, TFromInput, unknown>,
  validate: (value: TFromParsed) => Unsure<TFailure, TDefine>,
  meta?: TMeta
): Sure<TFromFailures | TFailure, TDefine, TFromInput, TMeta> {
  const structValue = sure((value: TFromInput) => {
    const [good, out] = fromStruct(value)

    return good ? validate(out) : fail(out)
  }, meta)

  return structValue
}

/**
Necessary because `typeof x` is not a type guard.
 */
function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null
}

export function object<
  //
  TFailures,
  TPropParsed,
  TMeta extends Dictionary,
  TSchema extends Record<string, Sure<TFailures, TPropParsed, unknown, TMeta>>,
>(
  schema: TSchema
): Sure<
  { [K in keyof TSchema & string]?: InferFail<TSchema[K]> },
  { [K in keyof TSchema & string]: InferGood<TSchema[K]> },
  unknown,
  { [K in keyof TSchema & string]: TMeta }
> {
  const struct = sure(value => {
    if (!isObject(value)) {
      return fail({})
    }

    const groupIssue = {}
    const groupValue = {}

    for (const [key, struct] of Object.entries(schema)) {
      const [good, unsure] = struct(value[key])

      if (good) {
        // @ts-expect-error
        groupValue[key] = unsure
      } else {
        // @ts-expect-error
        groupIssue[key] = unsure
      }
    }

    if (Object.keys(groupIssue).length) {
      return fail(groupIssue)
    }

    return good(groupValue)
  }, schema)

  // @ts-expect-error
  return struct
}
