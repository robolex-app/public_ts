import { bad, good, pure, sure } from './core.js'
import type { Peasy } from './core.js'

export const RecurseSymbol = Symbol('recurse')

export const recursiveElem = pure(() => good(RecurseSymbol))

// TODO: Add test for type and docs
type ReplaceSymbolWithObj<Obj extends Record<string, unknown>, With> = {
  [K in keyof Obj]: Obj[K] extends typeof RecurseSymbol //
    ? With
    : Obj[K]
  //
}

export function recurse<
  //
  // TKey extends keyof TGood,
  // TKey extends string,
  TBad,
  TGood extends Record<string, unknown>,
  TPrr extends Peasy<TGood>,
  TChildGood,
>( //
  baseObj: Peasy<TGood>, //
  // key: TKey,
  childrenPraser: (surer: Peasy<TGood>) => Peasy<TChildGood>
): Peasy<ReplaceSymbolWithObj<TGood, TChildGood>> {
  const rec = (value: unknown) => {
    const [isGood, unsure] = baseObj(value)

    if (!isGood) {
      return bad(unsure)
    }

    //

    let newChildrenGood = {}
    let newChildrenBad = {}

    for (const [key, elem] of Object.entries(unsure)) {
      if (elem !== RecurseSymbol) continue

      const [isGood, unsure] = childrenPraser(rec)(
        // here we send the value from the original object
        // Seems dangerous, maybe other implementation is better
        value[key]
      )

      if (!isGood) {
        // @ts-expect-error
        newChildrenBad[key] = unsure
      } else {
        // @ts-expect-error
        newChildrenGood[key] = unsure
      }
    }

    if (Object.keys(newChildrenBad).length) {
      return bad(newChildrenBad)
    }

    return good({ ...unsure, ...newChildrenGood })
  }

  // @ts-expect-error
  return sure(rec, {
    baseObj,
    childrenPraser,
  })
}
