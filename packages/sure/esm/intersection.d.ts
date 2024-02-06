import { MetaNever, MetaObj, Sure } from './core.js';
export declare function intersection<TFirstBad, TFirstGood extends Record<string, unknown>, TFirstInput, TFirstMeta extends MetaNever | MetaObj, TSecondBad, TSecondGood extends Record<string, unknown>, TSecondInput, TSecondMeta extends MetaNever | MetaObj>(first: Sure<TFirstBad, TFirstGood, TFirstInput, TFirstMeta>, second: Sure<TSecondBad, TSecondGood, TSecondInput, TSecondMeta>): Sure<TFirstBad | TSecondBad, TFirstGood & TSecondGood, TFirstInput & TSecondInput, MetaObj<{
    first: typeof first;
    second: typeof second;
}>>;
