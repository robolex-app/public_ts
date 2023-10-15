import { sure, good, evil } from './core.js'
import type { Sure, InferGood, InferFail, Pure } from './core.js'

/**
A common use-case is to first validate that a value is a string.
And then validate other things about the string.

This function will run the @see first validator first.
If it returns a bad value, then the bad value is returned.

If it returns a good value, then the new @see second function will be run.
 */

export function after<
  //
  TFirsTEvil,
  TFirstGood,
  TFirstInput,
  //
  TSecondFail,
  TSecondGood,
>(
  first: Pure<TFirsTEvil, TFirstGood, TFirstInput>,
  second: Pure<TSecondFail, TSecondGood, TFirstGood>
): Sure<TFirsTEvil | TSecondFail, TSecondGood, TFirstInput, never>

export function after<
  //
  TFirsTEvil,
  TFirstGood,
  TFirstInput,
  //
  TSecondFail,
  TSecondGood,
  //
  TMeta,
>(
  first: Pure<TFirsTEvil, TFirstGood, TFirstInput>,
  second: Pure<TSecondFail, TSecondGood, TFirstGood>,
  meta: TMeta
): Sure<TFirsTEvil | TSecondFail, TSecondGood, TFirstInput, TMeta>

export function after<
  //
  TFirsTEvil,
  TFirstGood,
  TFirstInput,
  //
  TSecondFail,
  TSecondGood,
  //
  TMeta,
>(
  first: Pure<TFirsTEvil, TFirstGood, TFirstInput>,
  second: Pure<TSecondFail, TSecondGood, TFirstGood>,
  meta?: TMeta
): Sure<TFirsTEvil | TSecondFail, TSecondGood, TFirstInput, TMeta | undefined> {
  return sure((value: TFirstInput) => {
    const [good, out] = first(value)

    return good ? second(out) : evil<TFirsTEvil | TSecondFail>(out)
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
  TPropFail,
  TPropGood,
  TSchema extends Record<string, Sure<TPropFail, TPropGood, unknown, unknown>>,
>(
  schema: TSchema
): Sure<
  { [K in keyof TSchema & string]?: InferFail<TSchema[K]> },
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
