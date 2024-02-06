export type Primitive = string | number | symbol | bigint | boolean | null | undefined;
export type Dictionary = {
    [key: string]: unknown;
};
export type MetaNever = {
    meta?: never;
};
export type MetaObj<TMeta = unknown> = {
    meta: TMeta;
};
/**
@typeparam TBad  - Each struct can returns some kinds of issues (not throwing)
@typeparam TGood  - The type which is guaranteed to be the output of the validator
@typeparam TInput - The type of the input value.

@example a numeric string can be based on the definition of a string.
         so you can base a numeric string on a string struct (if you want).
         By default the `unknown` struct is used. That is the only core struct
 */
export type Sure<TBad = unknown, TGood = unknown, TInput = unknown, TMeta extends MetaNever | MetaObj = MetaNever | MetaObj> = ((value: TInput) => Good<TGood> | Bad<TBad>) & TMeta;
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
export declare function sure<TGood, TBad, TInput, TMeta>(insure: Sure<TBad, TGood, TInput>, meta: TMeta): Sure<TBad, TGood, TInput, MetaObj<TMeta>>;
export declare function pure<TGood, TBad, TInput>(insure: Sure<TBad, TGood, TInput, MetaNever>): Sure<TBad, TGood, TInput, MetaNever>;
export declare function bad<TBad extends Primitive>(val: TBad): Bad<TBad>;
export declare function bad<TBad>(val: TBad): Bad<TBad>;
export declare function good<TGood extends Primitive>(val: TGood): Good<TGood>;
export declare function good<TGood>(val: TGood): Good<TGood>;
export type Unsure<TBad, TGood> = //
Good<TGood> | Bad<TBad>;
export type Good<T> = readonly [true, T];
export type Bad<T> = readonly [false, T];
export type InferBad<T extends Sure<unknown, unknown, any, MetaObj | MetaNever>> = T extends (...args: any) => infer COutput ? COutput extends readonly [false, infer CGood] ? CGood : never : never;
export type InferGood<T extends Sure<unknown, unknown, any, MetaObj | MetaNever>> = T extends (...args: any) => infer COutput ? COutput extends readonly [true, infer CGood] ? CGood : never : never;
export type InferInput<T extends Sure<unknown, unknown, any, MetaObj | MetaNever>> = T extends Sure<unknown, unknown, infer CFrom, MetaObj | MetaNever> ? CFrom : never;
export type InferMeta<T extends Sure<unknown, unknown, any, {}>> = T extends Sure<unknown, unknown, any, infer CMeta> ? CMeta : {};
