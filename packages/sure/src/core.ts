export type Dictionary = {
  [key: string]: unknown
}

export type MetaNever = { meta?: never }
export type MetaObj<TMeta = unknown> = { meta: TMeta }

/**
@typeparam TBad  - Each struct can returns some kinds of issues (not throwing)
@typeparam TGood  - The type which is guaranteed to be the output of the validator
@typeparam TInput - The type of the input value.

@example a numeric string can be based on the definition of a string.
         so you can base a numeric string on a string struct (if you want).
         By default the `unknown` struct is used. That is the only core struct
 */
export type Sure<
  //
  TPure extends Pure<unknown, unknown, any>,
  TMeta extends MetaNever | MetaObj,
> = TPure & TMeta

export type Pure<out TBad, out TGood, in TInput> = (value: TInput) => Good<TGood> | Bad<TBad>

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

export function sure<TGood, TBad, TInput>(insure: Pure<TBad, TGood, TInput>): Sure<typeof insure, MetaObj<undefined>>

export function sure<TGood, TBad, TInput, TMeta>(
  insure: Pure<TBad, TGood, TInput>,
  meta: TMeta
): Sure<typeof insure, MetaObj<TMeta>>

export function sure<TGood, TBad, TInput, TMeta>(
  insure: Pure<TBad, TGood, TInput>,
  meta?: TMeta
): Sure<typeof insure, MetaObj<TMeta | undefined>> {
  return Object.assign(insure, { meta })
}

export function pure<TGood, TBad, TInput>(insure: Pure<TBad, TGood, TInput>): Sure<typeof insure, MetaNever> {
  return insure
}

//
export const bad = <TBad>(val: TBad): Bad<TBad> => [false, val]
//
export const good = <TGood>(val: TGood): Good<TGood> => [true, val]

export type Unsure<TBad, TGood> = //
  Good<TGood> | Bad<TBad>

export type Good<T> = [true, T]
export type Bad<T> = [false, T]

export type InferBad<
  T extends Pure<
    unknown,
    unknown,
    // Input issue
    any
  >,
> = //
  T extends Pure<
    infer CFailure,
    unknown,
    // Input issue
    any
  >
    ? //
      CFailure
    : never

export type InferGood<
  T extends Pure<
    unknown,
    unknown,
    // Input issue
    any
  >,
> = //
  T extends Pure<
    unknown,
    infer CDefine,
    // Input issue
    any
  >
    ? //
      CDefine
    : never

export type InferInput<
  T extends Pure<
    unknown,
    unknown,
    // Input issue
    any
  >,
> = //
  T extends Pure<
    unknown,
    unknown,
    // Input issue
    infer CFrom
  >
    ? //
      //
      CFrom
    : never

export type InferMeta<T extends Sure<Pure<unknown, unknown, any>, {}>> = //
  T extends Sure<Pure<unknown, unknown, any>, infer CMeta> //
    ? CMeta
    : {}
