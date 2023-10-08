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
//
// export function sure<TFail, TGood, TInput>(insure: PureSure<TFail, TGood, TInput>): Sure<TFail, TGood, TInput, {}>
// export function sure<TFail, TGood, TInput, TMeta extends {}>(
//   insure: PureSure<TFail, TGood, TInput>,
//   meta: TMeta
// ): Sure<TFail, TGood, TInput, TMeta>
export function sure(insure, meta) {
    return Object.assign(insure, meta);
}
//
export const fail = (fail) => [false, fail];
//
export const good = (good) => [true, good];
