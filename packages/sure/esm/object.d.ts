import type { Sure, InferGood, InferBad, MetaObj } from './core.js';
import { KVPair, Objectify, Prettify, Unionize } from './utils.js';
type PickOptionalsGood<T extends KVPair<Sure>> = T extends {
    v: Sure<unknown, unknown, any, MetaObj<{
        parent: typeof optional;
    }>>;
} ? {
    k: T['k'];
    v: InferGood<T['v']>;
} : never;
type PickNonOptionals<T extends KVPair<Sure>> = T extends {
    v: Sure<unknown, unknown, any, MetaObj<{
        parent: typeof optional;
    }>>;
} ? never : {
    k: T['k'];
    v: InferGood<T['v']>;
};
export type InferSchemaGood<T extends Record<string, Sure>> = Prettify<Partial<Objectify<PickOptionalsGood<Unionize<T>>>> & Objectify<PickNonOptionals<Unionize<T>>>>;
/**
 * Makes a object property `optional`
 * It doesn't make it nullable or undefinedable
 *
 * The `optional` function will be checked `only` by the `object` function.
 * In all other cases it will the value will not be perceived as optional.
 */
export declare function optional<TSchema extends Sure<unknown, unknown, any>>(schema: TSchema): Sure<InferBad<TSchema>, InferGood<TSchema>, unknown, MetaObj<{
    parent: typeof optional;
    schema: TSchema;
}>>;
export declare function object<TPropFail, TPropGood, TSchema extends Record<string, Sure<TPropFail, TPropGood, unknown>>>(schema: TSchema): Sure<{
    [K in keyof TSchema & string]?: InferBad<TSchema[K]>;
}, InferSchemaGood<TSchema>, unknown, MetaObj<{
    parent: typeof object;
    schema: TSchema;
}>>;
export {};
