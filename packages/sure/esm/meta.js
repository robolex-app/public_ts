import { object } from './object.js';
import { objMapEntries } from './utils.js';
export function justMeta(insure) {
    // object.getMeta(insure) -> if not object -> null
    object;
    // @ts-expect-error more explicit?
    if (insure.meta?.type === 'object') {
        const { schema, ...rest } = insure.meta;
        const ret = objMapEntries(schema, ([key, value]) => {
            return [key, justMeta(value)];
        });
        return { schema: ret, ...rest };
    }
    // @ts-expect-error more explicit?
    if (insure.meta?.type === 'optional') {
        const { schema, ...rest } = insure.meta;
        return {
            schema: justMeta(schema),
            ...rest,
        };
    }
    // @ts-expect-error more explicit?
    if (insure.meta?.type === 'array') {
        const { schema, ...rest } = insure.meta;
        return {
            schema: justMeta(schema),
            ...rest,
        };
    }
    if (insure.meta) {
        return insure.meta;
    }
    return 'unknown';
}
