import { sure, good } from './sure.js';
export function after(fromStruct, validate, meta) {
    const structValue = sure((value) => {
        const [good, out] = fromStruct(value);
        return good ? validate(out) : fail(out);
    }, meta);
    return structValue;
}
/**
Necessary because `typeof x` is not a type guard.
 */
function isObject(x) {
    return typeof x === 'object' && x !== null;
}
export function object(schema) {
    const metaEntries = Object.entries(schema).map(([key, struct]) => [key, struct.meta]);
    const objectMeta = Object.fromEntries(metaEntries);
    const struct = sure(value => {
        if (!isObject(value)) {
            return fail({});
        }
        const groupIssue = {};
        const groupValue = {};
        for (const [key, struct] of Object.entries(schema)) {
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
    }, objectMeta);
    // @ts-expect-error
    return struct;
}
