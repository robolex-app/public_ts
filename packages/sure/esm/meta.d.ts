import { Sure } from './core.js';
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
    meta: infer Meta;
}> ? Meta : 'unknown';
