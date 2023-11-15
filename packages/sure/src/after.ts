import { Pure, Sure, sure, evil, MetaObj } from './core.js'

/**
A common use-case is to first validate that a value is a string.
And then validate other things about the string.

This function will run the @see first validator first.
If it returns a bad value, then the bad value is returned.

If it returns a good value, then the new @see second function will be run.
 */

export function after<
  //
  TFirsTEvil,
  TFirstGood,
  TFirstInput,
  //
  TSecondFail,
  TSecondGood,
>(
  first: Pure<TFirsTEvil, TFirstGood, TFirstInput>,
  second: Pure<TSecondFail, TSecondGood, TFirstGood>
): Sure<TFirsTEvil | TSecondFail, TSecondGood, TFirstInput, MetaObj<undefined>>

export function after<
  //
  TFirsTEvil,
  TFirstGood,
  TFirstInput,
  //
  TSecondFail,
  TSecondGood,
  //
  TMeta,
>(
  first: Pure<TFirsTEvil, TFirstGood, TFirstInput>,
  second: Pure<TSecondFail, TSecondGood, TFirstGood>,
  meta: TMeta
): Sure<TFirsTEvil | TSecondFail, TSecondGood, TFirstInput, MetaObj<TMeta>>

export function after<
  //
  TFirsTEvil,
  TFirstGood,
  TFirstInput,
  //
  TSecondFail,
  TSecondGood,
  //
  TMeta,
>(
  first: Pure<TFirsTEvil, TFirstGood, TFirstInput>,
  second: Pure<TSecondFail, TSecondGood, TFirstGood>,
  meta?: TMeta
): Sure<TFirsTEvil | TSecondFail, TSecondGood, TFirstInput, MetaObj<TMeta | undefined>> {
  return sure((value: TFirstInput) => {
    const [good, out] = first(value)

    return good ? second(out) : evil<TFirsTEvil | TSecondFail>(out)
  }, meta)
}
