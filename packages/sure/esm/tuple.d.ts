import { InferBad, InferGood, MetaNever, MetaObj, Sure } from './core.js';
export type TupleInferGoods_old<T> = T extends readonly [infer First, ...infer InferRest] ? First extends Sure<unknown, infer Good, any, MetaObj | MetaNever> ? [Good, ...TupleInferGoods<InferRest>] : [] : [];
export type TupleInferGoods<T> = T extends readonly [infer First, ...infer InferRest] ? First extends Sure<unknown, infer Good, any, infer Meta> ? Meta extends MetaObj<{
    parent: typeof spread_NOT_IMPLEMENTED;
}> ? Good extends readonly unknown[] ? [...Good, ...TupleInferGoods<InferRest>] : [
    Good,
    ...TupleInferGoods<InferRest>
] : [Good, ...TupleInferGoods<InferRest>] : [] : [];
export type TupleInferBads_old<T> = T extends readonly [infer First, ...infer InferRest] ? First extends Sure<infer Bad, unknown, any, MetaObj | MetaNever> ? [Bad | undefined, ...TupleInferBads<InferRest>] : [] : [];
export type TupleInferBads<T> = T extends readonly [infer First, ...infer InferRest] ? First extends Sure<infer Bad, unknown, any, infer Meta> ? Meta extends MetaObj<{
    parent: typeof spread_NOT_IMPLEMENTED;
}> ? Bad extends readonly unknown[] ? [...Bad, ...TupleInferBads<InferRest>] : [
    Bad | undefined,
    ...TupleInferBads<InferRest>
] : [Bad | undefined, ...TupleInferBads<InferRest>] : [] : [];
/**
 * @deprecated
 *
 * It's possible to add a spread operator.
 * But it's seems that it would add a lot of complexity and will have to link the library too much.
 *
 * A tuple would have to know about both the spread and an array.
 *
 * It made sense for `object` and `optional`, since they're linked.
 * But for tuples it can be more clearly implemented as a separate user-land function.
 */
export declare function spread_NOT_IMPLEMENTED<Arr extends Sure<unknown, unknown[], unknown>>(schema: Arr): Sure<InferBad<Arr>, InferGood<Arr>, unknown, MetaObj<{
    parent: typeof spread_NOT_IMPLEMENTED;
    schema: typeof schema;
}>>;
export declare function tuple<Arr extends [Sure<unknown, unknown, any>, ...Sure<unknown, unknown, any>[]] | []>(arr: Arr): Sure<TupleInferBads<Arr>, TupleInferGoods<Arr>, unknown, MetaObj<{
    parent: typeof tuple;
    schema: Arr;
}>>;
