import { objEntries, objMapEntries } from '@robo/dependent-ts';
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
 * Necessary because `typeof x` is not a type guard.
 */
function isObject(x) {
    return typeof x === 'object' && x !== null;
}
const record = sure(value => {
    return isObject(value) ? good(value) : evil('not an object');
});
export const rawString = sure(value => {
    return typeof value === 'string' ? good(value) : evil('not a string');
});
export function object(schema) {
    // get meta of all fields
    const objectMeta = objMapEntries(schema, ([key, struct]) => {
        return [key, struct.meta];
    });
    const struct = sure(value => {
        if (!isObject(value))
            return evil({});
        const groupIssue = {};
        // @ts-expect-error TODO: Fix this
        const groupValue = {};
        for (const [key, struct] of objEntries(schema)) {
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
    return struct;
}
