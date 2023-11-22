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

/**
Returns the exact function back.
But the types are inferred automatically for you.

Expects you to pass a function that gets an `unknown` value
and returns either:
  [true, <anything you want>]
  [false, <an failure you might want to return, also anything you want>]

Check the `sure.ts` version to check the types


@example Check playground.ts to hover over variables
 */

export function sure<TGood, TBad, TInput, TMeta>(
  insure: Sure<TBad, TGood, TInput>,
  meta: TMeta
): Sure<TBad, TGood, TInput, MetaObj<TMeta>> {
  return Object.assign(insure, { meta })
}

export function pure<TGood, TBad, TInput>(
  insure: Sure<TBad, TGood, TInput, MetaNever>
): Sure<TBad, TGood, TInput, MetaNever> {
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
  T extends Sure<
    unknown,
    unknown,
    // Input issue
    any,
    MetaObj | MetaNever
  >,
> = //
  T extends Sure<
    infer CFailure,
    unknown,
    // Input issue
    any,
    MetaObj | MetaNever
  >
    ? //
      CFailure
    : never

export type InferGood<
  T extends Sure<
    unknown,
    unknown,
    // Input issue
    any,
    MetaObj | MetaNever
  >,
> = //
  T extends Sure<
    unknown,
    infer CDefine,
    // Input issue
    any,
    MetaObj | MetaNever
  >
    ? //
      CDefine
    : never

export type InferInput<
  T extends Sure<
    unknown,
    unknown,
    // Input issue
    any,
    MetaObj | MetaNever
  >,
> = //
  T extends Sure<
    unknown,
    unknown,
    // Input issue
    infer CFrom,
    MetaObj | MetaNever
  >
    ? //
      //
      CFrom
    : never

export type InferMeta<T extends Sure<unknown, unknown, any, {}>> = //
  T extends Sure<unknown, unknown, any, infer CMeta> //
    ? CMeta
    : {}
