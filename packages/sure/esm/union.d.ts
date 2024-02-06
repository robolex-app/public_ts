import type { MetaNever, MetaObj, Sure } from './core.js';
export declare function union<TFirstBad, TFirstGood, TFirstInput, TFirstMeta extends MetaNever | MetaObj, TSecondBad, TSecondGood, TSecondInput, TSecondMeta extends MetaNever | MetaObj>(first: Sure<TFirstBad, TFirstGood, TFirstInput, TFirstMeta>, second: Sure<TSecondBad, TSecondGood, TSecondInput, TSecondMeta>): Sure<TFirstBad | TSecondBad, TFirstGood | TSecondGood, TFirstInput & TSecondInput, MetaObj<{
    first: typeof first;
    second: typeof second;
}>>;
export declare const or: typeof union;
