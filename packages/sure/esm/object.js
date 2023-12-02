import { sure, good, bad } from './core.js';
/**
Necessary because `typeof x` is not a type guard.
 */
function isObject(x) {
    return typeof x === 'object' && x !== null;
}
export function optional(schema) {
    // IMPORTANT: It's important to pass a new function here
    //            since `sure` will update the function with the meta
    return sure(value => schema(value), {
        parent: optional,
        schema,
    });
}
export function object(schema) {
    const struct = sure(value => {
        if (!isObject(value)) {
            return bad({});
        }
        const groupFail = {};
        const groupGood = {};
        for (const [key, sureFunction] of Object.entries(schema)) {
            // TODO: Make different between `| undefined` and `?: somthing`
            // check if key actually exists
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
    // @ts-expect-error
    return struct;
}
