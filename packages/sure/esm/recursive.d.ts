import type { MetaObj, Sure } from './core.js';
export declare const RecurseSymbol: unique symbol;
export declare const recursiveElem: Sure<typeof RecurseSymbol, typeof RecurseSymbol, unknown>;
export type ReplaceSymbolWithObj<Obj extends Record<string, unknown>, With> = {
    [K in keyof Obj]: typeof RecurseSymbol extends Obj[K] ? With : Obj[K];
};
export declare function recurse<TBad extends Record<string, unknown>, TGood extends Record<string, unknown>, TChildBad, TChildGood>(//
baseObj: Sure<TBad, TGood, unknown>, //
childParser: (surer: typeof baseObj) => Sure<TChildBad, TChildGood, unknown>): Sure<ReplaceSymbolWithObj<TBad, TChildBad>, ReplaceSymbolWithObj<TGood, TChildGood>, unknown, MetaObj<{
    baseObj: typeof baseObj;
    childParser: typeof childParser;
}>>;
