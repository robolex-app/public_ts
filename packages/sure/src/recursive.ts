import { bad, good, pure, sure } from './core.js'
import type { MetaObj, Peasy, Pure, Sure } from './core.js'

export const RecurseSymbol = Symbol('recurse')

export const recursiveElem: Pure<
  // The `bad` type is used by the type system to replace the symbol
  typeof RecurseSymbol,
  typeof RecurseSymbol,
  unknown
> = pure(() => good(RecurseSymbol))

export type ReplaceSymbolWithObj<Obj extends Record<string, unknown>, With> = {
  [K in keyof Obj]: typeof RecurseSymbol extends Obj[K] //
    ? With
    : Obj[K]
  //
}

export function recurse<
  //
  // TKey extends keyof TGood,
  // TKey extends string,
  // TODO: TBad is very specific
  TBad extends Record<string, unknown>,
  TGood extends Record<string, unknown>,
  TChildBad,
  TChildGood,
>( //
  baseObj: Peasy<TGood, TBad>, //
  // key: TKey,
  childParser: (surer: typeof baseObj) => Peasy<TChildGood, TChildBad>
): Sure<
  Peasy<
    //
    ReplaceSymbolWithObj<TGood, TChildGood>,
    ReplaceSymbolWithObj<TBad, TChildBad>,
    unknown
  >,
  MetaObj<{
    baseObj: typeof baseObj
    childParser: typeof childParser
  }>
> {
  const rec = (value: unknown) => {
    const [isGoodObj, unsureObj] = baseObj(value)

    if (!isGoodObj) {
      return bad(unsureObj)
    }

    //

    let newChildrenGood = {}
    let newChildrenBad = {}

    for (const [key, elem] of Object.entries(unsureObj)) {
      if (elem !== RecurseSymbol) continue

      // @ts-expect-error
      const [isGood, unsure] = childParser(rec)(
        // here we send the value from the original object
        // Seems dangerous, maybe other implementation is better
        // @ts-expect-error TODO: fix
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

    return good({ ...unsureObj, ...newChildrenGood })
  }

  // @ts-expect-error
  return sure(rec, {
    baseObj,
    childrenPraser: childParser,
  })
}
