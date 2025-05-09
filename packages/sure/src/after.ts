import { Sure, sure, bad, MetaObj, InferBad, InferGood, InferInput } from './core.js'

/**
A common use-case is to first validate that a value is a string.
And then validate other things about the string.

This function will run the @see first validator first.
If it returns a bad value, then the bad value is returned.

If it returns a good value, then the new @see second function will be run.
 */

export function after<
  TFirst extends Sure<unknown, unknown, any>,
  TSecond extends Sure<unknown, unknown, InferGood<TFirst>>,
>(
  first: TFirst,
  second: TSecond
): Sure<
  InferBad<TFirst> | InferBad<TSecond>,
  InferGood<TSecond>,
  InferInput<TFirst>,
  MetaObj<{
    type: 'after'
    first: typeof first
    second: typeof second
  }>
> {
  // @ts-expect-error TODO: check
  return sure(
    value => {
      const [good, out] = first(value)

      if (good) {
        return second(
          // @ts-expect-error TODO: check
          out
        )
      }

      return bad(out)
    },
    {
      type: 'after',
      first,
      second,
    }
  )
}
