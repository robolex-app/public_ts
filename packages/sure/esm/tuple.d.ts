import { MetaNever, MetaObj, Sure } from './core.js';
export type TupleInferGoods<T> = T extends readonly [infer First, ...infer InferRest] ? First extends Sure<unknown, infer Good, any, MetaObj | MetaNever> ? [Good, ...TupleInferGoods<InferRest>] : [] : [];
export type TupleInferBads<T> = T extends readonly [infer First, ...infer InferRest] ? First extends Sure<infer Bad, unknown, any, MetaObj | MetaNever> ? [Bad | undefined, ...TupleInferBads<InferRest>] : [] : [];
export declare function tupleRest<Arr extends Sure<unknown, unknown[], unknown>>(struct: Arr): Sure<unknown, unknown[], unknown, MetaObj<{
    func: typeof tupleRest;
    initial: unknown;
}>>;
export declare function tuple<Arr extends [Sure<unknown, unknown, any>, ...Sure<unknown, unknown, any>[]] | []>(arr: Arr): Sure<TupleInferBads<Arr>, TupleInferGoods<Arr>, unknown, MetaObj<Arr>>;
