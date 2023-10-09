export type Dictionary = {
  [key: string]: unknown
}

/**
@typeparam TFail  - Each struct can returns some kinds of issues (not throwing)
@typeparam TGood  - The type which is guaranteed to be the output of the validator
@typeparam TInput - The type of the input value.

@example a numeric string can be based on the definition of a string.
         so you can base a numeric string on a string struct (if you want).
         By default the `unknown` struct is used. That is the only core struct
 */
export type Sure<TFail, TGood, TInput, TMeta> = {
  (value: TInput): Good<TGood> | Fail<TFail>
} & { meta: TMeta }

export type Pure<TFail, TGood, TInput> = (value: TInput) => Good<TGood> | Fail<TFail>

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

export function sure<TGood, TFail, TInput>(insure: Pure<TFail, TGood, TInput>): Sure<TFail, TGood, TInput, never>

export function sure<TGood, TFail, TInput, TMeta>(
  insure: Pure<TFail, TGood, TInput>,
  meta: TMeta
): Sure<TFail, TGood, TInput, TMeta>

export function sure<TGood, TFail, TInput, TMeta>(
  insure: Pure<TFail, TGood, TInput>,
  meta?: TMeta
): Sure<TFail, TGood, TInput, TMeta | undefined> {
  return Object.assign(insure, { meta })
}
//
// Fail causes errors when used in Jest tests
export const fail = <TFail>(fail: TFail): Fail<TFail> => [false, fail]
export const evil = <TFail>(fail: TFail): Fail<TFail> => [false, fail]

//
export const good = <TGood>(good: TGood): Good<TGood> => [true, good]

export type Unsure<TFail, TGood> = //
  Good<TGood> | Fail<TFail>

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
