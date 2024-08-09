import { Sure } from './core.js';
import { PrettifyRec } from './utils.js';
export type ExtractPrimitives<TSchema> = {
    [t in keyof TSchema]: InferJustMeta<TSchema[t]>;
};
export type InferJustMeta<T> = T extends Sure<unknown, unknown, any, {
    meta: {
        type: 'object';
        schema: infer CSchema;
    };
}> ? {
    type: 'object';
    schema: ExtractPrimitives<CSchema>;
} : T extends Sure<unknown, unknown, any, {
    meta: {
        type: 'optional';
        schema: infer CSchema;
    };
}> ? {
    type: 'optional';
    schema: InferJustMeta<CSchema>;
} : T extends Sure<unknown, unknown, any, {
    meta: {
        type: 'array';
        schema: infer CSchema;
    };
}> ? {
    type: 'array';
    schema: InferJustMeta<CSchema>;
} : T extends Sure<unknown, unknown, any, {
    meta: infer Meta;
}> ? Meta : 'unknown';
export declare function justMeta<TSchema extends Sure<unknown, unknown, any>>(insure: TSchema): PrettifyRec<InferJustMeta<TSchema>>;
