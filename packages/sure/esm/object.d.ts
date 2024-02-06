import type { Sure, InferGood, InferBad, MetaObj } from './core.js';
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
}, {
    [K in keyof TSchema & string]: InferGood<TSchema[K]>;
}, unknown, MetaObj<{
    parent: typeof object;
    schema: TSchema;
}>>;
