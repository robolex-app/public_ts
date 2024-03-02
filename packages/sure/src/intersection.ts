import { MetaNever, MetaObj, Sure, sure, bad, good } from './core.js'

export function intersection<
  //
  TFirstBad,
  TFirstGood extends Record<string, unknown>,
  TFirstInput,
  TFirstMeta extends MetaNever | MetaObj,
  //
  TSecondBad,
  TSecondGood extends Record<string, unknown>,
  TSecondInput,
  TSecondMeta extends MetaNever | MetaObj,
>(
  first: Sure<TFirstBad, TFirstGood, TFirstInput, TFirstMeta>,
  second: Sure<TSecondBad, TSecondGood, TSecondInput, TSecondMeta>
): Sure<
  TFirstBad | TSecondBad,
  TFirstGood & TSecondGood,
  // Variance
  TFirstInput & TSecondInput,
  MetaObj<{ first: typeof first; second: typeof second }>
> {
  return sure(
    // @ts-expect-error Should be fixed at the definition of sure, I think.
    (value: TFirstInput & TSecondInput) => {
      const [isGoodFirst, unsureFirst] = first(value)

      if (!isGoodFirst) {
        return bad(unsureFirst)
      }

      const [isGoodSecond, unsureSecond] = second(value)

      if (!isGoodSecond) {
        return bad(unsureSecond)
      }

      // TODO: Should we enforce that the outputs are objects?
      return good({ ...unsureFirst, ...unsureSecond })
    },
    {
      first,
      second,
    }
  )
}

export const and = intersection
