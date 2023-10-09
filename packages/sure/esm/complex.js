import { sure, good, fail } from './core.js';
export function after(first, second, meta) {
    return sure((value) => {
        const [good, out] = first(value);
        return good ? second(out) : fail(out);
    }, meta);
}
/**
Necessary because `typeof x` is not a type guard.
 */
function isObject(x) {
    return typeof x === 'object' && x !== null;
}
export function object(schema) {
    const struct = sure(value => {
        if (!isObject(value)) {
            return fail({});
        }
        const groupIssue = {};
        const groupValue = {};
        for (const [key, struct] of Object.entries(schema)) {
            // TODO: Make different between `| undefined` and `?: somthing`
            // check if key actually exists
            const [good, unsure] = struct(value[key]);
            if (good) {
                // @ts-expect-error
                groupValue[key] = unsure;
            }
            else {
                // @ts-expect-error
                groupIssue[key] = unsure;
            }
        }
        if (Object.keys(groupIssue).length) {
            return fail(groupIssue);
        }
        return good(groupValue);
    }, schema);
    // @ts-expect-error
    return struct;
}
