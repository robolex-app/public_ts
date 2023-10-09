import { sure, good, fail } from './sure.js'
import type { Sure, InferGood, InferFail, Unsure, Dictionary, Pure } from './sure.js'

/**
A common use-case is to first validate that a value is a string.
And then validate other things about the string.

This function will run the @see first validator first.
If it returns a bad value, then the bad value is returned.

If it returns a good value, then the new @see second function will be run.
 */

export function after<
  //
  TFirstFail,
  TFirstGood,
  TFirstInput,
  //
  TSecondFail,
  TSecondGood,
>(
  first: Pure<TFirstFail, TFirstGood, TFirstInput>,
  second: Pure<TSecondFail, TSecondGood, TFirstGood>
): Sure<TFirstFail | TSecondFail, TSecondGood, TFirstInput, undefined>

export function after<
  //
  TFirstFail,
  TFirstGood,
  TFirstInput,
  //
  TSecondFail,
  TSecondGood,
  //
  TMeta,
>(
  first: Pure<TFirstFail, TFirstGood, TFirstInput>,
  second: Pure<TSecondFail, TSecondGood, TFirstGood>,
  meta: TMeta
): Sure<TFirstFail | TSecondFail, TSecondGood, TFirstInput, TMeta>

export function after<
  //
  TFirstFail,
  TFirstGood,
  TFirstInput,
  //
  TSecondFail,
  TSecondGood,
  //
  TMeta,
>(
  first: Pure<TFirstFail, TFirstGood, TFirstInput>,
  second: Pure<TSecondFail, TSecondGood, TFirstGood>,
  meta?: TMeta
): Sure<TFirstFail | TSecondFail, TSecondGood, TFirstInput, TMeta | undefined> {
  return sure((value: TFirstInput) => {
    const [good, out] = first(value)

    return good ? second(out) : fail<TFirstFail | TSecondFail>(out)
  }, meta)
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
  TMeta,
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
      // TODO: Make different between `| undefined` and `?: somthing`
      // check if key actually exists

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
