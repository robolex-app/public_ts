export type Dictionary = {
  [key: string]: unknown
}

/**
@typeparam TEvil  - Each struct can returns some kinds of issues (not throwing)
@typeparam TGood  - The type which is guaranteed to be the output of the validator
@typeparam TInput - The type of the input value.

@example a numeric string can be based on the definition of a string.
         so you can base a numeric string on a string struct (if you want).
         By default the `unknown` struct is used. That is the only core struct
 */
export type Sure<TEvil, TGood, TInput, TMeta> = {
  (value: TInput): Good<TGood> | Fail<TEvil>
} & { meta: TMeta }

export type Pure<TEvil, TGood, TInput> = (value: TInput) => Good<TGood> | Fail<TEvil>

/**
Returns the exact function back.
But the types are inferred automatically for you.

Expects you to pass a function that gets an `unknown` value
and returns either:
  [true, <anything you want>]
  [false, <an failure you might want to return, also anything you want>]

Check the `sure.ts` version to check the types

Why "fail"? It has the same amount of letters as "good" so they look balanced.


@example Check playground.ts to hover over variables
 */

export function sure<TGood, TEvil, TInput>(insure: Pure<TEvil, TGood, TInput>): Sure<TEvil, TGood, TInput, never>

export function sure<TGood, TEvil, TInput, TMeta>(
  insure: Pure<TEvil, TGood, TInput>,
  meta: TMeta
): Sure<TEvil, TGood, TInput, TMeta>

export function sure<TGood, TEvil, TInput, TMeta>(
  insure: Pure<TEvil, TGood, TInput>,
  meta?: TMeta
): Sure<TEvil, TGood, TInput, TMeta | undefined> {
  return Object.assign(insure, { meta })
}
//
// Fail causes errors when used in Jest tests
export const evil = <TEvil>(val: TEvil): Fail<TEvil> => [false, val]
//
export const good = <TGood>(val: TGood): Good<TGood> => [true, val]

export type Unsure<TEvil, TGood> = //
  Good<TGood> | Fail<TEvil>

export type Good<T> = [true, T]
export type Fail<T> = [false, T]

export type InferFail<T extends Pure<unknown, unknown, any>> = //
  T extends Pure<infer CFailure, unknown, any> //
    ? CFailure
    : never

export type InferGood<T extends Pure<unknown, unknown, any>> = //
  T extends Pure<unknown, infer CDefine, any> //
    ? CDefine
    : never

export type InferInput<T extends Pure<unknown, unknown, any>> = //
  T extends Pure<unknown, unknown, infer CFrom> //
    ? CFrom
    : never

export type InferMeta<
  T extends Sure<
    unknown,
    unknown,
    // Input issue
    any,
    {}
  >,
> = //
  T extends Sure<
    unknown,
    unknown,
    // Same issue as defined above
    any,
    infer CMeta
  > //
    ? CMeta
    : {}
