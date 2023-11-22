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
export function sure(insure, meta) {
    return Object.assign(insure, { meta });
}
export function pure(insure) {
    // @ts-expect-error
    return insure;
}
//
export const bad = (val) => [false, val];
//
export const good = (val) => [true, val];
