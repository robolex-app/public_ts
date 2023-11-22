import { Sure, sure, bad, MetaObj } from './core.js'

/**
A common use-case is to first validate that a value is a string.
And then validate other things about the string.

This function will run the @see first validator first.
If it returns a bad value, then the bad value is returned.

If it returns a good value, then the new @see second function will be run.
 */

export function after<
  //
  TFirsTBad,
  TFirstGood,
  TFirstInput,
  //
  TSecondFail,
  TSecondGood,
>(
  first: Sure<TFirsTBad, TFirstGood, TFirstInput>,
  second: Sure<TSecondFail, TSecondGood, TFirstGood>
): Sure<
  TFirsTBad | TSecondFail,
  TSecondGood,
  TFirstInput,
  MetaObj<{
    first: typeof first
    second: typeof second
  }>
> {
  return sure(
    (value: TFirstInput) => {
      const [good, out] = first(value)

      return good ? second(out) : bad<TFirsTBad | TSecondFail>(out)
    },
    {
      first,
      second,
    }
  )
}
