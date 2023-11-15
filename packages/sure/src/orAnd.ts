import { bad, good, sure } from './core.js'
import type { InferBad, InferGood, MetaNever, MetaObj, Pure, Sure } from './core.js'

export function or<
  //
  TFirstBad,
  TFirstGood,
  TFirstInput,
  TFirstMeta extends MetaNever | MetaObj,
  //
  TSecondBad,
  TSecondGood,
  TSecondInput,
  TSecondMeta extends MetaNever | MetaObj,
>(
  first: Sure<Pure<TFirstBad, TFirstGood, TFirstInput>, TFirstMeta>,
  second: Sure<Pure<TSecondBad, TSecondGood, TSecondInput>, TSecondMeta>
): Sure<
  Pure<
    TFirstBad | TSecondBad,
    TFirstGood | TSecondGood,
    // Variance
    TFirstInput & TSecondInput
  >,
  MetaObj<{ first: typeof first; second: typeof second }>
> {
  return sure(
    // @ts-expect-error Should be fixed at the definition of sure, I think.
    (value: TFirstInput & TSecondInput) => {
      const [isGoodFirst, unsureFirst] = first(value)

      if (isGoodFirst) {
        return good(unsureFirst)
      }

      return second(value)
    },
    {
      first,
      second,
    }
  )
}

export function and<
  //
  TFirstBad,
  TFirstGood,
  TFirstInput,
  TFirstMeta extends MetaNever | MetaObj,
  //
  TSecondBad,
  TSecondGood,
  TSecondInput,
  TSecondMeta extends MetaNever | MetaObj,
>(
  first: Sure<Pure<TFirstBad, TFirstGood, TFirstInput>, TFirstMeta>,
  second: Sure<Pure<TSecondBad, TSecondGood, TSecondInput>, TSecondMeta>
): Sure<
  Pure<
    TFirstBad | TSecondBad,
    TFirstGood & TSecondGood,
    // Variance
    TFirstInput & TSecondInput
  >,
  MetaObj<{ first: typeof first; second: typeof second }>
> {
  // @ts-expect-error Should be fixed at the definition of sure, I think.
  return sure(
    // @ts-expect-error Should be fixed at the definition of sure, I think.
    (value: TFirstInput & TSecondInput) => {
      const [isGoodFirst, unsureFirst] = first(value)

      if (!isGoodFirst) {
        return bad(unsureFirst)
      }

      return second(value)
    },
    {
      first,
      second,
    }
  )
}
