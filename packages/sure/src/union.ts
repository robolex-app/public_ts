import { bad, good, sure } from './core.js'
import type { InferBad, InferGood, MetaNever, MetaObj, Sure } from './core.js'

export function union<
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
  first: Sure<TFirstBad, TFirstGood, TFirstInput, TFirstMeta>,
  second: Sure<TSecondBad, TSecondGood, TSecondInput, TSecondMeta>
): Sure<
  TFirstBad | TSecondBad,
  TFirstGood | TSecondGood,
  // Variance
  TFirstInput & TSecondInput,
  MetaObj<{
    parent: typeof union

    first: typeof first
    second: typeof second
  }>
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
      parent: union,

      first,
      second,
    }
  )
}

export const or = union
