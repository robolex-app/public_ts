export type Dictionary = Record<string, unknown>

/**
@typeparam TEvil  - Each struct can returns some kinds of issues (not throwing)
@typeparam TGood  - The type which is guaranteed to be the output of the validator
@typeparam TInput - The type of the input value.

@example a numeric string can be based on the definition of a string.
         so you can base a numeric string on a string struct (if you want).
         By default the `unknown` struct is used. That is the only core struct
 */
export type Sure<TEvil, TGood, TInput, TMeta> = ((value: TInput) => Good<TGood> | Evil<TEvil>) & { meta: TMeta }

export type PureSure<TEvil, TGood, TInput> = (value: TInput) => Good<TGood> | Evil<TEvil>
/**
Returns the exact function back.
But the types are inferred automatically for you.

Expects you to pass a function that gets an `unknown` value
and returns either:
  [true, <anything you want>]
  [false, <an failure you might want to return, also anything you want>]

Check the `sure.ts` version to check the types

Why "evil"? It has the same amount of letters as "good" so they look balanced.


@example Check playground.ts to hover over variables
 */

//
export function sure<TEvil, TGood, TInput>(
  insure: PureSure<TEvil, TGood, TInput>
): Sure<TEvil, TGood, TInput, undefined>

export function sure<TEvil, TGood, TInput, TMeta>(
  insure: PureSure<TEvil, TGood, TInput>,
  meta: TMeta
): Sure<TEvil, TGood, TInput, TMeta>

export function sure<TGood, TEvil, TInput, TMeta>(
  insure: PureSure<TEvil, TGood, TInput>,
  meta?: TMeta
): Sure<TEvil, TGood, TInput, TMeta | undefined> {
  return Object.assign(insure, { meta })
}
//
export const evil = <TEvil>(evil: TEvil): Evil<TEvil> => [false, evil]
//
export const good = <TGood>(good: TGood): Good<TGood> => [true, good]

export type Unsure<TEvil, TGood> = //
  Good<TGood> | Evil<TEvil>

export type Good<T> = [true, T]
export type Evil<T> = [false, T]

export type InferGood<T extends Sure<unknown, unknown, unknown, unknown>> = //
  T extends Sure<unknown, infer CDefine, unknown, unknown> //
    ? CDefine
    : never

export type InferEvil<T extends Sure<unknown, unknown, unknown, unknown>> = //
  T extends Sure<infer CFailure, unknown, unknown, unknown> //
    ? CFailure
    : never

export type InferInput<T extends Sure<unknown, unknown, unknown, unknown>> = //
  T extends Sure<unknown, unknown, infer CFrom, unknown> //
    ? CFrom
    : never

export type InferMeta<T extends Sure<unknown, unknown, unknown, unknown>> = //
  T extends Sure<unknown, unknown, unknown, infer CMeta> //
    ? CMeta
    : never
