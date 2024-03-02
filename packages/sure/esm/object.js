import { sure, good, bad } from './core.js';
/**
Necessary because `typeof x` is not a type guard.
 */
export function isObject(x) {
    return typeof x === 'object' && x !== null;
}
/**
 * Makes a object property `optional`
 * It doesn't make it nullable or undefinedable
 *
 * The `optional` function will be checked `only` by the `object` function.
 * In all other cases it will the value will not be perceived as optional.
 */
export function optional(schema) {
    // IMPORTANT: It's important to pass a new function here
    //            since `sure` will update the function with the meta
    // @ts-expect-error
    return sure(value => schema(value), {
        parent: optional,
        schema,
    });
}
export function object(schema) {
    // @ts-expect-error - TODO: expected
    return sure(value => {
        if (!isObject(value)) {
            return bad({});
        }
        const groupFail = {};
        const groupGood = {};
        for (const [key, sureFunction] of Object.entries(schema)) {
            const isOptional = isObject(sureFunction.meta) && sureFunction.meta.parent === optional;
            if (isOptional && !(key in value)) {
                continue;
            }
            const [good, unsure] = sureFunction(value[key]);
            if (good) {
                // @ts-expect-error
                groupGood[key] = unsure;
            }
            else {
                // @ts-expect-error
                groupFail[key] = unsure;
            }
        }
        if (Object.keys(groupFail).length) {
            return bad(groupFail);
        }
        return good(groupGood);
    }, {
        parent: object,
        schema,
    });
}
