import { T } from 'vitest/dist/reporters-5f784f42.js'

export type Dictionary = {
  [key: string]: unknown
}

export type MetaNever = { meta?: never }
// TODO: change to undefined ? or remove?
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
  TBad,
  TGood,
  TInput,
  //
  TMeta extends MetaNever | MetaObj = MetaNever | MetaObj,
> = ((value: TInput) => Good<TGood> | Bad<TBad>) & TMeta

export type Pure<TBad, TGood, TInput> = Sure<TBad, TGood, TInput, MetaNever>

// TODO: Move TGood up front, and add defaults to Pure (the api is stable I think)
export type Peasy<TGood, TBad = unknown, TInput = any> = Pure<TBad, TGood, TInput>

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

export function sure<TGood, TBad, TInput>(
  insure: Pure<TBad, TGood, TInput>
): Sure<TBad, TGood, TInput, MetaObj<undefined>>

export function sure<TGood, TBad, TInput, TMeta>(
  insure: Pure<TBad, TGood, TInput>,
  meta: TMeta
): Sure<TGood, TBad, TInput, MetaObj<TMeta>>

export function sure<TGood, TBad, TInput, TMeta>(
  insure: Pure<TBad, TGood, TInput>,
  meta?: TMeta
): Sure<TGood, TBad, TInput, MetaObj<TMeta | undefined>> {
  // @ts-expect-error
  return Object.assign(insure, { meta })
}

export function pure<TGood, TInput>(insure: Pure<never, TGood, TInput>): Sure<never, TGood, TInput, MetaNever>
export function pure<TGood, TBad, TInput>(insure: Pure<TBad, TGood, TInput>): Sure<TBad, TGood, TInput, MetaNever>

export function pure<TGood, TBad, TInput>(insure: Pure<TBad, TGood, TInput>): Sure<TGood, TBad, TInput, MetaNever> {
  // @ts-expect-error

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
  T,
  // extends Pure<
  //   unknown,
  //   unknown,
  //   // Input issue
  //   any
  // >,
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
  T,
  // extends Pure<
  //   unknown,
  //   unknown,
  //   // Input issue
  //   any
  // >,
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

export type InferMeta<T extends Sure<unknown, unknown, any, {}>> = //
  T extends Sure<unknown, unknown, any, infer CMeta> //
    ? CMeta
    : {}
