import { sure, good, evil } from './sure.js';
export function after(fromStruct, validate, meta) {
    const structValue = sure((value) => {
        const [good, out] = fromStruct(value);
        if (!good)
            return evil(out);
        return validate(out);
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
            return evil({});
        }
        const groupIssue = {};
        const groupValue = {};
        for (const [key, struct] of Object.entries(schema)) {
            const [good, unsure] = struct(value[key]);
            if (good) {
                // @ts-expect-error TODO: Fix this
                groupValue[key] = unsure;
            }
            else {
                // @ts-expect-error TODO: Fix this
                groupIssue[key] = unsure;
            }
        }
        if (Object.keys(groupIssue).length) {
            return evil(groupIssue);
        }
        return good(groupValue);
    }, objectMeta);
    // @ts-expect-error fix please
    return struct;
}
